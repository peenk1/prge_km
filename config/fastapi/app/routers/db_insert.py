from fastapi import APIRouter
from sqlalchemy import create_engine, text

from app.settings import db_name, db_user, db_password

router_insert = APIRouter()

def connect_to_db(db_name: str, db_user: str, db_password: str):
    return create_engine(
        f"postgresql://{db_user}:{db_password}@postgis:5432/{db_name}"
    )

@router_insert.get("/insert_user")
async def insert_user():

    try:
        db_connection = connect_to_db(db_name=db_name, db_user=db_user, db_password=db_password)

        sql_query = """
                    inser into users (name, posts, location)
                    values ('Jan', 3, 'Gdańsk'); \
                    """)

        with db_connection.connect() as conn:
            result = conn.execute(sql_query)
            conn.commit()
            print(result)


    except Exception as e:
        print(e)
        raise e






    return {'status': 1}