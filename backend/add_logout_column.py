"""
Migration script to add last_logout_at column to users table
Run this once to update the database schema
"""

from sqlalchemy import text
from database import engine

def add_logout_column():
    """Add last_logout_at column to users table if it doesn't exist"""
    with engine.connect() as connection:
        try:
            # Check if column already exists
            result = connection.execute(
                text("SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='last_logout_at'")
            )
            
            if result.fetchone():
                print("✓ last_logout_at column already exists")
                return
            
            # Add the column
            connection.execute(
                text("ALTER TABLE users ADD COLUMN last_logout_at TIMESTAMP NULL")
            )
            connection.commit()
            print("✓ Successfully added last_logout_at column to users table")
            
        except Exception as e:
            print(f"✗ Error adding column: {e}")
            connection.rollback()

if __name__ == "__main__":
    print("Running migration: Adding last_logout_at column...")
    add_logout_column()
    print("Migration complete!")
