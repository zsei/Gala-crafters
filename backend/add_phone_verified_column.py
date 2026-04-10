"""
Migration script to add is_phone_verified column to users table
Run this once to update the database schema
"""

from sqlalchemy import text
from database import engine

def add_phone_verified_column():
    """Add is_phone_verified column to users table if it doesn't exist"""
    with engine.connect() as connection:
        try:
            # Check if column already exists
            result = connection.execute(
                text("SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='is_phone_verified'")
            )
            
            if result.fetchone():
                print("✓ is_phone_verified column already exists")
                return
            
            # Add the column
            connection.execute(
                text("ALTER TABLE users ADD COLUMN is_phone_verified BOOLEAN DEFAULT FALSE")
            )
            connection.commit()
            print("✓ Successfully added is_phone_verified column to users table")
            
        except Exception as e:
            print(f"✗ Error adding column: {e}")
            connection.rollback()

if __name__ == "__main__":
    print("Running migration: Adding is_phone_verified column...")
    add_phone_verified_column()
    print("Migration complete!")
