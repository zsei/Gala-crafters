"""
Insert test bookings with past/today event dates to test automatic status update
Uses raw SQL to avoid type conversion issues
"""

from database import SessionLocal
from sqlalchemy import text
from datetime import date, timedelta
import uuid

def insert_test_bookings_with_past_dates():
    """Insert test bookings with event dates in the past using raw SQL"""
    db = SessionLocal()
    
    try:
        # Get first customer
        customer_query = text("SELECT id FROM users WHERE user_role = 'Customer' LIMIT 1")
        customer_result = db.execute(customer_query).first()
        
        if not customer_result:
            print("❌ No customer found in database")
            return
        
        customer_id = customer_result[0]
        
        # Get first package
        package_query = text("SELECT id FROM event_packages LIMIT 1")
        package_result = db.execute(package_query).first()
        
        if not package_result:
            print("❌ No event package found in database")
            return
        
        package_id = package_result[0]
        
        # Create 3 test bookings with different dates using raw SQL
        today = date.today()
        
        test_bookings = [
            {
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today - timedelta(days=5),  # 5 days ago
                "venue": "Grand Ballroom - Past Event",
                "price": 95000
            },
            {
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today,  # Today
                "venue": "Luxury Hotel - Today Event",
                "price": 125000
            },
            {
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today - timedelta(days=2),  # 2 days ago
                "venue": "Resort & Spa - Past Event",
                "price": 110000
            }
        ]
        
        print("=" * 60)
        print("INSERTING TEST BOOKINGS FOR AUTO-STATUS UPDATE TEST")
        print("=" * 60)
        
        insert_query = text("""
            INSERT INTO bookings (
                booking_reference, customer_id, package_id, event_date, 
                event_type, venue_proposed, guest_count, total_price, 
                status, notes, created_at, updated_at
            ) VALUES 
            (:ref1, :cust, :pkg, :date1, 'Wedding', :venue1, 150, :price1, 'Confirmed', 'Test booking for auto-status update', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (:ref2, :cust, :pkg, :date2, 'Wedding', :venue2, 150, :price2, 'Confirmed', 'Test booking for auto-status update', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
            (:ref3, :cust, :pkg, :date3, 'Wedding', :venue3, 150, :price3, 'Confirmed', 'Test booking for auto-status update', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        """)
        
        db.execute(insert_query, {
            'ref1': test_bookings[0]["ref"],
            'cust': customer_id,
            'pkg': package_id,
            'date1': test_bookings[0]["date"],
            'venue1': test_bookings[0]["venue"],
            'price1': test_bookings[0]["price"],
            
            'ref2': test_bookings[1]["ref"],
            'date2': test_bookings[1]["date"],
            'venue2': test_bookings[1]["venue"],
            'price2': test_bookings[1]["price"],
            
            'ref3': test_bookings[2]["ref"],
            'date3': test_bookings[2]["date"],
            'venue3': test_bookings[2]["venue"],
            'price3': test_bookings[2]["price"],
        })
        
        db.commit()
        
        print("\n✓ Test Booking 1:")
        print(f"  Reference: {test_bookings[0]['ref']}")
        print(f"  Event Date: {test_bookings[0]['date']}")
        print(f"  Venue: {test_bookings[0]['venue']}")
        print(f"  Initial Status: Confirmed (will auto-update to 'On-going Event')")
        
        print("\n✓ Test Booking 2:")
        print(f"  Reference: {test_bookings[1]['ref']}")
        print(f"  Event Date: {test_bookings[1]['date']}")
        print(f"  Venue: {test_bookings[1]['venue']}")
        print(f"  Initial Status: Confirmed (will auto-update to 'On-going Event')")
        
        print("\n✓ Test Booking 3:")
        print(f"  Reference: {test_bookings[2]['ref']}")
        print(f"  Event Date: {test_bookings[2]['date']}")
        print(f"  Venue: {test_bookings[2]['venue']}")
        print(f"  Initial Status: Confirmed (will auto-update to 'On-going Event')")
        
        print("\n" + "=" * 60)
        print("✅ Successfully inserted 3 test bookings!")
        print("\nHow to test:")
        print("1. Go to http://localhost:5173/admin/bookings?status=all")
        print("2. You should see bookings with dates today or in the past")
        print("3. Their status should be 'On-going Event' (auto-updated)")
        print("\nNote: Status updates automatically when admin views bookings")
        print("=" * 60)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    insert_test_bookings_with_past_dates()
