import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.database import SessionLocal
from backend import models

def check_reviews():
    db = SessionLocal()
    try:
        print("--- SPECIFIC BOOKING CHECK ---")
        # Checking for BK3WFJS52B which we saw in the admin panel screenshot
        booking = db.query(models.Booking).filter(models.Booking.booking_reference == 'BK3WFJS52B').first()
        if booking:
            print(f"Booking: {booking.booking_reference}")
            print(f"Package ID: {booking.package_id}")
            print(f"Package Name: {booking.package.package_name if booking.package else 'N/A'}")
            
            review = db.query(models.Review).filter(models.Review.booking_id == booking.id).first()
            if review:
                print(f"Review ID: {review.id} | Status: {review.status} | Rating: {review.rating}")
            else:
                print("No review found for this booking.")
        else:
            print("Booking BK3WFJS52B not found.")

        print("\n--- ALL WEDDING REVIEWS ---")
        wedding_reviews = db.query(models.Review).join(
            models.Booking, models.Review.booking_id == models.Booking.id
        ).join(
            models.EventPackage, models.Booking.package_id == models.EventPackage.id
        ).filter(models.EventPackage.event_type.ilike('%wedding%')).all()
        
        print(f"Found {len(wedding_reviews)} wedding reviews.")
        for r in wedding_reviews:
            print(f"Pkg ID: {r.booking.package_id} | Pkg Name: {r.booking.package.package_name} | Review Status: {r.status}")

    finally:
        db.close()

if __name__ == "__main__":
    check_reviews()
