from database import SessionLocal
import models
from datetime import datetime, timedelta

def insert_dummy_reviews():
    db = SessionLocal()
    try:
        # Check if we already have reviews
        if db.query(models.Review).count() > 0:
            print("Reviews already exist.")
            return

        # Get first customer and booking to attach reviews to
        customer = db.query(models.User).filter(models.User.user_role == "Customer").first()
        booking = db.query(models.Booking).first()

        if not customer or not booking:
            print("No customer or booking found to attach reviews to.")
            return

        reviews = [
            models.Review(
                booking_id=booking.id,
                customer_id=customer.id,
                rating=5,
                comment="Absolutely magical! The Gala Crafters team made my completely exceeded our expectations. The venue setup was breathtaking.",
                created_at=datetime.utcnow() - timedelta(days=2)
            ),
            models.Review(
                booking_id=booking.id,
                customer_id=customer.id,
                rating=4,
                comment="Very professional and attentive staff. The catering could have been a bit warmer, but overall a fantastic experience.",
                created_at=datetime.utcnow() - timedelta(days=5)
            ),
             models.Review(
                booking_id=booking.id,
                customer_id=customer.id,
                rating=5,
                comment="Our corporate gala was a massive success thanks to Gala Crafters. Flawless execution from start to finish.",
                created_at=datetime.utcnow() - timedelta(days=12)
            )
        ]

        for rev in reviews:
            db.add(rev)
        
        db.commit()
        print("Successfully inserted dummy reviews!")
    finally:
        db.close()

if __name__ == "__main__":
    insert_dummy_reviews()
