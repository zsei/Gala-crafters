"""
Add image_url column to event_packages table if it doesn't exist
"""

from sqlalchemy import text
from database import SessionLocal, engine

def add_image_url_column():
    """Add image_url column to event_packages"""
    db = SessionLocal()
    try:
        # Check if column already exists
        result = db.execute(text("""
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'event_packages' AND column_name = 'image_url'
        """)).fetchone()
        
        if result:
            print("✅ image_url column already exists")
            return
        
        # Add the column
        db.execute(text("""
            ALTER TABLE event_packages 
            ADD COLUMN image_url VARCHAR(255) DEFAULT NULL
        """))
        
        db.commit()
        print("✅ Successfully added image_url column to event_packages table")
    except Exception as e:
        print(f"❌ Error adding column: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_image_url_column()
