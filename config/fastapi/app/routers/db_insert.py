from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, text

from app.settings import db_name, db_user, db_password

router_insert = APIRouter()

def connect_to_db(db_name: str, db_user: str, db_password: str):
    return create_engine(
        f"postgresql://{db_user}:{db_password}@postgis:5432/{db_name}",
        pool_pre_ping=True,
    )

# --- zostawiamy Twoje stare API (żeby nic nie rozwalić) ---
class UserData(BaseModel):
    name: str
    posts: int
    location: str

@router_insert.post("/insert_user")
async def insert_user(user: UserData):
    try:
        engine = connect_to_db(db_name, db_user, db_password)
        query = text("INSERT INTO users (name, posts, location) VALUES (:name, :posts, :location)")
        with engine.begin() as conn:
            conn.execute(query, {"name": user.name, "posts": user.posts, "location": user.location})
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- NOWE: RESTAURACJE ---
class RestaurantCreate(BaseModel):
    name: str
    street: str
    building_no: str
    city: str
    image_url: str | None = None


@router_insert.get("/restaurants")
async def get_restaurants():
    try:
        engine = connect_to_db(db_name, db_user, db_password)
        q = text("""
            SELECT id, name, street, building_no, city, image_url, created_at
            FROM public.restaurants
            ORDER BY created_at DESC, id DESC
        """)
        with engine.begin() as conn:
            rows = conn.execute(q).mappings().all()
        return list(rows)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router_insert.get("/restaurants/{restaurant_id}")
async def get_restaurant(restaurant_id: int):
    try:
        engine = connect_to_db(db_name, db_user, db_password)
        q = text("""
            SELECT id, name, street, building_no, city, image_url, created_at
            FROM public.restaurants
            WHERE id = :id
        """)
        with engine.begin() as conn:
            row = conn.execute(q, {"id": restaurant_id}).mappings().first()
        if not row:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        return dict(row)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router_insert.post("/restaurants")
async def create_restaurant(payload: RestaurantCreate):
    try:
        engine = connect_to_db(db_name, db_user, db_password)
        q = text("""
            INSERT INTO public.restaurants (name, street, building_no, city, image_url)
            VALUES (:name, :street, :building_no, :city, :image_url)
            RETURNING id, name, street, building_no, city, image_url, created_at
        """)
        params = payload.model_dump()
        with engine.begin() as conn:
            row = conn.execute(q, params).mappings().first()
        return dict(row)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
