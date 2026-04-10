"""
Insert test pending bookings for admin testing
Run this once to populate test data
"""

from database import SessionLocal
from models import User, EventPackage
from datetime import datetime, timedelta
from sqlalchemy import text
import uuid

def insert_test_bookings():
    """Insert test pending bookings using raw SQL"""
    db = SessionLocal()
    try:
        # Get first customer and first package for test
        customer = db.query(User).filter(User.user_role == 'Customer').first()
        package = db.query(EventPackage).first()
        
        if not customer or not package:
            print("❌ No customer or package found in database")
            print("   Please create a customer account and package first")
            return
        
        # Insert using raw SQL to avoid type conversion issues
        insert_query = text("""
            INSERT INTO bookings (
                booking_reference, customer_id, package_id, event_date, 
                guest_count, venue_proposed, total_price, status, notes, 
                created_at, updated_at
            ) VALUES 
            (:ref1, :cust, :pkg, :date1, 150, 'Grand Ballroom', 95000, 'Pending', 'Pending approval from customer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (:ref2, :cust, :pkg, :date2, 200, 'Luxury Hotel Venue', 125000, 'Pending', 'Awaiting final confirmation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (:ref3, :cust, :pkg, :date3, 180, 'Resort & Spa', 110000, 'Pending', 'New booking received', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        """)
        
        db.execute(insert_query, {
            'ref1': f"BK{uuid.uuid4().hex[:8].upper()}",
            'ref2': f"BK{uuid.uuid4().hex[:8].upper()}",
            'ref3': f"BK{uuid.uuid4().hex[:8].upper()}",
            'cust': customer.id,
            'pkg': package.id,
            'date1': datetime.now() + timedelta(days=30),
            'date2': datetime.now() + timedelta(days=45),
            'date3': datetime.now() + timedelta(days=60)
        })
        
        db.commit()
        print("✅ Successfully inserted 3 test pending bookings!")
        print(f"   Customer: {customer.first_name} {customer.last_name}")
        print(f"   Package: {package.package_name}")
        print("\n📌 Go to: http://localhost:5173/admin/bookings?status=pending")
        
    except Exception as e:
        print(f"❌ Error inserting test bookings: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    insert_test_bookings()
