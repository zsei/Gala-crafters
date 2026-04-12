"""
Check existing user password format
"""

from database import SessionLocal
import models

db = SessionLocal()

try:
    users = db.query(models.User).limit(3).all()
    
    for user in users:
        print(f"User: {user.first_name} {user.last_name}")
        print(f"Email: {user.email}")
        print(f"Password: {user.password}")
        print(f"Password length: {len(user.password)}")
        print()
        
finally:
    db.close()
