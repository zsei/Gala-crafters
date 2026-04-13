import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.database import SessionLocal
from backend import models

def check_reviews():
    db = SessionLocal()
    try:
        print("--- PACKAGES ---")
        packages = db.query(models.EventPackage).all()
        for p in packages:
            print(f"ID: {p.id} | Name: {p.package_name}")

        print("\n--- REVIEWS ---")
        reviews = db.query(models.Review).all()
        for r in reviews:
            pkg = r.booking.package if r.booking else None
            pkg_name = pkg.package_name if pkg else "N/A"
            pkg_id = pkg.id if pkg else "N/A"
            print(f"Review ID: {r.id} | Rating: {r.rating} | Status: {r.status} | Package: {pkg_name} (ID: {pkg_id})")
            
        print("\n--- REVIEWS FOR PACKAGE ID 1 ---")
        pkg1_reviews = db.query(models.Review).join(
            models.Booking, models.Review.booking_id == models.Booking.id
        ).filter(models.Booking.package_id == 1).all()
        print(f"Count for Package 1: {len(pkg1_reviews)}")
        for r in pkg1_reviews:
             print(f"Review ID: {r.id} | Rating: {r.rating} | Status: {r.status}")

    finally:
        db.close()

if __name__ == "__main__":
    check_reviews()
