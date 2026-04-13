from database import engine
from sqlalchemy import text

def migrate_messages_table():
    print("Adding missing columns to messages table...")
    try:
        with engine.connect() as conn:
            # Add image_url if it doesn't exist
            conn.execute(text("ALTER TABLE messages ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)"))
            # Add event_type if it doesn't exist
            conn.execute(text("ALTER TABLE messages ADD COLUMN IF NOT EXISTS event_type VARCHAR(100)"))
            conn.commit()
        print("✓ Migration successful!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    migrate_messages_table()
