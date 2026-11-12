from pydantic import BaseModel
from datetime import datetime


class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str


class ComplaintResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    status: str
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}