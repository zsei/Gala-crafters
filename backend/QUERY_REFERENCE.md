# Gala Crafters CRM - Database Complete Setup

## What You Now Have

Your database is fully configured with comprehensive queries and sample data for your CRM system. Here's everything included:

---

## 📁 Files Created

### 1. **database_schema.sql**
Complete SQL schema file containing:
- **11 Tables** with proper relationships and constraints
- **Sample Data** for all tables (5 users, 4 admin staff, 7 event packages, 8 services, 5 bookings)
- **20 Common Queries** for your most frequent operations
- **Reporting Queries** for analytics and insights

### 2. **database_setup.py**
Python script with functions to:
- Initialize database tables
- Execute raw SQL queries
- Retrieve active bookings
- Get dashboard metrics
- Fetch pending approvals
- Handle messages
- And much more...

### 3. **models_complete.py**
SQLAlchemy ORM models for:
- User management
- Admin users
- Event packages
- Services
- Bookings (with relationships)
- Messages
- Admin messages
- Pending approvals
- Promo codes
- Dashboard metrics

### 4. **DATABASE_SETUP_GUIDE.md**
Comprehensive guide with:
- Step-by-step setup instructions
- Table descriptions
- Sample data overview
- Integration examples
- Troubleshooting tips

---

## 🗄️ Database Structure

### Authentication & Users
```
users
├── id (PK)
├── email (UNIQUE)
├── phone
├── password
├── first_name, last_name
├── date_of_birth
├── address (country, city, postal_code)
└── user_role (Customer, Admin, etc.)

admin_users
├── id (PK)
├── email (UNIQUE)
├── role
├── phone
└── status
```

### Events & Packages
```
event_packages
├── id (PK)
├── package_name
├── event_type (Wedding, Corporate, Debut, Birthday)
├── base_price
├── max_guests
├── features (array)
└── status

services
├── id (PK)
├── service_name (Catering, Photography, DJ, etc.)
├── category
├── base_price
└── status
```

### Bookings
```
bookings
├── id (PK)
├── booking_reference (UNIQUE)
├── customer_id (FK → users)
├── package_id (FK → event_packages)
├── event_date
├── event_time
├── guest_count
├── total_price
├── status (Pending, Confirmed, Processing, Cancelled)
└── notes

booking_services (Many-to-Many)
├── id (PK)
├── booking_id (FK → bookings)
├── service_id (FK → services)
├── quantity
└── price
```

### Communication & Management
```
messages
├── id (PK)
├── name, email, phone
├── message_subject
├── message_body
├── status (Unread, Read)
└── created_at

admin_messages (Chat)
├── id (PK)
├── sender_name, sender_email
├── message_body
├── conversation_id
├── is_read
└── message_date

pending_approvals
├── id (PK)
├── approval_type
├── related_booking_id (FK)
├── customer_name
├── description
└── status (Pending, Approved, Rejected)
```

### Business Logic
```
promo_codes
├── code (UNIQUE)
├── discount_percentage
├── discount_amount
├── expiry_date
├── max_uses, current_uses
└── status

dashboard_metrics
├── metric_date
├── total_revenue
├── active_bookings
├── pending_approvals
└── registered_users
```

---

## 🔍 Available Queries

### Real-Time Dashboard
1. ✅ **Active Bookings** - All confirmed/processing bookings
2. ✅ **Dashboard Metrics** - Key KPIs (revenue, bookings, users)
3. ✅ **Pending Approvals** - Items awaiting review
4. ✅ **Recent Messages** - Unread contact form inquiries

### Booking Management
5. ✅ **Booking Details** - Full booking with all services linked
6. ✅ **Customer Booking History** - All bookings for a specific customer
7. ✅ **Booking Status Distribution** - How many in each status

### Analytics & Reporting
8. ✅ **Monthly Revenue Report** - Revenue trends
9. ✅ **Top Performing Packages** - Most profitable packages
10. ✅ **Customer Acquisition Trends** - New customers over time
11. ✅ **Most Used Services** - Popular add-ons
12. ✅ **Promo Code Effectiveness** - Discount code usage

### Admin Operations
13. ✅ **Admin Users List** - All active staff
14. ✅ **Admin Messages** - Chat conversations
15. ✅ **Update Booking Status** - Change booking state
16. ✅ **Mark Messages as Read** - Update message status
17. ✅ **Create New Approvals** - Add approval requests

---

## 📊 Sample Data Included

### 5 Test Customers
- Natasha Khaleira (Leeds, UK)
- John Anderson (New York, US)
- Sarah Jenkins (London, UK)
- Emma Thompson (Los Angeles, US)
- Marcus Chen (Singapore)

### 7 Event Packages
| Package | Type | Price | Guests |
|---------|------|-------|--------|
| Intimate | Wedding | $5,000 | 50 |
| Utopian | Wedding | $15,000 | 150 |
| Elite | Wedding | $25,000 | 250 |
| Custom | Wedding | Flexible | Flexible |
| Corporate Expo | Corporate | $8,000 | 300 |
| Debut Celebration | Debut | $12,000 | 200 |
| Birthday Bash | Birthday | $3,000 | 100 |

### 8 Services Available
- Premium Catering ($50/guest)
- Live Band ($2,000)
- Professional Photography ($1,500)
- Videography ($2,000)
- Floral Arrangements ($1,200)
- DJ Services ($800)
- Event Coordination ($500)
- Lighting Design ($1,000)

### 5 Sample Bookings
- BK-001: Wedding (Confirmed)
- BK-002: Wedding (Pending)
- BK-003: Corporate (Confirmed)
- BK-004: Debut (Pending)
- BK-005: Birthday (Processing)

---

## 🚀 Quick Start Guide

### 1. Initialize Database
```bash
cd backend
python database_setup.py
```

### 2. Verify Installation
```bash
psql -U postgres -d gala_crafters_db -c "SELECT COUNT(*) FROM users;"
```

### 3. Access Sample Data
```sql
-- View all customers
SELECT * FROM users WHERE user_role = 'Customer';

-- View all bookings
SELECT * FROM bookings;

-- View active packages
SELECT * FROM event_packages WHERE status = 'Active';
```

---

## 💻 FastAPI Integration Examples

### Example 1: Get Dashboard Metrics
```python
@app.get("/api/admin/dashboard")
def get_dashboard():
    db = SessionLocal()
    metrics = db.query(
        func.count(Booking.id).label("active_bookings"),
        func.sum(Booking.total_price).label("total_revenue"),
        func.count(User.id).label("total_customers")
    ).filter(Booking.status.in_(["Confirmed", "Processing"])).first()
    
    return {
        "active_bookings": metrics.active_bookings,
        "total_revenue": float(metrics.total_revenue or 0),
        "total_customers": metrics.total_customers
    }
```

### Example 2: Create New Booking
```python
@app.post("/api/bookings")
def create_booking(booking_data: dict):
    db = SessionLocal()
    
    new_booking = Booking(
        booking_reference=generate_reference(),
        customer_id=booking_data["customer_id"],
        package_id=booking_data["package_id"],
        event_date=booking_data["event_date"],
        guest_count=booking_data["guest_count"],
        total_price=booking_data["total_price"],
        status="Pending"
    )
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    return new_booking
```

### Example 3: Get Booking with Services
```python
@app.get("/api/bookings/{booking_id}")
def get_booking_details(booking_id: int):
    db = SessionLocal()
    
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    services = db.query(BookingService).filter(
        BookingService.booking_id == booking_id
    ).all()
    
    return {
        "booking": booking,
        "services": services,
        "total": booking.total_price
    }
```

---

## 📝 Common Operations

### Add New Customer
```python
new_user = User(
    first_name="Jane",
    last_name="Doe",
    email="jane@example.com",
    phone="+1-555-123-4567",
    password=hash_password("secure_password"),
    user_role="Customer"
)
db.add(new_user)
db.commit()
```

### Update Booking Status
```python
booking = db.query(Booking).filter(
    Booking.booking_reference == "BK-001"
).first()
booking.status = "Confirmed"
booking.updated_at = datetime.utcnow()
db.commit()
```

### Send Message to Admin
```python
new_message = AdminMessage(
    sender_name="John Doe",
    sender_email="john@example.com",
    message_body="I have a question about my booking",
    conversation_id="conv_123",
    is_read=False
)
db.add(new_message)
db.commit()
```

---

## ✅ What's Ready

- ✅ Complete database schema with 11 tables
- ✅ Foreign keys and relationships configured
- ✅ Sample data for testing (5 users, 5 bookings, 7 packages)
- ✅ 20+ pre-written SQL queries
- ✅ Python setup script
- ✅ SQLAlchemy ORM models
- ✅ Integration examples
- ✅ Comprehensive documentation

---

## 🔐 Next Steps to Complete

1. **Update Models** - Use `models_complete.py` instead of existing `models.py`
2. **Create API Endpoints** - Add FastAPI routes for CRUD operations
3. **Implement Authentication** - JWT tokens for login
4. **Connect Frontend** - Link React components to new endpoints
5. **Add Validation** - Input validation and error handling
6. **Deploy Database** - Move to production PostgreSQL instance

---

## 📞 Database Statistics

| Item | Count |
|------|-------|
| Tables | 11 |
| Sample Users | 5 |
| Sample Admin Users | 4 |
| Sample Bookings | 5 |
| Event Packages | 7 |
| Services | 8 |
| Pre-written Queries | 20+ |
| API Integration Examples | 3+ |

---

## 🆘 Troubleshooting

**Can't connect to database?**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1;"

# Update DB URL in database.py
# Format: postgresql://user:password@localhost:5432/gala_crafters_db
```

**Tables already exist?**
```sql
DROP DATABASE IF EXISTS gala_crafters_db;
CREATE DATABASE gala_crafters_db;
```

**Need to reset sample data?**
```sql
TRUNCATE TABLE bookings CASCADE;
TRUNCATE TABLE users CASCADE;
-- Re-run INSERT statements from database_schema.sql
```

---

## 📚 Documentation Files

1. 📄 **database_schema.sql** - Raw SQL setup
2. 🐍 **database_setup.py** - Python initialization
3. 🏛️ **models_complete.py** - SQLAlchemy models
4. 📖 **DATABASE_SETUP_GUIDE.md** - Full guide
5. 📋 **QUERY_REFERENCE.md** - This file

---

**Your database is ready to go! Start building amazing features! 🎉**
