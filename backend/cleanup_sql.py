"""
Script to clean up galacrafters accounts using direct SQL
"""

from database import engine
from sqlalchemy import text

try:
    with engine.connect() as connection:
        # Delete in the correct order to respect foreign keys
        # First delete reviews that reference these bookings
        connection.execute(text("""
            DELETE FROM reviews 
            WHERE booking_id IN (
                SELECT id FROM bookings 
                WHERE customer_id IN (
                    SELECT id FROM users WHERE email LIKE '%@galacrafters.com'
                )
            )
        """))
        
        # Delete booking services
        connection.execute(text("""
            DELETE FROM booking_services 
            WHERE booking_id IN (
                SELECT id FROM bookings 
                WHERE customer_id IN (
                    SELECT id FROM users WHERE email LIKE '%@galacrafters.com'
                )
            )
        """))
        
        # Delete bookings
        connection.execute(text("""
            DELETE FROM bookings 
            WHERE customer_id IN (
                SELECT id FROM users WHERE email LIKE '%@galacrafters.com'
            )
        """))
        
        # Delete reviews created by these users
        connection.execute(text("""
            DELETE FROM reviews 
            WHERE customer_id IN (
                SELECT id FROM users WHERE email LIKE '%@galacrafters.com'
            )
        """))
        
        # Delete the users
        result = connection.execute(text("""
            DELETE FROM users 
            WHERE email LIKE '%@galacrafters.com'
        """))
        
        connection.commit()
        print(f"✓ Cleanup complete - Deleted {result.rowcount} users")
        
except Exception as e:
    print(f"Error: {e}")
