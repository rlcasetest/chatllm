from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from basf.api.endpoints.chat import prefix, router

app = FastAPI()
any = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=any,
    allow_credentials=True,
    allow_methods=any,
    allow_headers=any,
)
app.include_router(router, prefix=prefix)


@app.get("/health")
async def health_check():
    return {"message": "This service is working."}
