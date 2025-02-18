from typing import Annotated

from fastapi import APIRouter, Header, HTTPException
from fastapi.encoders import jsonable_encoder
from postgrest.exceptions import APIError

from basf.ai import ask_ai
from basf.api.validation.question import UserQuestion
from basf.db.supabase import supabase

router = APIRouter()
prefix = "/api/v1"


# Transforms a bearer token into an user id.
# Returns HTTP 404 if it can't find the user id.
def get_user_id(authorization: str | None):
    print(authorization)
    try:
        jwt = authorization.replace("Bearer ", "")
        user = supabase.auth.get_user(jwt)
        return user.model_dump()["user"]["id"]
    except Exception as e:
        raise HTTPException(status_code=404, detail="Could not find user")


@router.post("/chat")
async def chat(
    user_request: UserQuestion, authorization: Annotated[str | None, Header()] = None
):
    user_id = get_user_id(authorization)

    data = jsonable_encoder(user_request)
    supabase.table("history").insert(
        {"sender": "user", "message": data["message"], "user_id": user_id}
    ).execute()

    response = ask_ai(data["message"])
    supabase.table("history").insert(
        {"sender": "llm", "message": response, "user_id": user_id}
    ).execute()

    return {"answer": response}


@router.get("/history")
async def history(authorization: Annotated[str | None, Header()] = None):
    user_id = get_user_id(authorization)

    return (
        supabase.table("history").select("*").eq("user_id", user_id).execute()
    ).model_dump()
