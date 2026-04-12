"""
Authentication API endpoints for Gala Crafters CRM
Handles user login and authentication
"""

from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import User, AdminUser
import models
import datetime as gala_dt
import jwt
import uuid
from email_service import send_reset_email

# Create tables
models.Base.metadata.create_all(bind=engine)

# Security setup
security = HTTPBearer()
optional_security = HTTPBearer(auto_error=False)
SECRET_KEY = "your-secret-key-change-in-production"  # Change this in production!
ALGORITHM = "HS256"

def customer_member_status(user: User) -> str:
    """Member account label: email verified or not (phone verification removed)."""
    return "Verified" if user.is_email_verified else "Unverified"


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================================
# LOGIN ENDPOINTS
# ============================================================================

def login(email: str, password: str, db: Session = Depends(get_db)):
    """
    Customer login endpoint
    
    Test credentials:
    - Email: natasha.khaleira@email.com
    - Password: hashed_pw123
    """
    # Query user by email
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Simple password check (in production, use proper hashing)
    if user.password != password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create JWT token
    token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.user_role}
    )
    
    return {
        "success": True,
        "token": token,
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "middle_name": user.middle_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone": user.phone,
            "date_of_birth": user.date_of_birth,
            "building_details": user.building_details,
            "country": user.country,
            "city": user.city,
            "barangay": user.barangay,
            "postal_code": user.postal_code,
            "status": customer_member_status(user),
            "user_role": user.user_role,
            "is_email_verified": user.is_email_verified,
        }
    }


def admin_login(email: str, password: str, db: Session = Depends(get_db)):
    """
    Admin login endpoint
    
    Test credentials:
    - Email: a.sterling@gala.com
    - Password: hashed_admin_123
    """
    # Query admin user by email
    admin = db.query(AdminUser).filter(AdminUser.email == email).first()
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Simple password check (in production, use proper hashing)
    if admin.password != password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create JWT token
    token = create_access_token(
        data={"sub": str(admin.id), "email": admin.email, "role": admin.role}
    )
    
    return {
        "success": True,
        "token": token,
        "admin": {
            "id": admin.id,
            "name": admin.name,
            "email": admin.email,
            "role": admin.role,
            "status": admin.status
        }
    }


def register(
    first_name: str,
    last_name: str,
    email: str,
    password: str,
    phone: str,
    city: str,
    barangay: str,
    building_details: str = None,
    zip: str = None,
    db: Session = Depends(get_db)
):
    """
    Customer registration endpoint
    Creates a new user account
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=password,  # In production, hash the password!
        phone=phone,
        city=city,
        barangay=barangay,
        building_details=building_details,
        postal_code=zip,
        status="Unverified",
        user_role="Customer"
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "success": True,
        "message": "Account created successfully",
        "user": {
            "id": new_user.id,
            "first_name": new_user.first_name,
            "last_name": new_user.last_name,
            "email": new_user.email,
            "phone": new_user.phone,
            "city": new_user.city,
        }
    }


def forgot_password(email: str, db: Session = Depends(get_db)):
    """
    Simulates sending a password reset link to the user's email.
    """
    user = db.query(User).filter(User.email == email).first()
    
    # We still return success even if user not found, 
    # to prevent email enumeration (security best practice)
    if user:
        # Generate token and expiry
        token = str(uuid.uuid4())
        expiry = gala_dt.datetime.utcnow() + gala_dt.timedelta(hours=1)
        
        user.reset_token = token
        user.reset_token_expires = expiry
        db.commit()
        
        # Link structure assumes standard vite frontend dev port
        reset_link = f"http://localhost:5173/reset-password/{token}"
        send_reset_email(user.email, reset_link)
        
    return {
        "success": True, 
        "message": "If an account exists with this email, a password reset link has been sent."
    }

def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    """
    Resets the password if the token is valid and not expired.
    """
    user = db.query(User).filter(User.reset_token == token).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
        
    if user.reset_token_expires < gala_dt.datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired"
        )
        
    # Set new password
    user.password = new_password
    
    # Invalidate token
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    
    return {"success": True, "message": "Password has been successfully changed."}


def create_access_token(data: dict, expires_delta: gala_dt.timedelta = None):
    """Generate JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = gala_dt.datetime.utcnow() + expires_delta
    else:
        expire = gala_dt.datetime.utcnow() + gala_dt.timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(credentials = Depends(security)):
    """Verify JWT token"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def verify_token_optional(credentials=Depends(optional_security)):
    """Same as verify_token but returns None when no/invalid token (for optional customer context)."""
    if credentials is None or not getattr(credentials, "credentials", None):
        return None
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("sub") is None:
            return None
        return payload
    except Exception:
        return None


def logout(token_data: dict = Depends(verify_token), db: Session = Depends(get_db)):
    """
    User logout endpoint
    Records the logout timestamp in the database
    """
    user_id = token_data.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Record logout timestamp
    user.last_logout_at = gala_dt.datetime.utcnow()
    db.commit()
    
    return {
        "success": True,
        "message": "Logged out successfully",
        "logout_time": user.last_logout_at
    }


# ============================================================================
# USER MANAGEMENT ENDPOINTS
# ============================================================================

def get_user_profile(token_data: dict = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current user profile"""
    user_id = token_data.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "first_name": user.first_name,
        "middle_name": user.middle_name,
        "last_name": user.last_name,
        "email": user.email,
        "phone": user.phone,
        "date_of_birth": user.date_of_birth,
        "building_details": user.building_details,
        "country": user.country,
        "city": user.city,
        "barangay": user.barangay,
        "postal_code": user.postal_code,
        "status": customer_member_status(user),
        "user_role": user.user_role,
        "is_email_verified": user.is_email_verified,
        "created_at": user.created_at
    }


def update_user_profile(
    update_data: dict,
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    user_id = token_data.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Email uniqueness check and verification reset
    if "email" in update_data and update_data["email"].lower() != user.email.lower():
        existing_email = db.query(User).filter(User.email == update_data["email"]).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email address is already in use by another account")
        
        # Automatically reset verification status when email is changed
        user.is_email_verified = False
        user.status = "Unverified"
        # Remove is_email_verified from update_data if it's there to prevent frontend from overriding this reset
        if "is_email_verified" in update_data:
            del update_data["is_email_verified"]
    
    # Update allowed fields
    allowed_fields = [
        "first_name", "last_name", "phone", "city", "country", "postal_code", 
        "date_of_birth", "barangay", "building_details", "middle_name", "email",
        "is_email_verified"
    ]
    for field in allowed_fields:
        if field in update_data:
            if field == "date_of_birth" and update_data[field]:
                try:
                    # Convert string to date object
                    if isinstance(update_data[field], str):
                        setattr(user, field, gala_dt.datetime.strptime(update_data[field], "%Y-%m-%d").date())
                    else:
                        setattr(user, field, update_data[field])
                except ValueError:
                    # Skip if invalid date format
                    pass
            else:
                setattr(user, field, update_data[field])

    user.status = customer_member_status(user)
    user.updated_at = gala_dt.datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    # Re-generate token if email or role changed to keep session in sync
    new_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.user_role}
    )
    
    return {
        "success": True, 
        "message": "Profile updated successfully",
        "token": new_token,
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "middle_name": user.middle_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone": user.phone,
            "date_of_birth": user.date_of_birth.isoformat() if user.date_of_birth else None,
            "building_details": user.building_details,
            "country": user.country,
            "city": user.city,
            "barangay": user.barangay,
            "postal_code": user.postal_code,
            "status": customer_member_status(user),
            "user_role": user.user_role,
            "is_email_verified": user.is_email_verified
        }
    }


def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "phone": user.phone,
        "country": user.country,
        "city": user.city
    }


def list_all_users(db: Session = Depends(get_db)):
    """List all users"""
    users = db.query(User).filter(User.user_role == "Customer").all()
    
    return {
        "total": len(users),
        "users": [
            {
                "id": u.id,
                "first_name": u.first_name,
                "last_name": u.last_name,
                "name": f"{u.first_name} {u.last_name}",
                "email": u.email,
                "phone": u.phone,
                "user_role": u.user_role,
                "status": customer_member_status(u),
                "created_at": u.created_at
            }
            for u in users
        ]
    }


# ============================================================================
# ADMIN ENDPOINTS
# ============================================================================

def get_admin_users(db: Session = Depends(get_db)):
    """Get all admin users"""
    admins = db.query(AdminUser).all()
    
    return {
        "total": len(admins),
        "admins": [
            {
                "id": a.id,
                "name": a.name,
                "email": a.email,
                "role": a.role,
                "status": a.status
            }
            for a in admins
        ]
    }


def get_admin_profile(token_data: dict = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current admin profile"""
    admin = db.query(AdminUser).filter(AdminUser.email == token_data.get("email")).first()
    
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    return {
        "id": admin.id,
        "name": admin.name,
        "email": admin.email,
        "role": admin.role,
        "status": admin.status,
        "phone": admin.phone,
        "created_at": admin.created_at
    }


def update_booking_statuses_by_date(db: Session):
    """
    Update booking statuses based on event date (Philippine Time - UTC+8).
    If event_date is TODAY and status is 'Confirmed', change it to 'On-going Event'
    If event_date is in the past and status is 'On-going Event' or 'Confirmed', change it to 'Completed Event'
    """
    try:
        # Use Philippine Time (UTC+8)
        ph_time = gala_dt.datetime.utcnow() + gala_dt.timedelta(hours=8)
        today = ph_time.date()
        
        # 1. Update Confirmed events for TODAY to "On-going Event"
        today_bookings = db.query(models.Booking).filter(
            models.Booking.status == "Confirmed",
            models.Booking.event_date == today
        ).all()
        
        for booking in today_bookings:
            booking.status = "On-going Event"
        
        # 2. Update past "On-going Event" or "Confirmed" to "Completed Event"
        past_bookings = db.query(models.Booking).filter(
            models.Booking.status.in_(["On-going Event", "Confirmed"]),
            models.Booking.event_date < today
        ).all()
        
        for booking in past_bookings:
            booking.status = "Completed Event"
        
        total_updated = len(today_bookings) + len(past_bookings)
        if total_updated > 0:
            db.commit()
            if len(today_bookings) > 0:
                print(f"✓ Automatically transitioned {len(today_bookings)} bookings for {today} to 'On-going Event'")
            if len(past_bookings) > 0:
                print(f"✓ Automatically moved {len(past_bookings)} past bookings to 'Completed Event'")
        
        return total_updated
    except Exception as e:
        print(f"Error updating booking statuses: {e}")
        db.rollback()
        return 0
