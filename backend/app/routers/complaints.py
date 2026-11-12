from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate, ComplaintResponse

router = APIRouter()


@router.post("/complaints", response_model=ComplaintResponse)
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