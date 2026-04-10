"""
Script to fix bookings with 0.0 total_price by inheriting the base_price from their linked package.
"""

from database import SessionLocal
from models import Booking, EventPackage
from sqlalchemy import text

def fix_booking_prices():
    db = SessionLocal()
    try:
        print("Searching for bookings with 0 price...")
        # Find bookings with total_price = 0 or NULL
        bookings_to_fix = db.query(Booking).filter(
            (Booking.total_price == 0) | (Booking.total_price == None)
        ).all()
        
        if not bookings_to_fix:
            print("No bookings found with 0 price.")
            return

        print(f"Found {len(bookings_to_fix)} bookings to fix.")
        
        for booking in bookings_to_fix:
            package = db.query(EventPackage).filter(EventPackage.id == booking.package_id).first()
            if package:
                print(f"Fixing {booking.booking_reference}: Setting price to {package.base_price} (from {package.package_name})")
                booking.total_price = package.base_price
            else:
                print(f"Warning: No package found for booking {booking.booking_reference} (Package ID: {booking.package_id})")
        
        db.commit()
        print("Success: All applicable bookings updated.")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_booking_prices()
