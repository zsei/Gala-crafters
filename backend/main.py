"""
Main FastAPI application for Gala Crafters CRM
Entry point for the API server
"""

from fastapi import FastAPI, Depends, HTTPException, status, Request, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
import models
import os
import base64
import requests
from database import engine, SessionLocal
import datetime as gala_dt
from auth_endpoints import (
    login, 
    admin_login,
    register,
    forgot_password,
    reset_password,
    logout,
    get_user_profile, 
    update_user_profile,
    get_user_by_id,
    list_all_users,
    get_admin_users,
    get_admin_profile,
    get_admin_profile,
    verify_token,
    verify_token_optional,
    update_booking_statuses_by_date,
)
import database_setup

# Create the database tables automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Gala Crafters API",
    description="API for Gala Crafters Event Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3174", 
        "http://localhost:5174", 
        "http://localhost:3000", 
        "http://localhost:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Global Exception Handler to ensure CORS headers are present even on 500 errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"GLOBAL ERROR: {exc}")
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"error": True, "detail": str(exc), "message": "Internal Server Error"},
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
        }
    )

# Pydantic Models for request validation
class LoginRequest(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    password: str

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

class RegistrationRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    phone: str
    city: str
    barangay: str
    building_details: str | None = None
    zip: str | None = None

class ProfileUpdateRequest(BaseModel):
    first_name: str = None
    middle_name: str = None
    last_name: str = None
    email: str = None
    phone: str = None
    date_of_birth: str = None
    city: str = None
    country: str = None
    postal_code: str = None
    barangay: str = None
    building_details: str | None = None

class BookingCreateRequest(BaseModel):
    package_id: int
    event_date: str # Format: YYYY-MM-DD
    event_time: str = None
    event_type: str
    venue_proposed: str
    guest_count: int = None
    notes: str = None

ALLOWED_PROMO_AUDIENCES = frozenset({"verified", "unverified"})
# Legacy DB values still handled in promo_eligibility_for_user
LEGACY_PROMO_AUDIENCES = frozenset({"all", "fully_verified"})


def normalize_promo_audience(value: str | None) -> str:
    v = (value or "verified").strip().lower()
    if v in ALLOWED_PROMO_AUDIENCES:
        return v
    if v in LEGACY_PROMO_AUDIENCES:
        return "verified"
    return "verified"


def resolve_customer_user_from_token(db: Session, token_payload: dict | None):
    if not token_payload:
        return None
    uid = token_payload.get("sub")
    if uid is None:
        return None
    try:
        return db.query(models.User).filter(models.User.id == int(uid)).first()
    except (TypeError, ValueError):
        return None


def promo_eligibility_for_user(audience: str | None, user: models.User | None) -> tuple[bool, str | None]:
    """Returns (allowed, error_message). audience: verified | unverified; legacy all/fully_verified supported."""
    raw = (audience or "verified").strip().lower()
    if raw == "all":
        return True, None
    if raw == "fully_verified":
        raw = "verified"
    aud = raw if raw in ("verified", "unverified") else "verified"
    if user is None:
        return False, "Sign in to use this promo code."
    if aud == "verified":
        if not user.is_email_verified:
            return False, "Verify your email address to use this promo code."
        return True, None
    if aud == "unverified":
        if user.is_email_verified:
            return False, "This promo code is only for members who have not verified their email yet."
        return True, None
    return True, None


class PromoCodeRequest(BaseModel):
    code: str
    discount_percentage: float = None
    discount_amount: float = None
    expiry_date: str = None # YYYY-MM-DD
    max_uses: int = None
    status: str = "Active"
    audience: str = "verified"
    applicable_event: str = "all"
    applicable_package: str = "all"

class PromoValidateRequest(BaseModel):
    code: str

class AdminReplyRequest(BaseModel):
    message_body: str
    sender_name: str = "Admin"
    image_url: str = None

class ChatInquiryRequest(BaseModel):
    message_body: str
    name: str = None
    email: str = None
    subject: str = "Chat Inquiry"
    user_id: int = None
    image_url: str = None

class ReviewRequest(BaseModel):
    booking_id: int | str  # Accept either integer ID or string booking_reference
    rating: int # 1-5
    comment: str = None

class PaymentRequest(BaseModel):
    package_title: str
    total_price: float
    selected_date: str
    guest_count: int
    event_type: str = None
    venue_proposed: str = None
    notes: str = None
    event_theme: str = None
    color_palette: str = None
    event_location: str = None
    specific_venue_address: str = None
    special_requests: str = None

class PackageCreateRequest(BaseModel):
    package_name: str
    event_type: str
    description: str = None
    detailed_description: str = None
    base_price: float
    min_guests: int = 1
    max_guests: int = None
    extra_pax_rate: float = 350.0
    features: list[str] = []
    included_items: str = None
    image_url: str = None
    status: str = "Active"

class PackageUpdateRequest(BaseModel):
    package_name: str = None
    event_type: str = None
    description: str = None
    detailed_description: str = None
    base_price: float = None
    min_guests: int = None
    max_guests: int = None
    extra_pax_rate: float = None
    features: list[str] = None
    included_items: str = None
    image_url: str = None
    status: str = None

class BlockedDateCreateRequest(BaseModel):
    block_date: str  # YYYY-MM-DD
    note: str = None


def assert_event_date_not_blocked(db: Session, event_date: gala_dt.date):
    blocked = db.query(models.BlockedBookingDate).filter(
        models.BlockedBookingDate.block_date == event_date
    ).first()
    if blocked:
        raise HTTPException(
            status_code=400,
            detail="This date is unavailable for bookings (marked as day off). Please choose another date.",
        )


def assert_event_date_no_active_booking(db: Session, event_date: gala_dt.date):
    """One active reservation per calendar day (cancelled bookings free the date)."""
    taken = (
        db.query(models.Booking)
        .filter(
            models.Booking.event_date == event_date,
            models.Booking.status != "Cancelled",
        )
        .first()
    )
    if taken:
        raise HTTPException(
            status_code=400,
            detail="This date is already reserved. Please choose another date.",
        )


def assert_event_date_available_for_new_booking(db: Session, event_date: gala_dt.date):
    assert_event_date_not_blocked(db, event_date)
    assert_event_date_no_active_booking(db, event_date)


def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============================================================================
# HEALTH & INFO ROUTES
# ============================================================================

@app.get("/")
def read_root():
    """API root endpoint"""
    return {
        "message": "Welcome to the Gala Crafters API!",
        "version": "1.0.0",
        "status": "Running",
        "docs": "http://localhost:8000/docs",
        "redoc": "http://localhost:8000/redoc"
    }

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Gala Crafters API"}

# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@app.post("/api/auth/login")
def customer_login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Customer login endpoint
    
    Test credentials:
    - Email: natasha.khaleira@email.com
    - Password: hashed_pw123
    """
    return login(request.email, request.password, db)

@app.post("/api/auth/register")
def customer_register(request: RegistrationRequest, db: Session = Depends(get_db)):
    """
    Customer registration endpoint
    Creates a new user account
    """
    return register(
        first_name=request.first_name,
        last_name=request.last_name,
        email=request.email,
        password=request.password,
        phone=request.phone,
        city=request.city,
        barangay=request.barangay,
        building_details=request.building_details,
        zip=request.zip,
        db=db
    )

@app.post("/api/auth/admin-login")
def admin_login_endpoint(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Admin login endpoint
    
    Test credentials:
    - Email: a.sterling@gala.com
    - Password: hashed_admin_123
    """
    return admin_login(request.email, request.password, db)

@app.post("/api/auth/forgot-password")
def request_password_reset(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Endpoint for requesting a password reset link
    """
    return forgot_password(request.email, db)

@app.post("/api/auth/reset-password")
def execute_password_reset(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Endpoint for executing the actual password reset using a token
    """
    return reset_password(request.token, request.password, db)

@app.post("/api/auth/logout")
def logout_endpoint(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """
    User logout endpoint - records logout timestamp in database
    """
    return logout(credentials, db)

# ============================================================================
# USER PROFILE ROUTES
# ============================================================================

@app.get("/api/users/profile")
def get_profile(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current logged-in user's profile"""
    return get_user_profile(credentials, db)

@app.put("/api/users/profile")
def update_profile(update_data: ProfileUpdateRequest, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Update current user's profile"""
    return update_user_profile(update_data.dict(exclude_unset=True), credentials, db)

@app.get("/api/users/bookings")
def get_user_bookings(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get all bookings for the currently logged-in user"""
    user_id_val = credentials.get("sub")
    if not user_id_val:
        raise HTTPException(status_code=401, detail="Invalid user credentials")
    user_id = int(user_id_val)

    # Ensure statuses are updated
    update_booking_statuses_by_date(db)

    bookings = db.query(models.Booking).options(
        joinedload(models.Booking.package),
        joinedload(models.Booking.reviews)
    ).filter(models.Booking.customer_id == user_id).order_by(models.Booking.created_at.desc()).all()
    
    # Return formatted bookings
    return [{
        "id": b.id,
        "booking_reference": b.booking_reference,
        "event_type": b.event_type,
        "event_date": b.event_date.isoformat() if b.event_date else None,
        "event_time": b.event_time,
        "venue_proposed": b.venue_proposed,
        "guest_count": b.guest_count,
        "total_price": b.total_price if (b.total_price and b.total_price > 0) else (b.package.base_price if b.package else 0),
        "package_name": b.package.package_name if b.package else f"{b.event_type} Package",
        "status": b.status,
        "has_review": len(b.reviews) > 0,
        "created_at": b.created_at.isoformat() if b.created_at else None
    } for b in bookings]

@app.get("/api/users/reviews")
def get_user_reviews(token_data: dict = Depends(verify_token), db: Session = Depends(get_db)):
    """Get all reviews submitted by the current user"""
    user_id = int(token_data.get("sub"))
    reviews = db.query(models.Review).options(joinedload(models.Review.booking).joinedload(models.Booking.package)).filter(models.Review.customer_id == user_id).all()
    
    result = []
    for r in reviews:
        review_data = {
            "id": r.id,
            "booking_id": r.booking_id,
            "rating": r.rating,
            "comment": r.comment,
            "created_at": r.created_at.isoformat() if r.created_at else None,
            "booking": None
        }
        
        if r.booking:
            try:
                review_data["booking"] = {
                    "booking_reference": r.booking.booking_reference,
                    "event_type": r.booking.event_type,
                    "event_date": r.booking.event_date.isoformat() if (r.booking.event_date and hasattr(r.booking.event_date, 'isoformat')) else str(r.booking.event_date),
                    "total_price": float(r.booking.total_price) if r.booking.total_price else 0,
                    "package_name": r.booking.package.package_name if r.booking.package else "Custom Package"
                }
            except Exception as e:
                print(f"Error formatting booking for review {r.id}: {e}")
                
        result.append(review_data)
        
    return result

@app.get("/api/users")
def list_users(db: Session = Depends(get_db)):
    """List all customer users"""
    return list_all_users(db)

@app.get("/api/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get specific user by ID"""
    return get_user_by_id(user_id, db)

# ============================================================================
# BOOKING ROUTES
# ============================================================================

import uuid
# Standardized global datetime import used

@app.post("/api/bookings")
def create_booking(request: BookingCreateRequest, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Create a new booking for the logged-in user"""
    user_id_val = credentials.get("sub")
    if not user_id_val:
        raise HTTPException(status_code=401, detail="Invalid user credentials")
    user_id = int(user_id_val)

    # Generate a unique booking reference
    booking_ref = f"GC-{uuid.uuid4().hex[:8].upper()}"
    
    # Fetch the package to get the base price
    package = db.query(models.EventPackage).filter(models.EventPackage.id == request.package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
        
    try:
        # Convert date string to date object
        event_date_obj = gala_dt.datetime.strptime(request.event_date, "%Y-%m-%d").date()
        assert_event_date_available_for_new_booking(db, event_date_obj)

        new_booking = models.Booking(
            booking_reference=booking_ref,
            customer_id=user_id,
            package_id=request.package_id,
            event_date=event_date_obj,
            event_time=request.event_time,
            event_type=request.event_type,
            venue_proposed=request.venue_proposed,
            guest_count=request.guest_count,
            notes=request.notes,
            status="Pending",
            total_price=package.base_price # Inherit base price from package
        )
        
        db.add(new_booking)
        
        # Create notification for admin
        admin_notif = models.Notification(
            user_id=1, # Default admin ID
            message=f"New booking request {booking_ref} is pending approval.",
            notification_type="booking_pending"
        )
        db.add(admin_notif)
        
        db.commit()
        db.refresh(new_booking)
        
        return {
            "success": True, 
            "message": "Booking request submitted successfully",
            "booking_reference": booking_ref,
            "id": new_booking.id
        }
    except HTTPException:
        db.rollback()
        raise
    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create booking: {str(e)}")


@app.get("/api/blocked-dates")
def get_blocked_dates_public(db: Session = Depends(get_db)):
    """Dates that are closed for new bookings (for customer date pickers)."""
    today = gala_dt.date.today()
    rows = (
        db.query(models.BlockedBookingDate)
        .filter(models.BlockedBookingDate.block_date >= today)
        .order_by(models.BlockedBookingDate.block_date)
        .all()
    )
    return [r.block_date.isoformat() for r in rows]


@app.get("/api/booked-dates")
def get_booked_dates_public(db: Session = Depends(get_db)):
    """Event dates that already have a non-cancelled booking (for date pickers)."""
    today = gala_dt.date.today()
    rows = (
        db.query(models.Booking.event_date)
        .filter(
            models.Booking.event_date >= today,
            models.Booking.status != "Cancelled",
        )
        .distinct()
        .all()
    )
    out = sorted({r[0].isoformat() for r in rows if r[0] is not None})
    return out


# ============================================================================
# ADMIN ROUTES
# ============================================================================

@app.get("/api/admin/profile")
def get_admin_profile_endpoint(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current logged-in admin's profile"""
    return get_admin_profile(credentials, db)

@app.put("/api/admin/profile/update")
def update_admin_profile_endpoint(update_data: dict, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Update current admin's profile"""
    from auth_endpoints import AdminUser
    admin = db.query(AdminUser).filter(AdminUser.email == credentials.get("email")).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    if "name" in update_data:
        admin.name = update_data["name"]
    if "phone" in update_data:
        admin.phone = update_data["phone"]
        
    db.commit()
    db.refresh(admin)
    return {"success": True, "message": "Profile updated", "admin": {"name": admin.name, "phone": admin.phone, "image_url": admin.image_url}}

@app.put("/api/admin/profile/change-password")
def change_admin_password_endpoint(request: PasswordChangeRequest, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Change current admin's password"""
    from auth_endpoints import AdminUser
    admin = db.query(AdminUser).filter(AdminUser.email == credentials.get("email")).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    # Check current password (in production, use proper hashing)
    if admin.password != request.current_password:
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    admin.password = request.new_password
    db.commit()
    return {"success": True, "message": "Password changed successfully"}

@app.post("/api/admin/profile/upload-avatar")
async def upload_admin_avatar(file: UploadFile = File(...), credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Upload an admin avatar and return the URL"""
    from auth_endpoints import AdminUser
    admin = db.query(AdminUser).filter(AdminUser.email == credentials.get("email")).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    try:
        # Create unique filename
        timestamp = gala_dt.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"avatar_{admin.id}_{timestamp}_{file.filename.replace(' ', '_')}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Update admin record
        image_url = f"http://localhost:8000/uploads/{filename}"
        admin.image_url = image_url
        db.commit()
        
        return {"url": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")

# Helper: Create Audit Log
def create_audit_log(db: Session, admin_id: int, admin_name: str, action: str, details: str = None):
    new_log = models.AuditLog(
        admin_id=admin_id,
        admin_name=admin_name,
        action=action,
        details=details,
        created_at=gala_dt.datetime.utcnow()
    )
    db.add(new_log)
    db.commit()


@app.get("/api/admin/users")
def get_admin_users_endpoint(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get all admin users from real database"""
    admins = database_setup.get_admin_users()
    return {"admins": admins}


class AdminUserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    role: str
    phone: str | None = None


@app.post("/api/admin/users/create")
def create_admin_user_endpoint(request: AdminUserCreate, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Create a new admin/staff user with PH phone format"""
    from auth_endpoints import AdminUser
    
    # Check if user already exists
    existing = db.query(AdminUser).filter(AdminUser.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Ensure phone has +63 if provided and doesn't have it
    phone = request.phone
    if phone:
        phone = phone.strip()
        if not phone.startswith('+63'):
            # Remove leading 0 if present
            if phone.startswith('0'): phone = phone[1:]
            phone = f"+63 {phone}"
    
    # Create new admin user
    new_admin = AdminUser(
        name=f"{request.first_name} {request.last_name}",
        email=request.email,
        password=request.password,
        role=request.role,
        status="Active",
        phone=phone or "+63 000 000 0000",
        created_at=gala_dt.datetime.utcnow()
    )
    
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    # Log the action
    admin_id = credentials.get("sub")
    admin_name = credentials.get("name") or "Admin"
    create_audit_log(db, int(admin_id) if admin_id else 0, admin_name, "Created User", f"Created staff member: {new_admin.name} ({new_admin.role})")
    
    return {"success": True, "message": "Staff member created successfully"}


class AdminUserUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    role: str | None = None
    phone: str | None = None
    status: str | None = None


@app.put("/api/admin/users/{user_id}")
def update_admin_user_endpoint(user_id: int, request: AdminUserUpdate, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Update admin/staff user details"""
    from auth_endpoints import AdminUser
    admin_id = credentials.get("sub")
    admin_name = credentials.get("name") or "Admin"
    
    user = db.query(AdminUser).filter(AdminUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    # Check email uniqueness if changing
    if request.email and request.email != user.email:
        existing = db.query(AdminUser).filter(AdminUser.email == request.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = request.email

    if request.name: user.name = request.name
    if request.role: user.role = request.role
    if request.status: user.status = request.status
    
    if request.phone:
        phone = request.phone.strip()
        if not phone.startswith('+63'):
            if phone.startswith('0'): phone = phone[1:]
            phone = f"+63 {phone}"
        user.phone = phone

    db.commit()
    create_audit_log(db, int(admin_id) if admin_id else 0, admin_name, "Updated Staff Details", f"Updated details for staff member: {user.name}")
    
    return {"success": True, "message": "Staff member updated successfully"}


@app.delete("/api/admin/users/{user_id}")
def delete_admin_user_endpoint(user_id: int, is_admin: bool = True, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Archive or delete a user"""
    admin_id = credentials.get("sub")
    admin_name = credentials.get("name") or "Admin"
    
    if is_admin:
        from auth_endpoints import AdminUser
        user = db.query(AdminUser).filter(AdminUser.id == user_id).first()
        if not user: raise HTTPException(status_code=404, detail="Staff not found")
        
        # Soft delete by archiving
        user.status = "Archived"
        db.commit()
        create_audit_log(db, int(admin_id) if admin_id else 0, admin_name, "Archived Staff", f"Archived staff member: {user.name}")
    else:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user: raise HTTPException(status_code=404, detail="Client not found")
        
        user.status = "Archived"
        db.commit()
        create_audit_log(db, int(admin_id) if admin_id else 0, admin_name, "Archived Client", f"Archived client: {user.first_name} {user.last_name}")
        
    return {"success": True, "message": "User archived successfully"}


@app.get("/api/admin/notifications")
def get_admin_notifications_endpoint(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get recent admin notifications"""
    # Assuming user_id=1 is for admin (based on confirm_booking logic)
    notifs = db.query(models.Notification).filter(models.Notification.user_id == 1).order_by(models.Notification.created_at.desc()).limit(10).all()
    return notifs


@app.post("/api/admin/notifications/mark-read")
def mark_admin_notifications_read(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Mark all admin notifications as read"""
    db.query(models.Notification).filter(models.Notification.user_id == 1).update({"is_read": True}, synchronize_session=False)
    db.commit()
    return {"success": True}


class QuickPermissionUpdate(BaseModel):
    user_id: int
    role: str | None = None
    status: str | None = None
    is_admin: bool = False # Whether it's an AdminUser or a regular User


@app.post("/api/admin/users/quick-update")
def quick_update_user_endpoint(request: QuickPermissionUpdate, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Quickly update user role or status"""
    admin_id = credentials.get("sub")
    admin_name = credentials.get("name") or "Admin"
    
    if request.is_admin:
        from auth_endpoints import AdminUser
        user = db.query(AdminUser).filter(AdminUser.id == request.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Admin user not found")
        
        old_role = user.role
        old_status = user.status
        
        if request.role: user.role = request.role
        if request.status: user.status = request.status
        
        db.commit()
        create_audit_log(db, int(admin_id) if admin_id else 0, admin_name, "Updated Permissions", f"Updated staff {user.name}: Role {old_role}->{user.role}, Status {old_status}->{user.status}")
    else:
        user = db.query(models.User).filter(models.User.id == request.user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        old_status = user.status
        if request.status: 
            user.status = request.status
            # If status is being set to Verified, also update is_email_verified
            if request.status == "Verified":
                user.is_email_verified = True
        
        db.commit()
        create_audit_log(db, int(admin_id) if admin_id else 0, admin_name, "Updated User Status", f"Updated client {user.first_name} {user.last_name}: Status {old_status}->{user.status}")
        
    return {"success": True, "message": "User updated successfully"}

@app.get("/api/admin/bookings")
def get_admin_bookings_endpoint(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get all active bookings for admin"""
    # Update all expired bookings that should be marked as "On-going Event"
    update_booking_statuses_by_date(db)
    
    return database_setup.get_active_bookings()


@app.get("/api/admin/blocked-dates")
def admin_get_blocked_dates(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    rows = (
        db.query(models.BlockedBookingDate)
        .order_by(models.BlockedBookingDate.block_date)
        .all()
    )
    return [
        {
            "id": r.id,
            "block_date": r.block_date.isoformat(),
            "note": r.note,
        }
        for r in rows
    ]


@app.post("/api/admin/blocked-dates")
def admin_add_blocked_date(
    request: BlockedDateCreateRequest,
    credentials = Depends(verify_token),
    db: Session = Depends(get_db),
):
    try:
        d = gala_dt.datetime.strptime(request.block_date.strip(), "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date. Use YYYY-MM-DD.")
    existing = (
        db.query(models.BlockedBookingDate)
        .filter(models.BlockedBookingDate.block_date == d)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="This date is already marked unavailable.")
    row = models.BlockedBookingDate(block_date=d, note=request.note)
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"success": True, "id": row.id, "block_date": row.block_date.isoformat()}


@app.delete("/api/admin/blocked-dates/{block_date}")
def admin_remove_blocked_date(
    block_date: str,
    credentials = Depends(verify_token),
    db: Session = Depends(get_db),
):
    try:
        d = gala_dt.datetime.strptime(block_date.strip(), "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date.")
    row = (
        db.query(models.BlockedBookingDate)
        .filter(models.BlockedBookingDate.block_date == d)
        .first()
    )
    if not row:
        raise HTTPException(status_code=404, detail="This date is not marked unavailable.")
    db.delete(row)
    db.commit()
    return {"success": True}

@app.post("/api/admin/bookings/{booking_reference}/confirm")
def confirm_booking(booking_reference: str, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Confirm a booking"""
    try:
        booking = db.query(models.Booking).filter(
            models.Booking.booking_reference == booking_reference
        ).first()
        
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        booking.status = "Confirmed"
        
        # Create notification for the user
        new_notif = models.Notification(
            user_id=booking.customer_id,
            message=f"Your booking {booking_reference} has been confirmed!",
            notification_type="booking_confirmed"
        )
        db.add(new_notif)
        
        # Create notification for admin
        admin_notif = models.Notification(
            user_id=1, # Default admin ID
            message=f"Booking {booking_reference} has been confirmed.",
            notification_type="booking_confirmed"
        )
        db.add(admin_notif)
        
        db.commit()
        
        # Log action
        admin_id = credentials.get("sub")
        admin_name = credentials.get("name") or "Admin"
        create_audit_log(db, int(admin_id) if admin_id else 0, admin_name, "Confirmed Booking", f"Confirmed booking: {booking_reference}")

        return {
            "success": True,
            "message": "Booking confirmed successfully",
            "booking_reference": booking_reference,
            "status": "Confirmed"
        }
    except Exception as e:
        db.rollback()
        print(f"Error confirming booking: {e}")
        raise HTTPException(status_code=500, detail=f"Error confirming booking: {str(e)}")

@app.post("/api/admin/bookings/{booking_reference}/cancel")
def cancel_booking(booking_reference: str, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Cancel a booking"""
    try:
        booking = db.query(models.Booking).filter(
            models.Booking.booking_reference == booking_reference
        ).first()
        
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        booking.status = "Cancelled"
        
        # Create notification for the user
        new_notif = models.Notification(
            user_id=booking.customer_id,
            message=f"Your booking {booking_reference} has been cancelled.",
            notification_type="booking_cancelled"
        )
        db.add(new_notif)
        
        # Create notification for admin
        admin_notif = models.Notification(
            user_id=1, # Default admin ID
            message=f"Booking {booking_reference} has been cancelled.",
            notification_type="booking_cancelled"
        )
        db.add(admin_notif)
        
        db.commit()
        
        # Log action
        admin_id = credentials.get("sub")
        admin_name = credentials.get("name") or "Admin"
        create_audit_log(db, int(admin_id) if admin_id else 0, admin_name, "Cancelled Booking", f"Cancelled booking: {booking_reference}")

        return {
            "success": True,
            "message": "Booking cancelled successfully",
            "booking_reference": booking_reference,
            "status": "Cancelled"
        }
    except Exception as e:
        db.rollback()
        print(f"Error cancelling booking: {e}")
        raise HTTPException(status_code=500, detail=f"Error cancelling booking: {str(e)}")

@app.post("/api/admin/bookings/{booking_reference}/complete")
def complete_booking(booking_reference: str, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Mark a booking as complete"""
    try:
        booking = db.query(models.Booking).filter(
            models.Booking.booking_reference == booking_reference
        ).first()
        
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        booking.status = "Completed Event"
        
        # Create notification for the user
        new_notif = models.Notification(
            user_id=booking.customer_id,
            message=f"Thank you for choosing Gala Crafters! Your event {booking_reference} is now marked as Completed.",
            notification_type="booking"
        )
        db.add(new_notif)
        
        db.commit()
        
        return {
            "success": True,
            "message": "Booking marked as complete successfully",
            "booking_reference": booking_reference,
            "status": "Completed Event"
        }
    except Exception as e:
        db.rollback()
        print(f"Error completing booking: {e}")
        raise HTTPException(status_code=500, detail=f"Error completing booking: {str(e)}")

@app.get("/api/packages")
def get_packages_endpoint(db: Session = Depends(get_db)):
    """Get all available packages for customers"""
    return database_setup.get_available_packages()

@app.get("/api/admin/packages")
def get_admin_packages_endpoint(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get all available packages for admin"""
    return database_setup.get_available_packages()

@app.post("/api/admin/packages/upload-image")
async def upload_package_image(file: UploadFile = File(...), credentials = Depends(verify_token)):
    """Upload a package image and return the URL"""
    try:
        # Create unique filename
        timestamp = gala_dt.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"pkg_{timestamp}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return relative URL
        return {"url": f"/uploads/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")

@app.post("/api/admin/packages")
def create_package(package: PackageCreateRequest, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Create a new event package"""
    new_package = models.EventPackage(
        package_name=package.package_name,
        event_type=package.event_type,
        description=package.description,
        detailed_description=package.detailed_description,
        base_price=package.base_price,
        min_guests=package.min_guests,
        max_guests=package.max_guests,
        extra_pax_rate=package.extra_pax_rate,
        features=package.features,
        included_items=package.included_items,
        image_url=package.image_url,
        status=package.status
    )
    db.add(new_package)
    db.commit()
    db.refresh(new_package)
    return new_package

@app.put("/api/admin/packages/{package_id}")
def update_package(package_id: int, package: PackageUpdateRequest, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Update an existing package"""
    db_package = db.query(models.EventPackage).filter(models.EventPackage.id == package_id).first()
    if not db_package:
        raise HTTPException(status_code=404, detail="Package not found")
        
    update_data = package.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_package, key, value)
        
    db.commit()
    db.refresh(db_package)
    return db_package

@app.delete("/api/admin/packages/{package_id}")
def delete_package(package_id: int, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Soft delete (archive) an existing package"""
    db_package = db.query(models.EventPackage).filter(models.EventPackage.id == package_id).first()
    if not db_package:
        raise HTTPException(status_code=404, detail="Package not found")
        
    db_package.status = "Archived"
    db.commit()
    db.refresh(db_package)
    return {"message": "Package archived successfully", "package": db_package}

@app.get("/api/admin/pending-approvals")
def get_admin_pending_approvals_endpoint(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get all pending approvals"""
    return database_setup.get_pending_approvals()

@app.post("/api/admin/pending-approvals/{approval_id}/approve")
def approve_pending_request(approval_id: int, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Approve a pending request"""
    approval = db.query(models.PendingApproval).filter(models.PendingApproval.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    # Update associated booking if applicable
    if approval.related_booking_id:
        booking = db.query(models.Booking).filter(models.Booking.id == approval.related_booking_id).first()
        if booking:
            if approval.approval_type == "New Booking":
                booking.status = "Confirmed"
            elif approval.approval_type == "Cancellation":
                booking.status = "Cancelled"
    
    approval.status = "Approved"
    db.commit()
    return {"success": True, "message": f"{approval.approval_type} approved"}

@app.post("/api/admin/pending-approvals/{approval_id}/reject")
def reject_pending_request(approval_id: int, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Reject a pending request"""
    approval = db.query(models.PendingApproval).filter(models.PendingApproval.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    # If rejecting a cancellation, maybe we keep it 'Confirmed'?
    # For now, just mark the request as rejected
    approval.status = "Rejected"
    db.commit()
    return {"success": True, "message": f"{approval.approval_type} rejected"}

@app.get("/api/admin/metrics")
def get_admin_metrics_endpoint(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get admin dashboard metrics"""
    # Ensure statuses are updated before getting metrics
    update_booking_statuses_by_date(db)
    
    # get_dashboard_metrics returns a list with one dict
    metrics = database_setup.get_dashboard_metrics()
    return metrics[0] if metrics else {}

@app.get("/api/admin/messages")
def get_admin_messages_endpoint(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get recent messages for admin"""
    return database_setup.get_recent_messages()


@app.get("/api/admin/unread-counts")
def get_unread_counts_endpoint(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get unread counts for sidebar badges"""
    counts = database_setup.get_unread_counts()
    if counts and len(counts) > 0:
        return counts[0]
    return {"inquiry_count": 0, "message_count": 0}


@app.get("/api/admin/messages/{message_id}/thread")
def get_message_thread(message_id: int, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get full conversation thread for a message"""
    # Get initial inquiry
    inquiry = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Get all replies
    replies = db.query(models.AdminMessage).filter(
        models.AdminMessage.conversation_id == str(message_id)
    ).order_by(models.AdminMessage.message_date.asc()).all()
    
    # Format response
    thread = [
        {
            "id": f"inquiry-{inquiry.id}",
            "type": "client",
            "sender_name": inquiry.name,
            "sender_email": inquiry.email,
            "message_body": inquiry.message_body,
            "message_date": inquiry.created_at.isoformat() if inquiry.created_at else None,
            "subject": inquiry.message_subject
        }
    ]
    
    for reply in replies:
        thread.append({
            "id": f"reply-{reply.id}",
            "type": "admin",
            "sender_name": reply.sender_name,
            "sender_email": reply.sender_email,
            "message_body": reply.message_body,
            "message_date": reply.message_date.isoformat() if reply.message_date else None
        })
        
    return thread

@app.post("/api/admin/messages/{message_id}/reply")
def post_admin_reply(message_id: int, request: AdminReplyRequest, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Post a reply to an inquiry"""
    admin_email = credentials.get("email")
    
    new_reply = models.AdminMessage(
        conversation_id=str(message_id),
        message_body=request.message_body,
        sender_name=request.sender_name,
        message_date=gala_dt.datetime.utcnow()
    )
    
    db.add(new_reply)
    
    # Update inquiry status to 'Read'
    inquiry = db.query(models.Message).filter(models.Message.id == message_id).first()
    if inquiry:
        inquiry.status = "Read"
        
    db.commit()
    db.refresh(new_reply)
    
    return {"success": True, "message": "Reply sent successfully", "reply_id": new_reply.id}

@app.get("/api/admin/conversations")
def get_admin_conversations(db: Session = Depends(get_db)):
    """Get all unique user chat conversations for the Messages tab"""
    from sqlalchemy import func, text
    
    # Get all unique conversation IDs that start with 'user_'
    conv_ids = db.query(models.AdminMessage.conversation_id)\
                 .filter(models.AdminMessage.conversation_id.like("user_%"))\
                 .distinct().all()
    
    res = []
    for (conv_id,) in conv_ids:
        # Find the latest message for this conversation to get last_active
        last_msg = db.query(models.AdminMessage)\
                     .filter(models.AdminMessage.conversation_id == conv_id)\
                     .order_by(models.AdminMessage.message_date.desc())\
                     .first()
        
        # Find the first message from the USER to get their name/email
        user_msg = db.query(models.AdminMessage)\
                     .filter(models.AdminMessage.conversation_id == conv_id, models.AdminMessage.sender_type == "user")\
                     .order_by(models.AdminMessage.message_date.asc())\
                     .first()
        
        # Check if there are any unread messages from the USER in this conversation
        unread_count = db.query(models.AdminMessage)\
                         .filter(
                             models.AdminMessage.conversation_id == conv_id, 
                             models.AdminMessage.sender_type == "user",
                             models.AdminMessage.is_read == False
                         ).count()
        
        if user_msg:
            res.append({
                "id": conv_id,
                "name": user_msg.sender_name,
                "email": user_msg.sender_email,
                "last_message": last_msg.message_body if last_msg else "",
                "last_active": last_msg.message_date.isoformat() if last_msg else None,
                "status": "Online",
                "unread_count": unread_count
            })
    
    # Sort by last_active descending
    res.sort(key=lambda x: x['last_active'] or '', reverse=True)
    return res

@app.get("/api/admin/conversations/{conversation_id}")
def get_conversation_thread(conversation_id: str, db: Session = Depends(get_db)):
    """Get full thread for a user conversation along with user context and bookings"""
    # Mark messages as read when opening thread
    db.query(models.AdminMessage)\
      .filter(
          models.AdminMessage.conversation_id == conversation_id,
          models.AdminMessage.sender_type == "user",
          models.AdminMessage.is_read == False
      )\
      .update({"is_read": True}, synchronize_session=False)
    db.commit()

    messages = db.query(models.AdminMessage).filter(
        models.AdminMessage.conversation_id == conversation_id
    ).order_by(models.AdminMessage.message_date.asc()).all()
    
    user_data = None
    bookings_data = []
    
    if conversation_id.startswith("user_"):
        try:
            user_id = int(conversation_id.split("_")[1])
            user = db.query(models.User).filter(models.User.id == user_id).first()
            if user:
                user_data = {
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "phone": user.phone,
                    "date_of_birth": user.date_of_birth.isoformat() if user.date_of_birth else None,
                    "city": user.city,
                    "barangay": user.barangay,
                    "postal_code": user.postal_code,
                    "building_details": user.building_details,
                    "created_at": user.created_at.isoformat() if user.created_at else None
                }
                
                # Fetch bookings
                bookings = db.query(models.Booking).filter(models.Booking.customer_id == user_id).order_by(models.Booking.created_at.desc()).all()
                bookings_data = [{
                    "id": b.id,
                    "reference": b.booking_reference,
                    "package": b.package.package_name if b.package else "Custom",
                    "date": b.event_date.isoformat() if b.event_date else None,
                    "status": b.status,
                    "total": b.total_price
                } for b in bookings]
        except:
            pass

    return {
        "messages": [{
            "id": m.id,
            "type": "client" if m.sender_type == "user" else "admin",
            "text": m.message_body,
            "image_url": m.image_url,
            "date": m.message_date.isoformat() if m.message_date else None,
            "sender_name": m.sender_name
        } for m in messages],
        "user_profile": user_data,
        "booking_history": bookings_data
    }

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload an image and return its URL"""
    # Simple filename cleanup
    filename = file.filename.replace(" ", "_")
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # De-duplicate if file exists
    if os.path.exists(file_path):
        import time
        filename = f"{int(time.time())}_{filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"http://localhost:8000/uploads/{filename}"}

@app.post("/api/admin/conversations/{conversation_id}/reply")
def reply_to_conversation(conversation_id: str, request: AdminReplyRequest, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Reply to a user chat conversation"""
    admin_email = credentials.get("email")
    
    new_reply = models.AdminMessage(
        conversation_id=conversation_id,
        message_body=request.message_body,
        sender_name=request.sender_name,
        sender_email=admin_email,
        sender_type="admin",
        image_url=request.image_url,
        message_date=gala_dt.datetime.utcnow()
    )
    
    db.add(new_reply)
    db.commit()
    db.refresh(new_reply)
    
    return {"success": True, "message": "Reply sent", "id": new_reply.id}

@app.put("/api/admin/messages/{message_id}/read")
def mark_message_read(message_id: int, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Mark an inquiry as read/reviewed"""
    inquiry = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Message not found")
    
    inquiry.status = "Read"
    db.commit()
    return {"success": True, "message": "Inquiry marked as read"}

@app.get("/api/promo-codes/active")
def get_active_promo_codes_public(
    db: Session = Depends(get_db),
    token_payload: dict | None = Depends(verify_token_optional),
):
    """Active, non-expired promo codes with uses remaining. Send Bearer token to see audience-restricted codes."""
    today = gala_dt.date.today()
    user = resolve_customer_user_from_token(db, token_payload)
    rows = db.query(models.PromoCode).filter(models.PromoCode.status == "Active").all()
    out = []
    for p in rows:
        if p.expiry_date and p.expiry_date < today:
            continue
        uses = p.current_uses or 0
        if p.max_uses is not None and uses >= p.max_uses:
            continue
        aud = getattr(p, "audience", None) or "verified"
        allowed, _ = promo_eligibility_for_user(aud, user)
        if not allowed:
            continue
        out.append({
            "id": p.id,
            "code": p.code,
            "discount_percentage": p.discount_percentage,
            "discount_amount": p.discount_amount,
            "expiry_date": p.expiry_date.isoformat() if p.expiry_date else None,
            "max_uses": p.max_uses,
            "current_uses": uses,
            "status": p.status,
            "audience": aud,
        })
    return out


@app.post("/api/promo-codes/validate")
def validate_promo_code_public(
    request: PromoValidateRequest,
    db: Session = Depends(get_db),
    token_payload: dict | None = Depends(verify_token_optional),
):
    """Validate a promo code for checkout. Send Bearer token when code is restricted to verified users."""
    code_clean = (request.code or "").strip()
    if not code_clean:
        raise HTTPException(status_code=400, detail="Promo code is required")

    promo = db.query(models.PromoCode).filter(
        func.upper(models.PromoCode.code) == func.upper(code_clean)
    ).first()

    if not promo:
        return {"valid": False, "message": "Invalid promo code"}

    today = gala_dt.date.today()
    if promo.status != "Active":
        return {"valid": False, "message": "This promo code is not active"}
    if promo.expiry_date and promo.expiry_date < today:
        return {"valid": False, "message": "This promo code has expired"}
    uses = promo.current_uses or 0
    if promo.max_uses is not None and uses >= promo.max_uses:
        return {"valid": False, "message": "This promo code has reached its usage limit"}

    user = resolve_customer_user_from_token(db, token_payload)
    aud = getattr(promo, "audience", None) or "verified"
    allowed, err_msg = promo_eligibility_for_user(aud, user)
    if not allowed:
        return {"valid": False, "message": err_msg or "You are not eligible for this promo code."}

    return {
        "valid": True,
        "code": promo.code,
        "discount_percentage": promo.discount_percentage,
        "discount_amount": promo.discount_amount,
        "message": "Promo applied",
    }


@app.get("/api/admin/promo-codes")
def get_promo_codes(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get all promo codes for admin"""
    return database_setup.get_all_promo_codes()

@app.post("/api/admin/promo-codes")
def create_promo_code(request: PromoCodeRequest, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Create a new promo code"""
# Shadowed local import removed
    
    expires = None
    if request.expiry_date:
        try:
            expires = gala_dt.datetime.strptime(request.expiry_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    new_code = models.PromoCode(
        code=request.code,
        discount_percentage=request.discount_percentage,
        discount_amount=request.discount_amount,
        expiry_date=expires,
        max_uses=request.max_uses,
        status=request.status,
        audience=normalize_promo_audience(request.audience),
        applicable_event=request.applicable_event,
        applicable_package=request.applicable_package
    )
    db.add(new_code)
    try:
        db.commit()
        db.refresh(new_code)
        return {"success": True, "message": "Promo code created", "id": new_code.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to create promo code: {str(e)}")

@app.put("/api/admin/promo-codes/{code_id}")
def update_promo_code(code_id: int, request: PromoCodeRequest, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Update an existing promo code"""
# Shadowed local import removed
    
    promo = db.query(models.PromoCode).filter(models.PromoCode.id == code_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promo code not found")
    
    promo.code = request.code
    promo.discount_percentage = request.discount_percentage
    promo.discount_amount = request.discount_amount
    promo.max_uses = request.max_uses
    promo.status = request.status
    promo.audience = normalize_promo_audience(request.audience)
    promo.applicable_event = request.applicable_event
    promo.applicable_package = request.applicable_package

    if request.expiry_date:
        try:
            promo.expiry_date = gala_dt.datetime.strptime(request.expiry_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    db.commit()
    return {"success": True, "message": "Promo code updated"}

@app.delete("/api/admin/promo-codes/{code_id}")
def delete_promo_code(code_id: int, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Delete a promo code"""
    promo = db.query(models.PromoCode).filter(models.PromoCode.id == code_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promo code not found")
    
    db.delete(promo)
    db.commit()
    return {"success": True, "message": "Promo code deleted"}

# --- REVIEW ENDPOINTS ---

@app.get("/api/reviews/package/{package_id}")
def get_package_reviews(package_id: int, db: Session = Depends(get_db)):
    """Get all reviews for a specific package (public endpoint)"""
    try:
        print(f"DEBUG: Fetching reviews for package_id: {package_id}")
        reviews = db.query(models.Review).join(
            models.Booking, models.Review.booking_id == models.Booking.id
        ).filter(
            models.Booking.package_id == package_id,
            models.Review.status == "Visible"
        ).all()
        
        print(f"DEBUG: Found {len(reviews)} reviews for package_id: {package_id}")
        
        if not reviews:
            return []
        
        result = []
        for r in reviews:
            try:
                review_item = {
                    "id": r.id,
                    "rating": r.rating,
                    "comment": r.comment,
                    "created_at": r.created_at,
                    "customer_name": r.customer.first_name if r.customer else "Customer",
                    "package_name": r.booking.package.package_name if (r.booking and r.booking.package) else "Event Package"
                }
                result.append(review_item)
            except Exception as item_err:
                print(f"DEBUG: Error processing individual review ID {r.id}: {item_err}")
        
        return result
    except Exception as e:
        print(f"Error fetching package reviews for ID {package_id}: {e}")
        import traceback
        traceback.print_exc()
        return []

@app.get("/api/reviews/featured")
def get_featured_reviews(limit: int = 10, db: Session = Depends(get_db)):
    """Get featured 5-star reviews for landing page (public endpoint)"""
    try:
        reviews = db.query(models.Review).filter(
            models.Review.rating == 5,
            models.Review.status == "Visible"
        ).order_by(models.Review.created_at.desc()).limit(limit).all()
        
        if not reviews:
            return []
        
        return [
            {
                "id": r.id,
                "rating": r.rating,
                "comment": r.comment,
                "created_at": r.created_at,
                "first_name": r.customer.first_name if r.customer else "Customer",
                "last_name": r.customer.last_name if r.customer else "",
                "package_name": r.booking.package.package_name if (r.booking and r.booking.package) else "Event Package"
            }
            for r in reviews
        ]
    except Exception as e:
        print(f"Error fetching featured reviews: {e}")
        return []

@app.get("/api/admin/reviews")
def get_admin_reviews(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get all reviews for admin"""
    return database_setup.get_all_reviews()

@app.post("/api/reviews")
def submit_review(request: ReviewRequest, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Submit a review (Customer only)"""
    user_id = int(credentials.get("sub"))
    
    # Flexible query: check by ID or booking_reference
    booking_query = db.query(models.Booking).filter(models.Booking.customer_id == user_id)
    
    if isinstance(request.booking_id, int):
        booking = booking_query.filter(models.Booking.id == request.booking_id).first()
    else:
        # Check by booking_reference
        booking = booking_query.filter(models.Booking.booking_reference == request.booking_id).first()
        
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found or not authorized")
    
    new_review = models.Review(
        booking_id=booking.id, # Always use the actual integer ID for the model
        customer_id=user_id,
        rating=request.rating,
        comment=request.comment
    )
    db.add(new_review)
    db.commit()
    return {"success": True, "message": "Review submitted successfully"}

@app.post("/api/chat/submit")
def submit_chat_inquiry(request: ChatInquiryRequest, db: Session = Depends(get_db)):
    """Submit a message from the chat assistant/contact form"""
    # Determine if it's a registered user
    is_registered = request.user_id is not None

    new_message_id = None
    
    # 1. If NOT a registered user, save to Message table (This is for the 'Guest Inquiries' tab)
    if not is_registered:
        new_message = models.Message(
            name=request.name or "Guest User",
            email=request.email or "guest@galacrafters.com",
            message_subject=request.subject or "Message",
            message_body=request.message_body,
            status="Unread",
            created_at=gala_dt.datetime.utcnow()
        )
        db.add(new_message)
        db.flush() # Get ID before commit if needed
        new_message_id = new_message.id
    
    # 2. If it's a registered user, ONLY save to AdminMessage table (This is for the 'Client Messages' tab)
    if is_registered:
        conv_id = f"user_{request.user_id}"
        admin_msg = models.AdminMessage(
            conversation_id=conv_id,
            sender_name=request.name or "User",
            sender_email=request.email or "user@email.com",
            sender_type="user",
            message_body=request.message_body,
            message_date=gala_dt.datetime.utcnow()
        )
        db.add(admin_msg)

        # 3. Add automatic response from Gala Assistant (also saved to AdminMessage)
        auto_reply = models.AdminMessage(
            conversation_id=conv_id,
            sender_name="Gala Assistant",
            sender_email="assistant@galacrafters.com",
            sender_type="admin",
            message_body="Thanks for reaching out! One of our planners will get back to you shortly. In the meantime, feel free to check our premium services.",
            message_date=gala_dt.datetime.utcnow() + gala_dt.timedelta(seconds=1)
        )
        db.add(auto_reply)
        
    db.commit()
    
    # Determine message type based on whether user_id was provided
    message_type = "chat" if is_registered else "inquiry"
    return {"success": True, "message": "Message submitted successfully", "message_id": new_message_id, "type": message_type}

@app.get("/api/chat/history/{user_id}")
def get_user_chat_history(user_id: int, db: Session = Depends(get_db)):
    """Get the full chat history for a specific registered user"""
    conv_id = f"user_{user_id}"
    messages = db.query(models.AdminMessage)\
                 .filter(models.AdminMessage.conversation_id == conv_id)\
                 .order_by(models.AdminMessage.message_date.asc())\
                 .all()
    
    return [{
        "id": m.id,
        "text": m.message_body,
        "sender": "sent" if m.sender_type == "user" else "received",
        "date": m.message_date.isoformat() if m.message_date else None,
        "image_url": m.image_url
    } for m in messages]

# --- NOTIFICATION ENDPOINTS ---

@app.get("/api/notifications")
def get_notifications(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get all notifications for the current user"""
    user_id = int(credentials.get("sub"))
    notifications = db.query(models.Notification).filter(
        models.Notification.user_id == user_id
    ).order_by(models.Notification.created_at.desc()).all()
    
    return [{
        "id": n.id,
        "text": n.message,
        "unread": not n.is_read,
        "time": n.created_at.isoformat() if n.created_at else None,
        "type": n.notification_type
    } for n in notifications]

@app.put("/api/notifications/{notification_id}/read")
def mark_notification_read(notification_id: int, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Mark a specific notification as read"""
    user_id = int(credentials.get("sub"))
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == user_id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notification.is_read = True
    db.commit()
    return {"success": True}

@app.put("/api/notifications/read-all")
def mark_all_notifications_read(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Mark all notifications as read for current user"""
    user_id = int(credentials.get("sub"))
    db.query(models.Notification).filter(
        models.Notification.user_id == user_id,
        models.Notification.is_read == False
    ).update({"is_read": True})
    
    db.commit()
    return {"success": True}

@app.delete("/api/notifications")
def clear_all_notifications(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Delete all notifications for current user"""
    user_id = int(credentials.get("sub"))
    db.query(models.Notification).filter(
        models.Notification.user_id == user_id
    ).delete()
    
    db.commit()
    return {"success": True}

# --- DISCOUNT / PROMO CODE ENDPOINTS ---

# --- REPORT ENDPOINTS ---

@app.get("/api/admin/reports/sales")
def get_reports(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get sales reports for admin"""
    return database_setup.get_sales_report()

# ============================================================================
# PAYMENT ROUTES
# ============================================================================

@app.post("/api/payments/create-checkout")
def create_paymongo_checkout(request: PaymentRequest, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """
    Create a PayMongo Checkout Session for event reservation.
    Also creates a temporary booking record in the database.
    """
    user_id = int(credentials.get("sub"))
    
    # 1. Create the booking record in the database first
    import uuid
    booking_ref = f"GC-{uuid.uuid4().hex[:8].upper()}"
    
    # Try to find the correct package ID by name
    package_id = 1 # Default fallback
    package_title = request.package_title.strip()
    
    # Clean up title for matching (e.g., "The Playful Set" or "Intimate Wedding Package")
    # We'll try an exact match first, then a fuzzy match
    matched_pkg = db.query(models.EventPackage).filter(
        models.EventPackage.package_name.ilike(package_title)
    ).first()
    
    if not matched_pkg:
        matched_pkg = db.query(models.EventPackage).filter(
            models.EventPackage.package_name.ilike(f"%{package_title}%")
        ).first()
    
    if matched_pkg:
        package_id = matched_pkg.id
    else:
        # If still not found, try to match by event type as a last resort
        type_pkg = db.query(models.EventPackage).filter(
            models.EventPackage.event_type.ilike(request.event_type)
        ).first()
        if type_pkg:
            package_id = type_pkg.id
    
    try:
        # Convert date string to date object
        # The frontend sends it in a format like "December 25, 2024" or similar from formatDate
        # Let's try a few common formats or fallback to today
        event_date_obj = gala_dt.datetime.now().date()
        try:
            # Try parsing "December 25, 2024"
            event_date_obj = gala_dt.datetime.strptime(request.selected_date, "%B %d, %Y").date()
        except:
            try:
                # Try parsing "MM/DD/YYYY"
                event_date_obj = gala_dt.datetime.strptime(request.selected_date, "%m/%d/%Y").date()
            except:
                print(f"DEBUG: Could not parse date '{request.selected_date}', using today.")

        assert_event_date_available_for_new_booking(db, event_date_obj)

        new_booking = models.Booking(
            booking_reference=booking_ref,
            customer_id=user_id,
            package_id=package_id,
            event_date=event_date_obj,
            event_type=request.event_type or "Event",
            venue_proposed=request.venue_proposed or "To be determined",
            guest_count=request.guest_count,
            total_price=request.total_price,
            status="Pending",
            notes=request.notes,
            event_theme=request.event_theme,
            color_palette=request.color_palette,
            event_location=request.event_location,
            specific_venue_address=request.specific_venue_address,
            special_requests=request.special_requests
        )
        
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        
        # 1.5 Create a corresponding record in pending_approvals table
        # This ensures the admin dashboard "Pending Approvals" metric is updated
        user = db.query(models.User).filter(models.User.id == user_id).first()
        customer_name = f"{user.first_name} {user.last_name}" if user else "Customer"
        
        new_approval = models.PendingApproval(
            approval_type="New Booking",
            related_booking_id=new_booking.id,
            customer_name=customer_name,
            description=f"New reservation for {request.package_title} on {request.selected_date}",
            status="Pending"
        )
        db.add(new_approval)
        db.commit()
        
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        print(f"DATABASE BOOKING ERROR: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Could not create your reservation. Please try again or pick another date.",
        )

    # 2. Proceed with PayMongo session creation
    secret_key = os.getenv("PAYMONGO_SECRET_KEY")
    if not secret_key:
        raise HTTPException(status_code=500, detail="PayMongo Secret Key not configured")

    # PayMongo uses Basic Auth with Secret Key as username, no password
    auth_str = f"{secret_key}:"
    encoded_auth = base64.b64encode(auth_str.encode()).decode()
    
    url = "https://api.paymongo.com/v1/checkout_sessions"
    
    # Payload for Checkout Session
    # Note: PayMongo amounts are in cents
    payload = {
        "data": {
            "attributes": {
                "send_email_receipt": True,
                "show_description": True,
                "show_line_items": True,
                "line_items": [
                    {
                        "currency": "PHP",
                        "amount": int(request.total_price * 100),
                        "description": f"Event Reservation: {request.package_title}",
                        "name": request.package_title,
                        "quantity": 1
                    }
                ],
                "payment_method_types": ["card", "gcash", "paymaya"],
                "description": f"Gala Crafters - {request.package_title} Booking for {request.selected_date}",
                "success_url": "http://localhost:5173/settings?tab=transactions&payment_success=true",
                "cancel_url": "http://localhost:5173/services"
            }
        }
    }
    
    print(f"DEBUG: Creating PayMongo session. Success URL: {payload['data']['attributes']['success_url']}")
    
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Basic {encoded_auth}"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        res_data = response.json()
        
        if response.status_code != 200:
            error_detail = res_data.get("errors", [{"detail": "PayMongo API error"}])[0].get("detail")
            print(f"PAYMONGO ERROR: {res_data}")
            raise HTTPException(status_code=response.status_code, detail=error_detail)
            
        checkout_url = res_data["data"]["attributes"]["checkout_url"]
        return {"checkout_url": checkout_url}
        
    except Exception as e:
        print(f"PAYMENT CREATION ERROR: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to create payment session: {str(e)}")

# ============================================================================
# ERROR HANDLERS
# ============================================================================

from fastapi.responses import JSONResponse

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "status_code": exc.status_code,
            "detail": exc.detail
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
