from fastapi import FastAPI
from app.routers.static_content import router
app = FastAPI(title="Mapbook API")

app.include_router(router, prefix="/app")
app.include_router(router_insert, prefix="/app")
