"""
Script to create 6 five-star reviews per package with actual bookings
Reviews will be linked to completed bookings so they appear in user transaction history
"""

from database import SessionLocal
import models
from datetime import date, timedelta
import random

def create_authentic_reviews():
    """Create reviews linked to authentic completed bookings"""
    db = SessionLocal()
    
    try:
        # Get all packages
        packages = db.query(models.EventPackage).all()
        
        # Get all Philippine users (exclude the non-PH ones for authentic feel)
        ph_users = db.query(models.User).filter(
            models.User.email.like('%@gmail.com')
        ).all()
        
        print(f"Found {len(packages)} packages")
        print(f"Found {len(ph_users)} Philippine accounts\n")
        
        # Review comments for variety
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
        
        print("Creating authentic reviews with completed bookings...\n")
        print("="*80)
        
        total_bookings = 0
        total_reviews = 0
        
        for package in packages:
            print(f"\n📦 Package: {package.package_name}")
            
            # Create 6 bookings for this package from different users
            for i in range(6):
                # Select a random user
                user = random.choice(ph_users)
                
                # Create a booking for this user (mark as completed)
                event_date = date.today() - timedelta(days=random.randint(30, 365))
                # Use the REVIEW- format that matches existing bookings
                booking_ref = f"REVIEW-{package.id}-{i+1:03d}"
                
                # Check if booking already exists
                existing_booking = db.query(models.Booking).filter(
                    models.Booking.booking_reference == booking_ref
                ).first()
                
                if not existing_booking:
                    booking = models.Booking(
                        booking_reference=booking_ref,
                        customer_id=user.id,
                        package_id=package.id,
                        event_date=event_date,
                        event_type=package.event_type,
                        venue_proposed=f"Venue - {['Manila', 'Cebu', 'Davao', 'Makati', 'Quezon City'][i % 5]}",
                        guest_count=random.randint(30, 200),
                        total_price=package.base_price,
                        status="Completed",  # Marked as completed
                        notes=f"Completed event - Review booking",
                        event_theme=["Modern", "Classic", "Elegant", "Casual", "Formal", "Festive"][i % 6],
                        color_palette=["Gold & White", "Blue & Silver", "Pink & White", "Green & Gold", "Red & Gold", "Purple & White"][i % 6]
                    )
                    db.add(booking)
                    db.flush()
                    total_bookings += 1
                    
                    # Create a 5-star review for this booking
                    review = models.Review(
                        booking_id=booking.id,
                        customer_id=user.id,
                        rating=5,  # 5-star review
                        comment=random.choice(review_comments),
                        status="Visible",
                        created_at=models.gala_dt.datetime.now() - timedelta(days=random.randint(1, 30))
                    )
                    db.add(review)
                    total_reviews += 1
                    
                    print(f"  ✓ Booking {i+1}/6: {user.first_name} {user.last_name} - Booking ID: {booking_ref}")
        
        db.commit()
        
        print("\n" + "="*80)
        print("REVIEW CREATION SUMMARY")
        print("="*80)
        print(f"✓ Total Completed Bookings Created: {total_bookings}")
        print(f"✓ Total 5-Star Reviews Created: {total_reviews}")
        print(f"✓ Packages with Reviews: {len(packages)}")
        
        # Display reviews by package
        print("\n" + "="*80)
        print("REVIEWS BY PACKAGE (As seen in accounts)")
        print("="*80 + "\n")
        
        for idx, package in enumerate(packages, 1):
            reviews = db.query(models.Review).join(
                models.Booking
            ).filter(
                models.Booking.package_id == package.id,
                models.Review.rating == 5
            ).all()
            
            print(f"{idx}. ⭐ {package.package_name} ({package.event_type})")
            print(f"   Package Price: ${package.base_price:.2f}")
            print(f"   Total 5-Star Reviews: {len(reviews)}")
            
            for rev_idx, review in enumerate(reviews[:6], 1):
                customer = db.query(models.User).filter(
                    models.User.id == review.customer_id
                ).first()
                booking = db.query(models.Booking).filter(
                    models.Booking.id == review.booking_id
                ).first()
                
                review_date = review.created_at.strftime("%B %d, %Y")
                print(f"     {rev_idx}. ⭐⭐⭐⭐⭐ by {customer.first_name} {customer.last_name}")
                print(f"        Booking: {booking.booking_reference} | Date: {booking.event_date}")
                print(f"        Guest Count: {booking.guest_count} | Review Date: {review_date}")
                print(f"        Comment: \"{review.comment}\"")
            print()
        
        print("="*80)
        print("USER TRANSACTION HISTORY")
        print("="*80 + "\n")
        
        # Show user transaction history
        for user in ph_users[:5]:  # Show first 5 users
            bookings = db.query(models.Booking).filter(
                models.Booking.customer_id == user.id
            ).all()
            
            if bookings:
                print(f"👤 {user.first_name} {user.last_name} ({user.email})")
                print(f"   Total Transactions: {len(bookings)}")
                
                for booking in bookings:
                    review = db.query(models.Review).filter(
                        models.Review.booking_id == booking.id
                    ).first()
                    
                    package = db.query(models.EventPackage).filter(
                        models.EventPackage.id == booking.package_id
                    ).first()
                    
                    review_status = "✓ Reviewed (5⭐)" if review else "Not reviewed"
                    print(f"     • {package.package_name} - {booking.event_date} - {review_status}")
                print()
        
        print("="*80)
        print(f"✅ DONE! All reviews are now stored in user transaction history.")
        print("="*80)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_authentic_reviews()
