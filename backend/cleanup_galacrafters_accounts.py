"""
Script to clean up and recreate reviews using only real email accounts (Gmail, etc.)
"""

from database import SessionLocal
import models
from datetime import timedelta
import datetime as gala_dt

db = SessionLocal()

try:
    # First delete all reviews that have null booking_id
    print("Cleaning up orphaned reviews...")
    orphaned_reviews = db.query(models.Review).filter(
        models.Review.booking_id == None
    ).all()
    
    for review in orphaned_reviews:
        db.delete(review)
    
    db.commit()
    print(f"✓ Deleted {len(orphaned_reviews)} orphaned reviews")
    
    # Delete all reviews we added with galacrafters.com accounts
    users_to_delete = db.query(models.User).filter(
        models.User.email.like('%@galacrafters.com')
    ).all()
    
    print(f"Removing {len(users_to_delete)} users with @galacrafters.com accounts...")
    
    for user in users_to_delete:
        # Delete their reviews first
        reviews = db.query(models.Review).filter(
            models.Review.customer_id == user.id
        ).all()
        
        for review in reviews:
            db.delete(review)
        
        # Delete their bookings
        bookings = db.query(models.Booking).filter(
            models.Booking.customer_id == user.id
        ).all()
        
        for booking in bookings:
            db.delete(booking)
        
        # Delete the user
        db.delete(user)
    
    db.commit()
    print("✓ Cleanup complete")
    
finally:
    db.close()
