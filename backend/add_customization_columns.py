"""
Migration script to add event customization columns to bookings table
"""

from database import SessionLocal
from sqlalchemy import text

def add_event_customization_columns():
    """Add event customization fields to bookings table"""
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("ADDING EVENT CUSTOMIZATION COLUMNS")
        print("=" * 60)
        
        # Add columns one by one if they don't exist
        columns_to_add = [
            ("event_theme", "VARCHAR(255)"),
            ("color_palette", "VARCHAR(255)"),
            ("event_location", "VARCHAR(255)"),
            ("specific_venue_address", "VARCHAR(500)"),
            ("special_requests", "TEXT")
        ]
        
        for col_name, col_type in columns_to_add:
            check_query = text(f"""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='bookings' AND column_name='{col_name}'
            """)
            
            result = db.execute(check_query).first()
            
            if not result:
                # Column doesn't exist, add it
                alter_query = text(f"""
                    ALTER TABLE bookings 
                    ADD COLUMN {col_name} {col_type}
                """)
                db.execute(alter_query)
                print(f"  ✓ Added column: {col_name}")
            else:
                print(f"  ✓ Column already exists: {col_name}")
        
        db.commit()
        
        print("\n" + "=" * 60)
        print("✅ All event customization columns ready!")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_event_customization_columns()
