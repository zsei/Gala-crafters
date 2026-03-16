"""
Main FastAPI application for Gala Crafters CRM
Entry point for the API server
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import models
from database import engine, SessionLocal
from auth_endpoints import (
    login, 
    admin_login,
    register,
    get_user_profile, 
    update_user_profile,
    get_user_by_id,
    list_all_users,
    get_admin_users,
    get_admin_profile,
    verify_token,
)

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
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Models for request validation
class LoginRequest(BaseModel):
    email: str
    password: str

class RegistrationRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    phone: str
    city: str
    barangay: str
    building_details: str = None
    zip: str = None

class ProfileUpdateRequest(BaseModel):
    first_name: str = None
    last_name: str = None
    phone: str = None
    city: str = None
    country: str = None
    postal_code: str = None

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
    - Password: hashed_password_123
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

@app.get("/api/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get specific user by ID"""
    return get_user_by_id(user_id, db)

@app.get("/api/users")
def list_users(db: Session = Depends(get_db)):
    """List all customer users"""
    return list_all_users(db)

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

# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return {
        "error": True,
        "status_code": exc.status_code,
        "detail": exc.detail
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
