from fastapi import FastAPI
from app.routers.static_content import router
from app.routers.db_insert import router_insert
from app.routers.dynamic_content import router_get_users

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Mapbook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(router, prefix="/app")
app.include_router(router_insert, prefix="/app")
app.include_router(router_get_users, prefix="/app")

