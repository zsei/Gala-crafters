"""
Check all existing booking reference formats in database
"""

from database import SessionLocal
import models

db = SessionLocal()

try:
    # Get sample bookings with different formats
    bookings = db.query(models.Booking).limit(30).all()
    
    print("Sample Booking Formats in Database:\n")
    
    formats_found = {}
    
    for booking in bookings:
        ref = booking.booking_reference
        prefix = ref.split('-')[0] if '-' in ref else ref[:2]
        
        if prefix not in formats_found:
            formats_found[prefix] = []
        formats_found[prefix].append(ref)
    
    print("Formats found:")
    for prefix, refs in formats_found.items():
        print(f"\n{prefix} format:")
        for ref in refs[:3]:
            print(f"  - {ref}")
        
finally:
    db.close()
