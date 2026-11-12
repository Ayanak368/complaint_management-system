from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user,is_admin
from app.models.user import User
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate, ComplaintResponse, AdminReply, ComplaintStatusUpdate

router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"] 
)


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

    return new_complaint


@router.get("/my", response_model=list[ComplaintResponse])
def get_my_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaints = db.query(Complaint).filter(
        Complaint.user_id == current_user.id
    ).all()

    return complaints


@router.get("/", response_model=list[ComplaintResponse])
def get_all_complaints(
    db: Session = Depends(get_db),
    admin: User = Depends(is_admin)
):
    complaints = db.query(Complaint).all()

    return complaints

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

    return complaint

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

    complaint.status = status_data.status

    db.commit()
    db.refresh(complaint)

    return complaint