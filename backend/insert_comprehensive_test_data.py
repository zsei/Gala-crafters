"""
Comprehensive test data insertion for booking status verification
Creates bookings with various dates to test auto-status update feature
"""

from database import SessionLocal
from sqlalchemy import text
from datetime import date, timedelta
import uuid

def insert_comprehensive_test_data():
    """Insert test bookings with various dates and statuses"""
    db = SessionLocal()
    
    try:
        # Get first customer
        customer_query = text("SELECT id FROM users WHERE user_role = 'Customer' LIMIT 1")
        customer_result = db.execute(customer_query).first()
        
        if not customer_result:
            print("❌ No customer found. Create a customer first.")
            return
        
        customer_id = customer_result[0]
        
        # Get first package
        package_query = text("SELECT id FROM event_packages LIMIT 1")
        package_result = db.execute(package_query).first()
        
        if not package_result:
            print("❌ No event package found.")
            return
        
        package_id = package_result[0]
        
        today = date.today()
        
        # Create test bookings with different scenarios
        test_bookings = [
            # PAST EVENTS (should show "On-going Event")
            {
                "name": "Past Event #1",
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today - timedelta(days=10),
                "venue": "Historic Mansion",
                "price": 85000,
                "status": "Confirmed"
            },
            {
                "name": "Past Event #2",
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today - timedelta(days=5),
                "venue": "City Convention Center",
                "price": 120000,
                "status": "Confirmed"
            },
            {
                "name": "Past Event #3",
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today - timedelta(days=1),
                "venue": "Beachfront Estate",
                "price": 110000,
                "status": "Confirmed"
            },
            
            # TODAY (should show "On-going Event")
            {
                "name": "Today's Event",
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today,
                "venue": "Grand Ballroom",
                "price": 150000,
                "status": "Confirmed"
            },
            
            # FUTURE EVENTS (should remain "Confirmed")
            {
                "name": "Tomorrow's Event",
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today + timedelta(days=1),
                "venue": "Luxury Resort",
                "price": 140000,
                "status": "Confirmed"
            },
            {
                "name": "Next Week Event",
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today + timedelta(days=7),
                "venue": "Elegant Tower Venue",
                "price": 130000,
                "status": "Confirmed"
            },
            {
                "name": "Next Month Event",
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today + timedelta(days=30),
                "venue": "Premium Country Club",
                "price": 175000,
                "status": "Confirmed"
            },
            
            # OTHER STATUS EXAMPLES
            {
                "name": "Cancelled Event",
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today + timedelta(days=5),
                "venue": "Waterfront Venue",
                "price": 95000,
                "status": "Cancelled"
            },
            {
                "name": "Pending Event",
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today + timedelta(days=14),
                "venue": "Garden Estate",
                "price": 105000,
                "status": "Pending"
            },
        ]
        
        print("=" * 70)
        print("INSERTING COMPREHENSIVE TEST DATA")
        print("=" * 70)
        print(f"\nToday's Date: {today}\n")
        
        # Prepare values for bulk insert
        values_list = []
        params_dict = {}
        
        for idx, booking in enumerate(test_bookings):
            ref_key = f'ref{idx}'
            date_key = f'date{idx}'
            venue_key = f'venue{idx}'
            price_key = f'price{idx}'
            status_key = f'status{idx}'
            
            values_list.append(
                f"(:cust, :pkg, :{ref_key}, :{date_key}, 'Wedding', :{venue_key}, 150, :{price_key}, :{status_key}, 'Test data for status verification', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
            )
            
            params_dict[ref_key] = booking['ref']
            params_dict[date_key] = booking['date']
            params_dict[venue_key] = booking['venue']
            params_dict[price_key] = booking['price']
            params_dict[status_key] = booking['status']
        
        params_dict['cust'] = customer_id
        params_dict['pkg'] = package_id
        
        # Build and execute bulk insert
        insert_query = text(f"""
            INSERT INTO bookings (
                customer_id, package_id, booking_reference, event_date, 
                event_type, venue_proposed, guest_count, total_price, 
                status, notes, created_at, updated_at
            ) VALUES {','.join(values_list)}
        """)
        
        db.execute(insert_query, params_dict)
        db.commit()
        
        # Print results
        print("\n✓ TEST BOOKINGS INSERTED:\n")
        print(f"{'Event Name':<25} {'Reference':<15} {'Date':<12} {'Status':<15} {'Expected After Load':<25}")
        print("-" * 95)
        
        for booking in test_bookings:
            event_date = booking['date']
            current_status = booking['status']
            expected_status = "On-going Event" if (event_date <= today and current_status == "Confirmed") else current_status
            
            days_diff = (event_date - today).days
            date_label = f"{event_date} ({days_diff:+d}d)"
            
            print(f"{booking['name']:<25} {booking['ref']:<15} {date_label:<12} {current_status:<15} {expected_status:<25}")
        
        print("\n" + "=" * 70)
        print("✅ TEST DATA INSERTED SUCCESSFULLY!")
        print("=" * 70)
        print("\n📊 EXPECTED BEHAVIOR:\n")
        print("  • Past Events (dates before today)      → Status: 'On-going Event'")
        print("  • Today's Event (current date)          → Status: 'On-going Event'")
        print("  • Future Events (dates after today)     → Status: 'Confirmed'")
        print("  • Cancelled/Pending (any date)          → Status: Unchanged")
        print("\n🧪 HOW TO TEST:\n")
        print("  1. Open browser: http://localhost:5174/admin/bookings?status=all")
        print("  2. Refresh page to trigger auto-update")
        print("  3. Verify past/today events show 'On-going Event'")
        print("  4. Verify future events remain 'Confirmed'")
        print("\n✨ Status updates automatically on every page load")
        print("=" * 70)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    insert_comprehensive_test_data()
