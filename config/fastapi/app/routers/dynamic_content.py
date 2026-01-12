from fastapi import APIRouter
from sqlalchemy import create_engine, text
from app.settings import db_name, db_user, db_password

router_get_users = APIRouter()

def connect_to_db(db_name: str, db_user: str, db_password: str):
    return create_engine(
        f"postgresql://{db_user}:{db_password}@postgis:5432/{db_name}"
    )

@router_get_users.get("/get_users")
async def get_users():

    try:
        db_connection = connect_to_db(db_name=db_name, db_user=db_user, db_password=db_password)

        sql_query = text("""select * from users""")

        with db_connection.connect() as conn:
            result = conn.execute(sql_query)
            users = [dict(row._mapping)for row in result]

        return {"status": "success", "data": users}

    except Exception as e:
        print(f' blad podczas get_users')
        return {"status": str(e)}

