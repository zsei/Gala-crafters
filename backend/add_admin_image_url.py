from database import engine
from sqlalchemy import text

def add_admin_image_url_column():
    print("Adding image_url column to admin_users table...")
    try:
        with engine.connect() as conn:
            conn.execute(text("ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)"))
            conn.commit()
        print("✓ Column added successfully!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_admin_image_url_column()
