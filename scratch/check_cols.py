import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sqlalchemy import text
from backend.database import engine

def check_cols():
    with engine.connect() as conn:
        res = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'event_packages'"))
        columns = [row[0] for row in res]
        print(f"Columns in event_packages: {columns}")
        
        res = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'reviews'"))
        columns = [row[0] for row in res]
        print(f"Columns in reviews: {columns}")

if __name__ == "__main__":
    check_cols()
