"""
SQLAlchemy ORM Models for Gala Crafters CRM
"""

from database import Base
from sqlalchemy import Column, Integer, String, Date, DateTime, Float, Boolean, Text, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime


class User(Base):
    """Customer user model"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    middle_name = Column(String(100))
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=False)
    password = Column(String(255), nullable=False)
    date_of_birth = Column(Date)
    building_details = Column(String(255))
    country = Column(String(100))
    city = Column(String(100))
    barangay = Column(String(100))
    postal_code = Column(String(20))
    user_role = Column(String(50), default="Customer")
    status = Column(String(50), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bookings = relationship("Booking", back_populates="customer")
    reviews = relationship("Review", back_populates="customer")


class AdminUser(Base):
    """Admin staff model"""
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone = Column(String(20))
    role = Column(String(100), nullable=False)
    status = Column(String(50), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class EventPackage(Base):
    """Event package model"""
    __tablename__ = "event_packages"

    id = Column(Integer, primary_key=True, index=True)
    package_name = Column(String(150), nullable=False)
    event_type = Column(String(100), nullable=False)
    description = Column(Text)
    base_price = Column(Float, nullable=False)
    max_guests = Column(Integer)
    features = Column(ARRAY(String), default=[])
    status = Column(String(50), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bookings = relationship("Booking", back_populates="package")


class Service(Base):
    """Additional services model"""
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String(150), nullable=False)
    description = Column(Text)
    category = Column(String(100), nullable=False)
    base_price = Column(Float)
    status = Column(String(50), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    booking_services = relationship("BookingService", back_populates="service")


class Booking(Base):
    """Booking model"""
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_reference = Column(String(50), unique=True, nullable=False, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    package_id = Column(Integer, ForeignKey("event_packages.id"), nullable=False)
    event_date = Column(Date, nullable=False)
    event_time = Column(String(10))
    event_type = Column(String(100))
    venue_proposed = Column(String(255))
    guest_count = Column(Integer)
    total_price = Column(Float)
    status = Column(String(50), default="Pending")
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("User", back_populates="bookings")
    package = relationship("EventPackage", back_populates="bookings")
    booking_services = relationship("BookingService", back_populates="booking")
    reviews = relationship("Review", back_populates="booking")


class BookingService(Base):
    """Junction table for many-to-many relationship between Bookings and Services"""
    __tablename__ = "booking_services"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    quantity = Column(Integer, default=1)
    price = Column(Float)

    # Relationships
    booking = relationship("Booking", back_populates="booking_services")
    service = relationship("Service", back_populates="booking_services")


class Message(Base):
    """Contact form message model"""
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20))
    message_subject = Column(String(255))
    message_body = Column(Text, nullable=False)
    status = Column(String(50), default="Unread")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AdminMessage(Base):
    """Admin chat message model"""
    __tablename__ = "admin_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer)
    sender_name = Column(String(150))
    sender_email = Column(String(255))
    message_body = Column(Text, nullable=False)
    message_date = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    conversation_id = Column(String(100), index=True)


class PendingApproval(Base):
    """Pending approval request model"""
    __tablename__ = "pending_approvals"

    id = Column(Integer, primary_key=True, index=True)
    approval_type = Column(String(100), nullable=False)
    related_booking_id = Column(Integer, ForeignKey("bookings.id"))
    customer_name = Column(String(150))
    description = Column(Text)
    status = Column(String(50), default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class PromoCode(Base):
    """Promo code model"""
    __tablename__ = "promo_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    discount_percentage = Column(Float)
    discount_amount = Column(Float)
    expiry_date = Column(Date)
    max_uses = Column(Integer)
    current_uses = Column(Integer, default=0)
    status = Column(String(50), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)


class DashboardMetric(Base):
    """Dashboard metrics history model"""
    __tablename__ = "dashboard_metrics"

    id = Column(Integer, primary_key=True, index=True)
    metric_date = Column(Date, nullable=False)
    total_revenue = Column(Float)
    active_bookings = Column(Integer)
    pending_approvals = Column(Integer)
    registered_users = Column(Integer)
    recorded_at = Column(DateTime, default=datetime.utcnow)


class Review(Base):
    """Review model"""
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False) # 1-5 stars
    comment = Column(Text)
    status = Column(String(50), default="Visible")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    booking = relationship("Booking", back_populates="reviews")
    customer = relationship("User", back_populates="reviews")

