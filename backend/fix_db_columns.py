import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql://postgres:password@localhost/gala_crafters_db"

engine = create_engine(DATABASE_URL)

def migrate():
    with engine.connect() as conn:
        print("Migrating database...")
        try:
            conn.execute(text("ALTER TABLE admin_messages ADD COLUMN sender_type VARCHAR(20) DEFAULT 'admin'"))
            conn.commit()
            print("✓ Added sender_type column to admin_messages")
        except Exception as e:
            if "already exists" in str(e):
                print("✓ Column sender_type already exists")
            else:
                print(f"Error: {e}")

if __name__ == "__main__":
    migrate()
