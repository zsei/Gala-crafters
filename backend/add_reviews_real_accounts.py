"""
Script to add 6 five-star reviews for packages using only existing real email accounts
"""

from database import SessionLocal
import models
from datetime import timedelta
import datetime as gala_dt

def add_reviews_to_packages():
    """Add 6 five-star reviews for each package using only existing real email accounts"""
    db = SessionLocal()
    
    try:
        # Get all packages
        packages = db.query(models.EventPackage).all()
        
        if not packages:
            print("No packages found in the database!")
            return
        
        # Get all existing users with real email formats (gmail, yahoo, email.com, etc - not galacrafters)
        existing_users = db.query(models.User).filter(
            models.User.status == "Active",
            ~models.User.email.like('%@galacrafters.com')
        ).all()
        
        print(f"Found {len(existing_users)} existing users with real email accounts")
        print(f"Found {len(packages)} packages")
        
        if len(existing_users) < 6:
            print(f"\nℹ️  Found {len(existing_users)} users. Using them to create reviews (users can leave multiple reviews).")
            print("User list:")
            for user in existing_users:
                print(f"  - {user.first_name} {user.last_name} ({user.email})")
            print()
        
        # Review templates for variety
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
        
        print("\nAdding 6 five-star reviews for each package using existing users...\n")
        
        review_count = 0
        
        for package in packages:
            print(f"Processing package: {package.package_name}")
            
            # Get existing bookings for this package
            existing_bookings = db.query(models.Booking).filter(
                models.Booking.package_id == package.id
            ).all()
            
            # We need at least 6 bookings to add 6 reviews
            bookings_needed = 6 - len(existing_bookings)
            
            if bookings_needed > 0:
                print(f"  Creating {bookings_needed} dummy bookings using existing users...")
                # Create dummy bookings using existing users
                for i in range(bookings_needed):
                    # Rotate through existing users
                    customer = existing_users[i % len(existing_users)]
                    
                    # Create a dummy booking for this customer
                    event_date = gala_dt.date.today() - timedelta(days=(i+1)*30)
                    booking_ref = f"REVIEW-{package.id}-{i+1:03d}"
                    
                    # Check if booking already exists
                    existing_booking = db.query(models.Booking).filter(
                        models.Booking.booking_reference == booking_ref
                    ).first()
                    
                    if not existing_booking:
                        booking = models.Booking(
                            booking_reference=booking_ref,
                            customer_id=customer.id,
                            package_id=package.id,
                            event_date=event_date,
                            event_type=package.event_type,
                            venue_proposed="Various Venues",
                            guest_count=50,
                            total_price=package.base_price,
                            status="Completed",
                            notes="Review booking"
                        )
                        db.add(booking)
                        db.flush()
                        existing_bookings.append(booking)
            
            # Add 6 reviews to the first 6 bookings using different existing users
            for idx, booking in enumerate(existing_bookings[:6]):
                # Check if review already exists
                existing_review = db.query(models.Review).filter(
                    models.Review.booking_id == booking.id
                ).first()
                
                if not existing_review:
                    # Use a different user for the review (rotate through users)
                    reviewer_user = existing_users[(review_count + idx) % len(existing_users)]
                    
                    review = models.Review(
                        booking_id=booking.id,
                        customer_id=reviewer_user.id,
                        rating=5,
                        comment=review_comments[(review_count + idx) % len(review_comments)],
                        status="Visible",
                        created_at=gala_dt.datetime.now() - timedelta(days=idx+1)
                    )
                    db.add(review)
                    review_count += 1
            
            print(f"  ✓ Added/verified 6 five-star reviews")
        
        db.commit()
        print(f"\n✓ Successfully added/verified {review_count} reviews to packages!")
        
        # List all reviews grouped by package
        print("\n" + "="*80)
        print("SUMMARY OF REVIEWS")
        print("="*80 + "\n")
        
        for package in packages:
            reviews = db.query(models.Review).join(
                models.Booking
            ).filter(
                models.Booking.package_id == package.id,
                models.Review.rating == 5
            ).all()
            
            print(f"📦 Package: {package.package_name} ({package.event_type})")
            print(f"   Location: http://localhost:5173/admin/reviews")
            print(f"   Total 5-Star Reviews: {len(reviews)}")
            print(f"   Price: ${package.base_price:.2f}")
            
            for idx, review in enumerate(reviews[:6], 1):
                customer = db.query(models.User).filter(
                    models.User.id == review.customer_id
                ).first()
                review_date = review.created_at.strftime("%m/%d/%Y")
                print(f"     {idx}. ⭐⭐⭐⭐⭐ - {customer.first_name} {customer.last_name} ({review_date})")
                print(f"        Email: {customer.email}")
                print(f"        \"{review.comment}\"")
            print()
    
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_reviews_to_packages()
