"""
Insert explicit test data for today and yesterday to verify auto-status update
These bookings should immediately show as "On-going Event"
"""

from database import SessionLocal
from sqlalchemy import text
from datetime import date, timedelta
import uuid

def insert_explicit_ongoing_test_data():
    """Insert test bookings specifically for today and yesterday"""
    db = SessionLocal()
    
    try:
        # Get first customer
        customer_query = text("SELECT id FROM users WHERE user_role = 'Customer' LIMIT 1")
        customer_result = db.execute(customer_query).first()
        
        if not customer_result:
            print("❌ No customer found")
            return
        
        customer_id = customer_result[0]
        
        # Get first package
        package_query = text("SELECT id FROM event_packages LIMIT 1")
        package_result = db.execute(package_query).first()
        
        if not package_result:
            print("❌ No event package found")
            return
        
        package_id = package_result[0]
        
        today = date.today()
        yesterday = today - timedelta(days=1)
        
        # Test bookings with explicit dates
        test_bookings = [
            {
                "name": "Yesterday's Event (Should be On-going)",
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": yesterday,
                "venue": "Yesterday Venue",
                "price": 100000
            },
            {
                "name": "Today's Event at 4PM (Should be On-going)",
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today,
                "venue": "Today Premium Ballroom",
                "price": 150000
            },
            {
                "name": "Today's Event at 2PM (Should be On-going)",
                "ref": f"BK{uuid.uuid4().hex[:11].upper()}",
                "date": today,
                "venue": "Today Luxury Resort",
                "price": 140000
            },
        ]
        
        print("=" * 80)
        print("INSERTING EXPLICIT ON-GOING EVENT TEST DATA")
        print("=" * 80)
        print(f"\nToday's Date: {today}")
        print(f"These bookings will AUTO-UPDATE to 'On-going Event'\n")
        
        # Prepare bulk insert
        values_list = []
        params_dict = {}
        
        for idx, booking in enumerate(test_bookings):
            ref_key = f'ref{idx}'
            date_key = f'date{idx}'
            venue_key = f'venue{idx}'
            price_key = f'price{idx}'
            
            values_list.append(
                f"(:cust, :pkg, :{ref_key}, :{date_key}, 'Wedding', :{venue_key}, 100, :{price_key}, 'Confirmed', 'EXPLICIT TEST: Should auto-update to On-going Event', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
            )
            
            params_dict[ref_key] = booking['ref']
            params_dict[date_key] = booking['date']
            params_dict[venue_key] = booking['venue']
            params_dict[price_key] = booking['price']
        
        params_dict['cust'] = customer_id
        params_dict['pkg'] = package_id
        
        # Execute bulk insert
        insert_query = text(f"""
            INSERT INTO bookings (
                customer_id, package_id, booking_reference, event_date, 
                event_type, venue_proposed, guest_count, total_price, 
                status, notes, created_at, updated_at
            ) VALUES {','.join(values_list)}
        """)
        
        db.execute(insert_query, params_dict)
        db.commit()
        
        print("\n✅ INSERTED TEST BOOKINGS:\n")
        for booking in test_bookings:
            print(f"  ✓ {booking['name']}")
            print(f"    Ref: {booking['ref']}")
            print(f"    Date: {booking['date']}")
            print(f"    Venue: {booking['venue']}")
            print(f"    Price: ${booking['price']:,}\n")
        
        print("=" * 80)
        print("📝 WHAT SHOULD HAPPEN:")
        print("=" * 80)
        print("\n1. When the admin page loads, the backend UPDATE function runs")
        print("2. All 'Confirmed' bookings with event_date <= TODAY get updated")
        print("3. Their status changes to 'On-going Event'")
        print("\n✨ TO VERIFY IT WORKS:")
        print("   1. Go to: http://localhost:5174/admin/bookings?status=all")
        print("   2. Hard refresh (Ctrl+F5 or Cmd+Shift+R)")
        print("   3. You should see these 3 new test bookings")
        print("   4. Click 'On-going Events' in sidebar")
        print("   5. These 3 should appear there with 'On-going Event' status")
        print("\n🔍 DEBUG: Check the filter mapping is working:")
        print("   - URL: ?status=ongoing")
        print("   - Database value: 'On-going Event'")
        print("   - Filter should match them correctly")
        print("=" * 80)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    insert_explicit_ongoing_test_data()
