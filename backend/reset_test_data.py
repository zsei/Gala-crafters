"""
Clear old test data and insert fresh data for proper testing
"""

from database import SessionLocal
from sqlalchemy import text
from datetime import date, timedelta
import uuid

def clear_and_insert_fresh_test_data():
    """Clear old test data and insert new correct test data"""
    db = SessionLocal()
    
    try:
        # First, delete all test bookings (keep production data)
        print("🗑️  Clearing old test bookings...")
        
        delete_query = text("""
            DELETE FROM bookings 
            WHERE notes LIKE '%test%' OR notes LIKE '%Test%' OR notes LIKE '%EXPLICIT%'
        """)
        db.execute(delete_query)
        db.commit()
        print("✓ Old test data cleared\n")
        
        # Get first customer and package
        customer_query = text("SELECT id FROM users WHERE user_role = 'Customer' LIMIT 1")
        customer_result = db.execute(customer_query).first()
        
        package_query = text("SELECT id FROM event_packages LIMIT 1")
        package_result = db.execute(package_query).first()
        
        if not customer_result or not package_result:
            print("❌ Missing customer or package")
            return
        
        customer_id = customer_result[0]
        package_id = package_result[0]
        
        today = date.today()
        tomorrow = today + timedelta(days=1)
        next_week = today + timedelta(days=7)
        
        # Create fresh test data
        test_bookings = [
            # TODAY'S EVENTS - should show as "On-going Event"
            {
                "name": "Today Morning Event",
                "ref": f"TESTTODAY{uuid.uuid4().hex[:7].upper()}",
                "date": today,
                "venue": "Morning Venue",
                "price": 100000,
                "notes": "Test Today Booking - Should show as On-going Event"
            },
            {
                "name": "Today Afternoon Event",
                "ref": f"TESTTODAY{uuid.uuid4().hex[:7].upper()}",
                "date": today,
                "venue": "Afternoon Premium Ballroom",
                "price": 150000,
                "notes": "Test Today Booking - Should show as On-going Event"
            },
            {
                "name": "Today Evening Event",
                "ref": f"TESTTODAY{uuid.uuid4().hex[:7].upper()}",
                "date": today,
                "venue": "Evening Luxury Resort",
                "price": 140000,
                "notes": "Test Today Booking - Should show as On-going Event"
            },
            
            # FUTURE EVENTS - should stay as "Confirmed"
            {
                "name": "Tomorrow's Event",
                "ref": f"TESTFUTURE{uuid.uuid4().hex[:7].upper()}",
                "date": tomorrow,
                "venue": "Tomorrow Venue",
                "price": 120000,
                "notes": "Test Future Booking - Should stay as Confirmed"
            },
            {
                "name": "Next Week Event",
                "ref": f"TESTFUTURE{uuid.uuid4().hex[:7].upper()}",
                "date": next_week,
                "venue": "Next Week Venue",
                "price": 130000,
                "notes": "Test Future Booking - Should stay as Confirmed"
            },
        ]
        
        print("=" * 80)
        print("INSERTING FRESH TEST DATA")
        print("=" * 80)
        print(f"\nToday's Date: {today}\n")
        
        # Prepare bulk insert
        values_list = []
        params_dict = {}
        
        for idx, booking in enumerate(test_bookings):
            ref_key = f'ref{idx}'
            date_key = f'date{idx}'
            venue_key = f'venue{idx}'
            price_key = f'price{idx}'
            notes_key = f'notes{idx}'
            
            values_list.append(
                f"(:cust, :pkg, :{ref_key}, :{date_key}, 'Wedding', :{venue_key}, 150, :{price_key}, 'Confirmed', :{notes_key}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
            )
            
            params_dict[ref_key] = booking['ref']
            params_dict[date_key] = booking['date']
            params_dict[venue_key] = booking['venue']
            params_dict[price_key] = booking['price']
            params_dict[notes_key] = booking['notes']
        
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
        
        print("✅ FRESH TEST BOOKINGS INSERTED:\n")
        print("📅 TODAY'S EVENTS (Will auto-update to 'On-going Event'):")
        for booking in test_bookings[:3]:
            print(f"  ✓ {booking['name']:<30} Ref: {booking['ref']}")
        
        print("\n🔮 FUTURE EVENTS (Will stay 'Confirmed'):")
        for booking in test_bookings[3:]:
            print(f"  ✓ {booking['name']:<30} Ref: {booking['ref']}")
        
        print("\n" + "=" * 80)
        print("🧪 HOW TO TEST:")
        print("=" * 80)
        print("\n1. Hard refresh browser (Ctrl+F5)")
        print("2. Go to: http://localhost:5174/admin/bookings?status=all")
        print("3. Click 'On-going Events' in sidebar")
        print("   → Should see ONLY today's 3 bookings")
        print("4. Click 'Confirmed Bookings' in sidebar") 
        print("   → Should see tomorrow + next week bookings")
        print("\n✨ Auto-update happens every time admin page loads!")
        print("=" * 80)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_and_insert_fresh_test_data()
