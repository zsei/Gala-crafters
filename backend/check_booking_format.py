"""
Check existing booking ID format in database
"""

from database import SessionLocal
import models

db = SessionLocal()

try:
    bookings = db.query(models.Booking).limit(20).all()
    
    print("Sample Existing Booking References:\n")
    
    booking_formats = set()
    
    for booking in bookings:
        print(f"Booking ID: {booking.booking_reference}")
        print(f"  Customer: {booking.customer.first_name} {booking.customer.last_name}")
        print(f"  Package: {booking.package.package_name}")
        print(f"  Date: {booking.event_date}")
        print(f"  Status: {booking.status}")
        print()
        
        # Extract format pattern
        booking_formats.add(booking.booking_reference.split('-')[0])
    
    print(f"\nBooking ID Formats Found: {booking_formats}")
        
finally:
    db.close()
