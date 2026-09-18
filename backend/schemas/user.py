import uuid
from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    email: EmailStr
    name: str
    school: str
    major: str

class UserCreate(UserBase):
    google_id: str
    student_id: str

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    public_id: uuid.UUID
    student_id: str

class UserInDB(UserResponse):
    id: int
    google_id: str