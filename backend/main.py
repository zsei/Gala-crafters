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
    send_phone_verification_code,
    verify_phone_number,
    get_user_profile, 
    update_user_profile,
    get_user_by_id,
    list_all_users,
    get_admin_users,
    get_admin_profile,
    get_admin_profile,
    verify_token,
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

class PromoCodeRequest(BaseModel):
    code: str
    discount_percentage: float = None
    discount_amount: float = None
    expiry_date: str = None # YYYY-MM-DD
    max_uses: int = None
    status: str = "Active"

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
    base_price: float
    max_guests: int = None
    features: list[str] = []
    image_url: str = None
    status: str = "Active"

class PackageUpdateRequest(BaseModel):
    package_name: str = None
    event_type: str = None
    description: str = None
    base_price: float = None
    max_guests: int = None
    features: list[str] = None
    image_url: str = None
    status: str = None

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

@app.post("/api/auth/send-phone-verification")
def send_phone_verification_endpoint(request_data: dict, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """
    Send phone verification code via SMS
    Expects: {"phone_number": "+63 9XXXXXXXXX"}
    """
    phone_number = request_data.get("phone_number")
    return send_phone_verification_code(phone_number, credentials, db)

@app.post("/api/auth/verify-phone")
def verify_phone_endpoint(request_data: dict, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """
    Verify phone number with code
    Expects: {"phone_number": "+63 9XXXXXXXXX", "code": "123456"}
    """
    phone_number = request_data.get("phone_number")
    code = request_data.get("code")
    return verify_phone_number(phone_number, code, credentials, db)

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
        db.commit()
        db.refresh(new_booking)
        
        return {
            "success": True, 
            "message": "Booking request submitted successfully",
            "booking_reference": booking_ref,
            "id": new_booking.id
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create booking: {str(e)}")


# ============================================================================
# ADMIN ROUTES
# ============================================================================

@app.get("/api/admin/profile")
def get_admin_profile_endpoint(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current logged-in admin's profile"""
    return get_admin_profile(credentials, db)

@app.get("/api/admin/users")
def get_admin_users_endpoint(db: Session = Depends(get_db)):
    """Get all admin users"""
    return get_admin_users(db)

@app.get("/api/admin/bookings")
def get_admin_bookings_endpoint(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get all active bookings for admin"""
    # Update all expired bookings that should be marked as "On-going Event"
    update_booking_statuses_by_date(db)
    
    return database_setup.get_active_bookings()

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
        db.commit()
        
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
        db.commit()
        
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

@app.get("/api/admin/packages")
def get_admin_packages_endpoint(credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Get all available packages for admin"""
    return database_setup.get_available_packages()

@app.post("/api/admin/packages")
def create_package(package: PackageCreateRequest, credentials = Depends(verify_token), db: Session = Depends(get_db)):
    """Create a new event package"""
    new_package = models.EventPackage(
        package_name=package.package_name,
        event_type=package.event_type,
        description=package.description,
        base_price=package.base_price,
        max_guests=package.max_guests,
        features=package.features,
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
    """Get recent unread messages for admin"""
    return database_setup.get_recent_messages()

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
    
    # We want unique conversations that start with 'user_'
    conversations = db.query(
        models.AdminMessage.conversation_id,
        models.AdminMessage.sender_name,
        models.AdminMessage.sender_email,
        func.max(models.AdminMessage.message_date).label("last_message_date")
    ).filter(models.AdminMessage.conversation_id.like("user_%"))\
     .group_by(models.AdminMessage.conversation_id, models.AdminMessage.sender_name, models.AdminMessage.sender_email)\
     .order_by(text("last_message_date DESC")).all()
    
    res = []
    seen = set()
    for conv_id, name, email, last_date in conversations:
        if conv_id not in seen:
            last_msg = db.query(models.AdminMessage).filter(models.AdminMessage.conversation_id == conv_id).order_by(models.AdminMessage.message_date.desc()).first()
            
            res.append({
                "id": conv_id,
                "name": name,
                "email": email,
                "last_message": last_msg.message_body if last_msg else "",
                "last_active": last_date.isoformat() if last_date else None,
                "status": "Online"
            })
            seen.add(conv_id)
            
    return res

@app.get("/api/admin/conversations/{conversation_id}")
def get_conversation_thread(conversation_id: str, db: Session = Depends(get_db)):
    """Get full thread for a user conversation along with user context and bookings"""
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
        status=request.status
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
        # Join Review through Booking to filter by package_id
        reviews = db.query(models.Review).join(
            models.Booking, models.Review.booking_id == models.Booking.id
        ).filter(
            models.Booking.package_id == package_id,
            models.Review.status == "Visible"
        ).all()
        
        if not reviews:
            return []
        
        return [
            {
                "id": r.id,
                "rating": r.rating,
                "comment": r.comment,
                "created_at": r.created_at,
                "customer_name": r.customer.first_name if r.customer else "Customer"
            }
            for r in reviews
        ]
    except Exception as e:
        print(f"Error fetching package reviews: {e}")
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
    # Save all messages to the Message table (Inquiry tab)
    new_message = models.Message(
        name=request.name or "Guest User",
        email=request.email or "guest@galacrafters.com",
        message_subject=request.subject or "Message",
        message_body=request.message_body,
        status="Unread",
        created_at=gala_dt.datetime.utcnow()
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    # Determine message type based on whether user_id was provided
    message_type = "chat" if request.user_id else "inquiry"
    return {"success": True, "message": "Message submitted successfully", "message_id": new_message.id, "type": message_type}

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
        
    except Exception as e:
        db.rollback()
        print(f"DATABASE BOOKING ERROR: {str(e)}")
        # Continue with payment even if DB fails, though ideally both should work

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
