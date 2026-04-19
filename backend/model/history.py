from pydantic import BaseModel, EmailStr

class History(BaseModel):
    email: EmailStr
    text: str
    prediction: str
    confidence: str