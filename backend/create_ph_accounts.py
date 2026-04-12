"""
Script to create multiple accounts with complete Philippine data
Following Angeline Khaleira's profile format
"""

from database import SessionLocal
import models
import datetime as gala_dt
from datetime import date

def hash_password(password: str) -> str:
    """Create a password between 8-15 characters for the database constraint"""
    # Format: hashed_pwXXX (12 characters)
    import random
    num = str(random.randint(100, 999))
    return f"hashed_pw{num}"

def create_ph_accounts():
    """Create realistic Philippine customer accounts with complete data"""
    db = SessionLocal()
    
    try:
        # Philippine accounts data with complete information
        accounts = [
            {
                "first_name": "Maria",
                "last_name": "Santos",
                "email": "maria.santos1990@gmail.com",
                "phone": "+639175432101",
                "dob": date(1990, 5, 15),
                "building_details": "Unit 502, RFM Corporate Center",
                "city": "Manila",
                "barangay": "Oroquieta",
                "postal_code": "1005",
                "country": "Philippines"
            },
            {
                "first_name": "Juan",
                "last_name": "Dela Cruz",
                "email": "juan.delacruz88@gmail.com",
                "phone": "+639285461234",
                "dob": date(1988, 3, 22),
                "building_details": "lot 12, Phase 2 Laguna Heights",
                "city": "Laguna",
                "barangay": "San Pedro",
                "postal_code": "4023",
                "country": "Philippines"
            },
            {
                "first_name": "Rosa",
                "last_name": "Reyes",
                "email": "rosa.reyes1992@gmail.com",
                "phone": "+639365871245",
                "dob": date(1992, 7, 8),
                "building_details": "45 Morato Ave",
                "city": "Quezon City",
                "barangay": "Mariana",
                "postal_code": "1103",
                "country": "Philippines"
            },
            {
                "first_name": "Carlos",
                "last_name": "Fernandez",
                "email": "carlos.fernandez1985@gmail.com",
                "phone": "+639472309876",
                "dob": date(1985, 11, 30),
                "building_details": "Suite 1502, Salcedo Park Tower",
                "city": "Makati",
                "barangay": "Salcedo",
                "postal_code": "1227",
                "country": "Philippines"
            },
            {
                "first_name": "Patricia",
                "last_name": "Mercado",
                "email": "patricia.mercado1991@gmail.com",
                "phone": "+639563214789",
                "dob": date(1991, 2, 14),
                "building_details": "22 Ortigas Mansion Road",
                "city": "Pasig",
                "barangay": "Ugong",
                "postal_code": "1600",
                "country": "Philippines"
            },
            {
                "first_name": "Manuel",
                "last_name": "Gonzales",
                "email": "manuel.gonzales1987@gmail.com",
                "phone": "+639648759123",
                "dob": date(1987, 9, 5),
                "building_details": "Unit 3A, Eastwood Parksuites",
                "city": "Quezon City",
                "barangay": "Bagumbayan",
                "postal_code": "1110",
                "country": "Philippines"
            },
            {
                "first_name": "Angela",
                "last_name": "Villanueva",
                "email": "angela.villanueva1993@gmail.com",
                "phone": "+639749381092",
                "dob": date(1993, 4, 28),
                "building_details": "19 Scout Reyes St",
                "city": "Quezon City",
                "barangay": "Scout Convention",
                "postal_code": "1104",
                "country": "Philippines"
            },
            {
                "first_name": "Ricardo",
                "last_name": "Bautista",
                "email": "ricardo.bautista1986@gmail.com",
                "phone": "+639185672340",
                "dob": date(1986, 6, 19),
                "building_details": "Lot 5, Citta Italia",
                "city": "Iloilo",
                "barangay": "Malipayon",
                "postal_code": "5000",
                "country": "Philippines"
            },
            {
                "first_name": "Christine",
                "last_name": "Castillo",
                "email": "christine.castillo1994@gmail.com",
                "phone": "+639294785023",
                "dob": date(1994, 8, 12),
                "building_details": "Unit 1206, Tuscany Heights",
                "city": "Cebu",
                "barangay": "Mabolo",
                "postal_code": "6000",
                "country": "Philippines"
            },
            {
                "first_name": "Alfonso",
                "last_name": "Tolentino",
                "email": "alfonso.tolentino1989@gmail.com",
                "phone": "+639372641850",
                "dob": date(1989, 12, 3),
                "building_details": "15 Bonita St, Easton Plaza",
                "city": "Davao",
                "barangay": "Lanang",
                "postal_code": "8000",
                "country": "Philippines"
            },
            {
                "first_name": "Sophia",
                "last_name": "Morales",
                "email": "sophia.morales1995@gmail.com",
                "phone": "+639485927601",
                "dob": date(1995, 1, 25),
                "building_details": "20 Lakeside Drive",
                "city": "Cavite",
                "barangay": "Kawit",
                "postal_code": "4107",
                "country": "Philippines"
            },
            {
                "first_name": "Ramon",
                "last_name": "Aquino",
                "email": "ramon.aquino1984@gmail.com",
                "phone": "+639261938475",
                "dob": date(1984, 10, 7),
                "building_details": "Unit 502, Flair North Tower",
                "city": "Quezon City",
                "barangay": "Quezon Avenue",
                "postal_code": "1108",
                "country": "Philippines"
            },
            {
                "first_name": "Victoria",
                "last_name": "Lopez",
                "email": "victoria.lopez1996@gmail.com",
                "phone": "+639573821946",
                "dob": date(1996, 3, 11),
                "building_details": "18 Glenridge Court",
                "city": "Antipolo",
                "barangay": "San Roque",
                "postal_code": "1870",
                "country": "Philippines"
            },
            {
                "first_name": "Daniel",
                "last_name": "Cruz",
                "email": "daniel.cruz1988@gmail.com",
                "phone": "+639368571420",
                "dob": date(1988, 7, 19),
                "building_details": "Unit 1801, Lumina Homes",
                "city": "Pampanga",
                "barangay": "Tanauan",
                "postal_code": "2119",
                "country": "Philippines"
            },
            {
                "first_name": "Marisol",
                "last_name": "Ramirez",
                "email": "marisol.ramirez1991@gmail.com",
                "phone": "+639482061735",
                "dob": date(1991, 5, 9),
                "building_details": "25 Maharlika St",
                "city": "Bulacan",
                "barangay": "San Juan",
                "postal_code": "3000",
                "country": "Philippines"
            },
            {
                "first_name": "Gabriel",
                "last_name": "Ortega",
                "email": "gabriel.ortega1990@gmail.com",
                "phone": "+639574326189",
                "dob": date(1990, 9, 14),
                "building_details": "Apt 15, Prestige Residences",
                "city": "Taguig",
                "barangay": "Fort Bonifacio",
                "postal_code": "1634",
                "country": "Philippines"
            },
            {
                "first_name": "Elena",
                "last_name": "Romero",
                "email": "elena.romero1993@gmail.com",
                "phone": "+639261847592",
                "dob": date(1993, 11, 22),
                "building_details": "Unit 10B, Khu Pigeon Ridge",
                "city": "Batangas",
                "barangay": "Kumintang",
                "postal_code": "4200",
                "country": "Philippines"
            }
        ]
        
        print(f"Creating {len(accounts)} Philippine customer accounts...\n")
        
        created_count = 0
        skipped_count = 0
        
        for account in accounts:
            # Check if account already exists
            existing_user = db.query(models.User).filter(
                models.User.email == account["email"]
            ).first()
            
            if existing_user:
                print(f"✓ SKIPPED: {account['first_name']} {account['last_name']} ({account['email']}) - Already exists")
                skipped_count += 1
                continue
            
            # Calculate age
            today = date.today()
            dob = account["dob"]
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            
            # Create new user
            user = models.User(
                first_name=account["first_name"],
                last_name=account["last_name"],
                email=account["email"],
                phone=account["phone"],
                password=hash_password("password123"),  # Default password, properly hashed
                date_of_birth=dob,
                building_details=account["building_details"],
                city=account["city"],
                barangay=account["barangay"],
                postal_code=account["postal_code"],
                country=account["country"],
                user_role="Customer",
                status="Active",
                is_email_verified=True,
                is_phone_verified=True
            )
            
            db.add(user)
            db.flush()
            
            print(f"✓ CREATED: {account['first_name']} {account['last_name']}")
            print(f"   Email: {account['email']}")
            print(f"   Phone: {account['phone']}")
            print(f"   Age: {age}")
            print(f"   Location: {account['barangay']}, {account['city']}, {account['postal_code']}")
            print()
            
            created_count += 1
        
        db.commit()
        
        print("\n" + "="*80)
        print("ACCOUNT CREATION SUMMARY")
        print("="*80)
        print(f"✓ Successfully created: {created_count} accounts")
        print(f"⊗ Skipped (already exist): {skipped_count} accounts")
        print(f"✓ Total accounts in database: {db.query(models.User).count()}")
        
        # Display all accounts
        print("\n" + "="*80)
        print("ALL ACCOUNTS IN DATABASE")
        print("="*80 + "\n")
        
        all_users = db.query(models.User).filter(
            models.User.status == "Active"
        ).order_by(models.User.created_at.desc()).all()
        
        for idx, user in enumerate(all_users, 1):
            dob_str = user.date_of_birth.strftime("%Y-%m-%d") if user.date_of_birth else "N/A"
            age = gala_dt.date.today().year - user.date_of_birth.year - ((gala_dt.date.today().month, gala_dt.date.today().day) < (user.date_of_birth.month, user.date_of_birth.day)) if user.date_of_birth else "N/A"
            
            print(f"{idx}. {user.first_name} {user.last_name}")
            print(f"   Email: {user.email}")
            print(f"   Phone: {user.phone}")
            print(f"   DOB: {dob_str} | Age: {age}")
            print(f"   Address: {user.building_details}, {user.barangay}, {user.city}, {user.postal_code}")
            print(f"   Verified Email: {'Yes' if user.is_email_verified else 'No'} | Verified Phone: {'Yes' if user.is_phone_verified else 'No'}")
            print()
        
        print("="*80)
        print(f"✅ DONE! Created all Philippine accounts with complete data.")
        print("="*80)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_ph_accounts()
