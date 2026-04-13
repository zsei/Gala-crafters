
import os
from sqlalchemy import text
from database import engine

def migrate():
    print("Migrating event_packages table...")
    columns_to_add = [
        ("detailed_description", "TEXT"),
        ("min_guests", "INTEGER"),
        ("extra_pax_rate", "FLOAT"),
        ("included_items", "TEXT")
    ]
    
    with engine.connect() as conn:
        for col_name, col_type in columns_to_add:
            try:
                print(f"Adding column {col_name}...")
                conn.execute(text(f"ALTER TABLE event_packages ADD COLUMN {col_name} {col_type}"))
                conn.commit()
                print(f"✓ Added {col_name}")
            except Exception as e:
                # Check if column already exists
                if "already exists" in str(e).lower():
                    print(f"i Column {col_name} already exists.")
                else:
                    print(f"X Error adding column {col_name}: {e}")
    
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
