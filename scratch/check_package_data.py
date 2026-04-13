import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.database import SessionLocal
from sqlalchemy import text

def check_package_data():
    db = SessionLocal()
    try:
        # Check all packages to see what we have
        query = text("SELECT id, package_name, included_items, features FROM event_packages")
        result = db.execute(query)
        print("Checking Event Packages:")
        for row in result:
            print(f"ID: {row.id}")
            print(f"Name: {row.package_name}")
            print(f"Included Items: {row.included_items}")
            print(f"Features: {row.features}")
            print("-" * 20)
    finally:
        db.close()

if __name__ == "__main__":
    check_package_data()
