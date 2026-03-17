import os
from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:password@localhost/gala_crafters_db"
engine = create_engine(DATABASE_URL)

try:
    print("Connecting to database...")
    with engine.connect() as connection:
        print("Connected! Executing query...")
        result = connection.execute(text("SELECT id, email FROM users LIMIT 1"))
        for row in result:
            print(f"Row: {row}")
    print("Query successful!")
except Exception as e:
    print(f"Error: {e}")
