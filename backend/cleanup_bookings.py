"""
Script to delete old bookings and recreate with correct format
"""

from database import engine
from sqlalchemy import text

try:
    with engine.connect() as connection:
        # Delete reviews first (they reference bookings)
        connection.execute(text("""
            DELETE FROM reviews 
            WHERE booking_id IN (
                SELECT id FROM bookings 
                WHERE booking_reference LIKE 'BK-%'
            )
        """))
        
        # Delete bookings with the wrong format
        connection.execute(text("""
            DELETE FROM bookings 
            WHERE booking_reference LIKE 'BK-%'
        """))
        
        result = connection.execute(text("""
            DELETE FROM bookings 
            WHERE booking_reference LIKE 'BK-%'
        """))
        
        connection.commit()
        print("✓ Deleted old bookings with incorrect format")
        
except Exception as e:
    print(f"Error: {e}")
