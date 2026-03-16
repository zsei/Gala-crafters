# Gala Crafters CRM - Database Setup Guide

## Overview
This guide explains how to set up and populate your Gala Crafters CRM database.

## Files Included

1. **database_schema.sql** - Complete SQL schema with tables, sample data, and queries
2. **database_setup.py** - Python script to initialize the database
3. **database.py** - Database connection configuration (already updated)

---

## Setup Steps

### Step 1: Create Your PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE gala_crafters_db;

# Exit
\q
```

### Step 2: Configure Environment Variables

Create a `.env` file in your backend directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/gala_crafters_db
```

Update your `database.py` to use environment variables (already done).

### Step 3: Execute the SQL Schema

There are two ways to populate your database:

#### Option A: Using psql command line

```bash
psql -U postgres -d gala_crafters_db -f backend/database_schema.sql
```

#### Option B: Using Python Script

```bash
cd backend
python database_setup.py
```

---

## Database Tables

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **users** | Customer accounts | email, phone, DOB, address |
| **admin_users** | Admin staff | name, role, email, phone |
| **event_packages** | Event types/pricing | package_name, price, features |
| **services** | Additional services | service_name, price, category |
| **bookings** | Customer bookings | booking_ref, customer, date, status |
| **booking_services** | Booking + Services link | booking_id, service_id, quantity |
| **messages** | Contact form inquiries | name, email, subject, message |
| **admin_messages** | Chat conversations | sender, message, is_read |
| **pending_approvals** | Admin approval queue | approval_type, description, status |
| **promo_codes** | Discount codes | code, discount, expiry_date |
| **dashboard_metrics** | Historical metrics | revenue, bookings, users |

---

## Key Queries

### Get All Active Bookings
```sql
SELECT b.booking_reference, u.first_name, u.last_name, b.event_date, b.total_price, b.status
FROM bookings b
INNER JOIN users u ON b.customer_id = u.id
WHERE b.status IN ('Confirmed', 'Processing')
ORDER BY b.event_date ASC;
```

### Dashboard Metrics
```sql
SELECT 
    (SELECT COUNT(*) FROM bookings WHERE status IN ('Confirmed', 'Processing')) AS active_bookings,
    (SELECT COUNT(*) FROM pending_approvals WHERE status = 'Pending') AS pending_approvals,
    (SELECT COUNT(*) FROM users WHERE user_role = 'Customer') AS total_customers,
    (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status IN ('Confirmed', 'Processing')) AS total_revenue;
```

### Get Pending Approvals
```sql
SELECT id, approval_type, customer_name, description, status, created_at
FROM pending_approvals
WHERE status = 'Pending'
ORDER BY created_at DESC;
```

### Get Unread Messages
```sql
SELECT id, name, email, message_subject, message_body, created_at
FROM messages
WHERE status = 'Unread'
ORDER BY created_at DESC;
```

### Monthly Revenue Report
```sql
SELECT 
    DATE_TRUNC('month', b.event_date) AS month,
    SUM(b.total_price) AS total_revenue,
    COUNT(b.id) AS total_bookings
FROM bookings b
WHERE b.status IN ('Confirmed', 'Processing', 'Completed')
GROUP BY DATE_TRUNC('month', b.event_date)
ORDER BY month DESC;
```

---

## Sample Data Included

### Users (5 customers)
- Natasha Khaleira - natasha.khaleira@email.com
- John Anderson - john.anderson@email.com
- Sarah Jenkins - sarah.jenkins@email.com
- Emma Thompson - emma.thompson@email.com
- Marcus Chen - marcus.chen@email.com

### Admin Users (4 staff)
- Alexander Sterling - Executive Admin
- Eleanor Rhodes - Compliance Officer
- Julian Thorne - Security Lead
- Beatrice Vance - Support Manager

### Event Packages (7 packages)
- Intimate Wedding Package - $5,000
- Utopian Wedding Package - $15,000
- Elite Wedding Package - $25,000
- Custom Wedding Package - $0 (customizable)
- Corporate Expo - $8,000
- Debut Celebration - $12,000
- Birthday Bash - $3,000

### Services (8 services)
- Premium Catering ($50/guest)
- Live Band ($2,000)
- Professional Photography ($1,500)
- Videography ($2,000)
- Floral Arrangements ($1,200)
- DJ Services ($800)
- Event Coordination ($500)
- Lighting Design ($1,000)

### Sample Bookings (5 bookings)
- BK-001: Natasha Khaleira - Wedding - Confirmed
- BK-002: John Anderson - Wedding - Pending
- BK-003: Sarah Jenkins - Corporate - Confirmed
- BK-004: Emma Thompson - Debut - Pending
- BK-005: Marcus Chen - Birthday - Processing

---

## Integration with FastAPI Backend

### Example: Fetch Active Bookings Endpoint

```python
from fastapi import FastAPI
from database import SessionLocal
from sqlalchemy import text

app = FastAPI()

@app.get("/api/bookings/active")
def get_active_bookings():
    db = SessionLocal()
    query = """
    SELECT 
        b.booking_reference,
        CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
        u.email,
        ep.package_name,
        b.event_date,
        b.total_price,
        b.status
    FROM bookings b
    INNER JOIN users u ON b.customer_id = u.id
    INNER JOIN event_packages ep ON b.package_id = ep.id
    WHERE b.status IN ('Confirmed', 'Processing')
    ORDER BY b.event_date ASC
    """
    result = db.execute(text(query)).fetchall()
    db.close()
    return result
```

### Example: Dashboard Metrics Endpoint

```python
@app.get("/api/admin/metrics")
def get_dashboard_metrics():
    db = SessionLocal()
    query = """
    SELECT 
        (SELECT COUNT(*) FROM bookings WHERE status IN ('Confirmed', 'Processing')) AS active_bookings,
        (SELECT COUNT(*) FROM pending_approvals WHERE status = 'Pending') AS pending_approvals,
        (SELECT COUNT(*) FROM users WHERE user_role = 'Customer') AS total_customers,
        (SELECT COALESCE(SUM(total_price), 0) FROM bookings) AS total_revenue
    """
    result = db.execute(text(query)).fetchone()
    db.close()
    
    return {
        "active_bookings": result[0],
        "pending_approvals": result[1],
        "total_customers": result[2],
        "total_revenue": float(result[3])
    }
```

---

## Common Operations

### Create New Booking
```sql
INSERT INTO bookings (booking_reference, customer_id, package_id, event_date, event_time, total_price, status)
VALUES ('BK-999', 1, 2, '2026-08-15', '19:00:00', 18500.00, 'Pending');
```

### Update Booking Status
```sql
UPDATE bookings
SET status = 'Confirmed', updated_at = CURRENT_TIMESTAMP
WHERE booking_reference = 'BK-001';
```

### Create New User
```sql
INSERT INTO users (first_name, last_name, email, phone, password, user_role)
VALUES ('Jane', 'Doe', 'jane.doe@email.com', '+1-555-123-4567', 'hashed_password', 'Customer');
```

### Mark Message as Read
```sql
UPDATE messages
SET status = 'Read', updated_at = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Create Pending Approval
```sql
INSERT INTO pending_approvals (approval_type, customer_name, description, status)
VALUES ('Package Modification', 'John Anderson', 'Request for decor change', 'Pending');
```

---

## Troubleshooting

### Issue: Connection refused
**Solution**: Ensure PostgreSQL is running
```bash
# On Windows
net start postgresql-x64-14

# On Mac
brew services start postgresql

# On Linux
sudo systemctl start postgresql
```

### Issue: Database doesn't exist
**Solution**: Create it with the command shown in Step 1

### Issue: Permission denied
**Solution**: Check your PostgreSQL user and password in the connection string

### Issue: Tables already exist
**Solution**: Drop the database and recreate it:
```bash
psql -U postgres -c "DROP DATABASE IF EXISTS gala_crafters_db;"
psql -U postgres -c "CREATE DATABASE gala_crafters_db;"
```

---

## Next Steps

1. Run `python database_setup.py` to initialize the database
2. Update your FastAPI `main.py` to include endpoints using these queries
3. Connect your React frontend to the new API endpoints
4. Test CRUD operations (Create, Read, Update, Delete)

---

## Additional Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- SQLAlchemy ORM: https://docs.sqlalchemy.org/
- FastAPI Database: https://fastapi.tiangolo.com/tutorial/sql-databases/

---

**Last Updated**: March 17, 2026
