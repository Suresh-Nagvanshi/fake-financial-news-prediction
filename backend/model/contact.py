from pydantic import BaseModel, EmailStr

class Contact(BaseModel):
    email: EmailStr
    message: str
    project_id: str | None = None