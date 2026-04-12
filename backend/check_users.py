"""
Script to check existing users in the database
"""

from database import SessionLocal
import models

db = SessionLocal()

try:
    users = db.query(models.User).all()
    print(f"Total users in database: {len(users)}\n")
    
    for user in users[:20]:  # Show first 20
        print(f"ID: {user.id}")
        print(f"  Name: {user.first_name} {user.last_name}")
        print(f"  Email: {user.email}")
        print(f"  Phone: {user.phone}")
        print(f"  Status: {user.status}")
        print()
        
finally:
    db.close()
