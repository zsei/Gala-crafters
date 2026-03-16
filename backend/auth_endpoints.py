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
from datetime import datetime, timedelta
import jwt

# Create tables
models.Base.metadata.create_all(bind=engine)

# Security setup
security = HTTPBearer()
SECRET_KEY = "your-secret-key-change-in-production"  # Change this in production!
ALGORITHM = "HS256"

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
    - Password: hashed_password_123
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
            "last_name": user.last_name,
            "email": user.email,
            "role": user.user_role,
            "status": user.status
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
        status="Active",
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
            "barangay": new_user.barangay
        }
    }


def create_access_token(data: dict, expires_delta: timedelta = None):
    """Generate JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
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



# ============================================================================
# USER MANAGEMENT ENDPOINTS
# ============================================================================

def get_user_profile(token_data: dict = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current user profile"""
    user = db.query(User).filter(User.email == token_data.get("email")).first()
    
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
        "status": user.status,
        "user_role": user.user_role,
        "created_at": user.created_at
    }


def update_user_profile(
    update_data: dict,
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    user = db.query(User).filter(User.email == token_data.get("email")).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update allowed fields
    allowed_fields = ["first_name", "last_name", "phone", "city", "country", "postal_code"]
    for field in allowed_fields:
        if field in update_data:
            setattr(user, field, update_data[field])
    
    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    return {"success": True, "message": "Profile updated successfully"}


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
                "name": f"{u.first_name} {u.last_name}",
                "email": u.email,
                "status": u.status,
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
