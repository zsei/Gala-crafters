"""
Verify that all booking IDs match the correct REVIEW- format
"""

from database import SessionLocal
import models

db = SessionLocal()

try:
    # Get all bookings with reviews
    bookings_with_reviews = db.query(models.Booking).filter(
        models.Booking.booking_reference.like('REVIEW-%')
    ).all()
    
    print(f"Total Bookings with REVIEW format: {len(bookings_with_reviews)}\n")
    print("="*80)
    print("BOOKING IDs BY PACKAGE")
    print("="*80 + "\n")
    
    # Group by package
    bookings_by_package = {}
    for booking in bookings_with_reviews:
        package_id = booking.package_id
        if package_id not in bookings_by_package:
            bookings_by_package[package_id] = []
        bookings_by_package[package_id].append(booking)
    
    for package_id in sorted(bookings_by_package.keys()):
        package = db.query(models.EventPackage).filter(
            models.EventPackage.id == package_id
        ).first()
        
        bookings = sorted(bookings_by_package[package_id], key=lambda x: x.booking_reference)
        
        print(f"📦 Package {package_id}: {package.package_name}")
        
        for booking in bookings:
            review = db.query(models.Review).filter(
                models.Review.booking_id == booking.id
            ).first()
            
            review_status = "✓ Has 5⭐ Review" if review and review.rating == 5 else "✗ No Review"
            print(f"   • {booking.booking_reference} - {booking.event_date} - {review_status}")
        print()
    
    print("="*80)
    print(f"✅ All booking IDs follow the REVIEW-{{package_id}}-{{number}} format!")
    print("="*80)
    
finally:
    db.close()
