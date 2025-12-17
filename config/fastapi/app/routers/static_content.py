from fastapi import APIRouter

router = APIRouter()

@router.get("/endpoint")
async def endpoint():
    return [
        {"imie": "Adrian"},
        {"imie": "Mateusz"},
        {"imie": "Bassam"}
        ]