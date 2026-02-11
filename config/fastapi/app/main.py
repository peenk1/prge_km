from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.static_content import router as static_router
from app.routers.db_insert import router_insert
from app.routers.dynamic_content import router as dynamic_router

app = FastAPI(title="Mapbook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(static_router, prefix="/app")
app.include_router(router_insert, prefix="/app")
app.include_router(dynamic_router, prefix="/app")
