"""
Quick diagnostic to check booking statuses in the database
"""

from database import SessionLocal
from sqlalchemy import text
from datetime import date

db = SessionLocal()

try:
    # Check what statuses are in the database
    query = text("""
        SELECT 
            booking_reference,
            customer_id,
            event_date,
            status,
            CURRENT_DATE as today_date
        FROM bookings 
        ORDER BY event_date
        LIMIT 15
    """)
    
    results = db.execute(query).fetchall()
    
    print("=" * 80)
    print("BOOKING STATUS CHECK")
    print("=" * 80)
    print(f"\nCurrent Date in Database: {date.today()}\n")
    
    if results:
        for booking in results:
            ref, cust_id, event_date, status, today = booking
            days_diff = (event_date - today).days if event_date and today else None
            print(f"Reference: {ref:<18} Date: {event_date} ({days_diff:+d}d) Status: {status}")
    else:
        print("No bookings found")
    
    print("\n" + "=" * 80)
    
finally:
    db.close()
