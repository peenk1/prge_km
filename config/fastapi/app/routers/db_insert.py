from fastapi import APIRouter
from sqlalchemy import create_engine

router = APIRouter()

def connect_to_db():
    return create_engine(
        f"postgresql://postgres:postgres@postgis:5432/postgres"
    )

@router_insert.get("/import_user")
async def insert_user():

    try:
        db_connection = connect_to_db()

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