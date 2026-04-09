import os
from sqlalchemy.orm import Session
from database import engine, SessionLocal
from models import AdminUser

def seed_roles():
    db = SessionLocal()
    try:
        # Define the basic accounts
        accounts = [
            {"email": "admin@gala.com", "name": "System Admin", "role": "superadmin"},
            {"email": "staff1@gala.com", "name": "Staff One (Bookings)", "role": "staff_bookings"},
            {"email": "staff2@gala.com", "name": "Staff Two (Packages)", "role": "staff_packages"}
        ]
        
        for acc in accounts:
            existing = db.query(AdminUser).filter(AdminUser.email == acc["email"]).first()
            if existing:
                existing.role = acc["role"]
                # FIX: Set PLAIN TEXT password because auth_endpoints.py uses simple string comparison
                existing.password = "password123"
                print(f"Updated role for {acc['email']} to {acc['role']}")
            else:
                new_admin = AdminUser(
                    name=acc["name"],
                    email=acc["email"],
                    password="password123", # Plain text password explicitly
                    phone="00000000",
                    role=acc["role"]
                )
                db.add(new_admin)
                print(f"Created new user {acc['email']} with role {acc['role']}")
        
        db.commit()
        print("Roles seeded successfully with correct plain-text password format!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_roles()
