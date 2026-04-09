from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import pandas as pd
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "").replace(
    "postgresql://", "postgresql+psycopg2://"
)

engine = create_engine(DATABASE_URL)

def query_df(sql: str, params: dict = {}) -> pd.DataFrame:
    with engine.connect() as conn:
        return pd.read_sql(text(sql), conn, params=params)

def execute(sql: str, params: dict = {}):
    with engine.connect() as conn:
        conn.execute(text(sql), params)
        conn.commit()

def test_connection():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("Database connection successful")
        return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False