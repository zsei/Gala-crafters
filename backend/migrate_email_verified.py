import os
import sys
from sqlalchemy import text
from database import engine

def apply_migration():
    try:
        with engine.connect() as conn:
            # Check if column exists first
            check_query = text("SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='is_email_verified';")
            result = conn.execute(check_query).fetchone()
            
            if not result:
                print("Adding is_email_verified column to users table...")
                conn.execute(text("ALTER TABLE users ADD COLUMN is_email_verified BOOLEAN DEFAULT FALSE;"))
                conn.commit()
                print("Migration successful.")
            else:
                print("Column is_email_verified already exists in users table.")
    except Exception as e:
        print(f"Migration Failed: {e}")

if __name__ == "__main__":
    apply_migration()
