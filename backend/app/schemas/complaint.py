from pydantic import BaseModel
from datetime import datetime
from typing import Literal


class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str
    
class AdminReply(BaseModel):
    admin_reply: str
    
    
class ComplaintStatusUpdate(BaseModel):
    status: Literal["PENDING", "IN_PROGRESS", "RESOLVED"]


class ComplaintResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    status: str
    user_id: int
    created_at: datetime
    admin_reply: str | None = None

    model_config = {"from_attributes": True}
    
class AdminComplaintResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    status: str
    user_id: int
    priority: str
    created_at: datetime
    admin_reply: str | None = None
    student_name: str
    student_email: str

    model_config = {"from_attributes": True}
    
class ComplaintPriorityUpdate(BaseModel):
    priority: Literal["LOW", "NORMAL", "HIGH"]
    
