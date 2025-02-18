from pydantic import BaseModel


class UserQuestion(BaseModel):
    message: str
