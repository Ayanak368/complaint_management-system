from pydantic import BaseModel, EmailStr

#user creation and response schemas

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    model_config = {"from_attributes": True}   
    
#login request and response schemas

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str