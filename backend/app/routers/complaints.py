
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user, is_admin
from app.models.user import User
from app.models.complaint import Complaint

from app.schemas.complaint import (
    ComplaintCreate,
    ComplaintResponse,
    AdminReply,
    ComplaintStatusUpdate,
    AdminComplaintResponse,
    ComplaintPriorityUpdate
)

from app.services.email_service import send_email


router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)


# 1. Student submits a complaint
@router.post("/", response_model=ComplaintResponse)
def create_complaint(
    complaint_data: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "USER":
        raise HTTPException(
            status_code=403,
            detail="Only students can submit complaints"
        )

    new_complaint = Complaint(
        title=complaint_data.title,
        description=complaint_data.description,
        category=complaint_data.category,
        user_id=current_user.id
    )

    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    # Send confirmation email
    try:
        send_email(
            to_email=current_user.email,
            subject="Complaint Submitted Successfully",
            body=f"""
Hello {current_user.name},

Your complaint has been submitted successfully.

Complaint ID: {new_complaint.id}
Title: {new_complaint.title}
Category: {new_complaint.category}
Priority: {new_complaint.priority}

Thank you.
College Complaint Management System
"""
        )
    except Exception as e:
        print("Email sending failed:", e)

    return new_complaint


# 2. Student views their complaints
@router.get("/my", response_model=list[ComplaintResponse])
def get_my_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    complaints = db.query(Complaint).filter(
        Complaint.user_id == current_user.id
    ).all()

    return complaints


# 3. Admin views all complaints
@router.get("/", response_model=list[AdminComplaintResponse])
def get_all_complaints(
    db: Session = Depends(get_db),
    admin: User = Depends(is_admin)
):

    results = (
        db.query(Complaint, User)
        .join(User, Complaint.user_id == User.id)
        .all()
    )

    complaints = []

    for complaint, student in results:
        complaints.append({
            "id": complaint.id,
            "title": complaint.title,
            "description": complaint.description,
            "category": complaint.category,
            "status": complaint.status,
            "priority": complaint.priority,
            "user_id": complaint.user_id,
            "created_at": complaint.created_at,
            "admin_reply": complaint.admin_reply,
            "student_name": student.name,
            "student_email": student.email,
        })

    return complaints


# 4. Admin replies to a complaint
@router.put("/{complaint_id}/reply", response_model=ComplaintResponse)
def reply_to_complaint(
    complaint_id: int,
    reply_data: AdminReply,
    db: Session = Depends(get_db),
    admin: User = Depends(is_admin)
):

    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id
    ).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    complaint.admin_reply = reply_data.admin_reply

    db.commit()
    db.refresh(complaint)

    # Find student who submitted the complaint
    student = db.query(User).filter(
        User.id == complaint.user_id
    ).first()

    # Send reply notification
    if student:
        try:
            send_email(
                to_email=student.email,
                subject="Admin Replied to Your Complaint",
                body=f"""
Hello {student.name},

The admin has replied to your complaint.

Complaint ID: {complaint.id}
Complaint Title: {complaint.title}

Admin Reply:
{complaint.admin_reply}

Thank you.
College Complaint Management System
"""
            )
        except Exception as e:
            print("Email sending failed:", e)

    return complaint


# 5. Admin updates complaint status
@router.put("/{complaint_id}/status", response_model=ComplaintResponse)
def update_complaint_status(
    complaint_id: int,
    status_data: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(is_admin)
):

    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id
    ).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    old_status = complaint.status
    complaint.status = status_data.status

    db.commit()
    db.refresh(complaint)

    # Find student
    student = db.query(User).filter(
        User.id == complaint.user_id
    ).first()

    # Send email only if status actually changed
    if student and old_status != complaint.status:
        try:
            send_email(
                to_email=student.email,
                subject="Complaint Status Updated",
                body=f"""
Hello {student.name},

Your complaint status has been updated.

Complaint ID: {complaint.id}
Complaint Title: {complaint.title}

Previous Status: {old_status}
New Status: {complaint.status}

Thank you.
College Complaint Management System
"""
            )
        except Exception as e:
            print("Email sending failed:", e)

    return complaint


# 6. Admin updates complaint priority
@router.put("/{complaint_id}/priority", response_model=ComplaintResponse)
def update_complaint_priority(
    complaint_id: int,
    priority_data: ComplaintPriorityUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(is_admin)
):

    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id
    ).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    complaint.priority = priority_data.priority

    db.commit()
    db.refresh(complaint)

    return complaint
