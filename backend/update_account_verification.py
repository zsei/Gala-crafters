"""
Script to update all accounts with passwords and random verification statuses
"""

from database import SessionLocal
import models
import random

def update_accounts_verification():
    """Update all accounts with passwords and random verification statuses"""
    db = SessionLocal()
    
    try:
        # Get all users
        all_users = db.query(models.User).all()
        
        print(f"Updating {len(all_users)} accounts...\n")
        
        updated_count = 0
        
        for user in all_users:
            # Ensure password is set (8-15 characters)
            if not user.password or len(user.password) < 8 or len(user.password) > 15:
                num = str(random.randint(100, 999))
                user.password = f"hashed_pw{num}"
            
            # Randomize email verification (70% verified, 30% not verified)
            user.is_email_verified = random.random() < 0.7
            
            # Randomize phone verification (60% verified, 40% not verified)
            user.is_phone_verified = random.random() < 0.6
            
            updated_count += 1
        
        db.commit()
        
        print("\n" + "="*80)
        print("ACCOUNT UPDATE SUMMARY")
        print("="*80)
        print(f"✓ Successfully updated: {updated_count} accounts\n")
        
        # Display all updated accounts
        print("="*80)
        print("ALL ACCOUNTS WITH UPDATED VERIFICATION STATUS")
        print("="*80 + "\n")
        
        all_users_updated = db.query(models.User).order_by(models.User.id.desc()).all()
        
        verified_email_count = 0
        verified_phone_count = 0
        
        for idx, user in enumerate(all_users_updated, 1):
            dob_str = user.date_of_birth.strftime("%Y-%m-%d") if user.date_of_birth else "N/A"
            email_status = "✓ Verified" if user.is_email_verified else "✗ Not Verified"
            phone_status = "✓ Verified" if user.is_phone_verified else "✗ Not Verified"
            
            if user.is_email_verified:
                verified_email_count += 1
            if user.is_phone_verified:
                verified_phone_count += 1
            
            print(f"{idx}. {user.first_name} {user.last_name}")
            print(f"   Email: {user.email} [{email_status}]")
            print(f"   Phone: {user.phone} [{phone_status}]")
            print(f"   Password: {'✓ Set' if user.password and 8 <= len(user.password) <= 15 else '✗ Invalid'}")
            print(f"   DOB: {dob_str}")
            if user.building_details:
                print(f"   Address: {user.building_details}, {user.barangay}, {user.city}, {user.postal_code}")
            print()
        
        print("="*80)
        print("VERIFICATION STATISTICS")
        print("="*80)
        print(f"Total Accounts: {len(all_users_updated)}")
        print(f"Email Verified: {verified_email_count} ({verified_email_count*100//len(all_users_updated)}%)")
        print(f"Email Not Verified: {len(all_users_updated)-verified_email_count} ({(len(all_users_updated)-verified_email_count)*100//len(all_users_updated)}%)")
        print(f"Phone Verified: {verified_phone_count} ({verified_phone_count*100//len(all_users_updated)}%)")
        print(f"Phone Not Verified: {len(all_users_updated)-verified_phone_count} ({(len(all_users_updated)-verified_phone_count)*100//len(all_users_updated)}%)")
        print(f"\nAll passwords are set (8-15 characters) ✓")
        print("="*80)
        print(f"✅ DONE! All accounts have passwords and random verification statuses.")
        print("="*80)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_accounts_verification()
