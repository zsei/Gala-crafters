"""
Script to delete old reviews and bookings created with wrong format
"""

from database import SessionLocal
import models

db = SessionLocal()

try:
    # Delete reviews from reviewer accounts (those starting with 'reviewer' email)
    reviewer_users = db.query(models.User).filter(
        models.User.email.like('reviewer%@galacrafters.com')
    ).all()
    
    print(f"Found {len(reviewer_users)} reviewer accounts to clean up")
    
    # Delete reviews from these users
    for user in reviewer_users:
        reviews = db.query(models.Review).filter(
            models.Review.customer_id == user.id
        ).all()
        
        for review in reviews:
            db.delete(review)
    
    # Delete old bookings with REVIEW prefix
    old_bookings = db.query(models.Booking).filter(
        models.Booking.booking_reference.like('REVIEW-%')
    ).all()
    
    print(f"Found {len(old_bookings)} old review bookings")
    
    for booking in old_bookings:
        db.delete(booking)
    
    db.commit()
    print("✓ Cleanup complete")
    
except Exception as e:
    print(f"Error: {e}")
    db.rollback()
finally:
    db.close()
