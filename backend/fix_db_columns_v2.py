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
        print("Migrating database for image support...")
        try:
            conn.execute(text("ALTER TABLE messages ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)"))
            print("✓ Checked image_url in messages")
        except Exception as e:
            print(f"Error messages: {e}")
            
        try:
            conn.execute(text("ALTER TABLE admin_messages ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)"))
            print("✓ Checked image_url in admin_messages")
        except Exception as e:
            print(f"Error admin_messages: {e}")
        
        conn.commit()

if __name__ == "__main__":
    migrate()
