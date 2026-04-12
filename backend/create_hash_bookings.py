"""
Script to regenerate bookings with hash format IDs and recreate reviews
"""

from database import engine, SessionLocal
import models
from sqlalchemy import text
from datetime import date, timedelta
import random
import string

def generate_hash_booking_id():
    """Generate a hash-style booking ID like BKB3A411B6 or GC-378FCBA3"""
    formats = [
        lambda: 'BK' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8)),
        lambda: 'GC' + '-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8)),
    ]
    return random.choice(formats)()

def regenerate_bookings_with_hash():
    """Delete old bookings and create new ones with hash format"""
    db = SessionLocal()
    
    try:
        # First delete old reviews and bookings
        print("Cleaning up old bookings...")
        with engine.connect() as connection:
            connection.execute(text("""
                DELETE FROM reviews 
                WHERE booking_id IN (
                    SELECT id FROM bookings 
                    WHERE booking_reference LIKE 'REVIEW-%'
                )
            """))
            
            connection.execute(text("""
                DELETE FROM bookings 
                WHERE booking_reference LIKE 'REVIEW-%'
            """))
            
            connection.commit()
        
        print("✓ Deleted old REVIEW- format bookings\n")
        
        # Get packages and users
        packages = db.query(models.EventPackage).all()
        ph_users = db.query(models.User).filter(
            models.User.email.like('%@gmail.com')
        ).all()
        
        print(f"Creating {len(packages) * 6} bookings with hash format...\n")
        
        # Review comments
        review_comments = [
            "The service was absolutely amazing! Highly recommended.",
            "Exceeded all our expectations. Best event ever!",
            "Professional, responsive, and delivered perfection.",
            "Worth every penny. Made our event unforgettable.",
            "Outstanding quality and exceptional attention to detail.",
            "The team went above and beyond. Five stars well deserved!",
            "Perfectly executed. Could not ask for better service.",
            "Incredible experience from start to finish.",
            "Transformed our vision into reality beautifully.",
            "Highly professional and absolutely wonderful.",
            "Best decision we made. Truly exceptional service.",
            "Fantastic attention to detail and smooth execution.",
            "Our guests are still talking about how amazing it was!",
            "Delivered exactly what was promised with perfect quality.",
            "A dream team that made our special day perfect.",
            "Incredibly talented and customer-focused professionals.",
            "The experience exceeded all our hopes and expectations.",
            "Would book again in a heartbeat. Absolutely superb!",
            "Professional, creative, and incredibly reliable.",
            "Our event was the talk of the night thanks to them!"
        ]
        
        total_bookings = 0
        total_reviews = 0
        
        for package in packages:
            print(f"📦 {package.package_name}")
            
            for i in range(6):
                # Generate unique hash ID
                booking_id = generate_hash_booking_id()
                
                # Ensure it's unique
                while db.query(models.Booking).filter(
                    models.Booking.booking_reference == booking_id
                ).first():
                    booking_id = generate_hash_booking_id()
                
                # Select random user
                user = random.choice(ph_users)
                
                # Create booking
                event_date = date.today() - timedelta(days=random.randint(30, 365))
                
                booking = models.Booking(
                    booking_reference=booking_id,
                    customer_id=user.id,
                    package_id=package.id,
                    event_date=event_date,
                    event_type=package.event_type,
                    venue_proposed=f"Venue - {['Manila', 'Cebu', 'Davao', 'Makati', 'Quezon City'][i % 5]}",
                    guest_count=random.randint(30, 200),
                    total_price=package.base_price,
                    status="Completed",
                    notes="Completed event - Review booking",
                    event_theme=["Modern", "Classic", "Elegant", "Casual", "Formal", "Festive"][i % 6],
                    color_palette=["Gold & White", "Blue & Silver", "Pink & White", "Green & Gold", "Red & Gold", "Purple & White"][i % 6]
                )
                db.add(booking)
                db.flush()
                total_bookings += 1
                
                # Create 5-star review
                review = models.Review(
                    booking_id=booking.id,
                    customer_id=user.id,
                    rating=5,
                    comment=random.choice(review_comments),
                    status="Visible",
                    created_at=models.gala_dt.datetime.now() - timedelta(days=random.randint(1, 30))
                )
                db.add(review)
                total_reviews += 1
                
                print(f"   ✓ {booking_id}")
            
            print()
        
        db.commit()
        
        print("="*80)
        print("COMPLETED")
        print("="*80)
        print(f"✓ Total Bookings Created: {total_bookings}")
        print(f"✓ Total 5-Star Reviews: {total_reviews}")
        print(f"✓ All bookings use hash format (BK..., GC-, etc.)")
        print("="*80)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    regenerate_bookings_with_hash()
