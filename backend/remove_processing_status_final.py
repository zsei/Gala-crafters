
from database import SessionLocal
from sqlalchemy import text

def remove_processing_data():
    """Permanently delete all bookings with 'Processing' status"""
    db = SessionLocal()
    try:
        print("🔍 Searching for bookings with status 'Processing'...")
        
        # Count records first
        count_query = text("SELECT COUNT(*) FROM bookings WHERE status = 'Processing'")
        count = db.execute(count_query).scalar()
        
        if count == 0:
            print("✅ No records found with 'Processing' status.")
            return

        print(f"🗑️ Found {count} records. Deleting permanently...")
        
        # Delete records
        delete_query = text("DELETE FROM bookings WHERE status = 'Processing'")
        db.execute(delete_query)
        db.commit()
        
        print(f"✨ Successfully deleted {count} records from the database.")
        
    except Exception as e:
        print(f"❌ Error during deletion: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    remove_processing_data()
