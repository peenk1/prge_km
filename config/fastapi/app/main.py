from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.db_insert import router_insert

app = FastAPI(title="Mapbook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(router_insert, prefix="/app")
