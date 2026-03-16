# 🚀 Gala Crafters - Database Quick Start Checklist

## Prerequisites
- [ ] PostgreSQL installed and running
- [ ] Python 3.8+ with pip
- [ ] Backend folder with FastAPI setup

## Installation (5 Steps)

### Step 1: Update environment variables
```bash
# Create or update .env in backend folder
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/gala_crafters_db
```
- [ ] Database URL configured

### Step 2: Run database setup
```bash
cd backend
python database_setup.py
```
- [ ] Database created successfully
- [ ] Tables initialized
- [ ] Sample data inserted

### Step 3: Verify database
```bash
psql -U postgres -d gala_crafters_db -c "SELECT COUNT(*) FROM users;"
```
- [ ] At least 5 users returned (sample data)

### Step 4: Check tables
```bash
psql -U postgres -d gala_crafters_db -c "\dt"
```
- [ ] All 11 tables visible
- [ ] Tables: users, admin_users, event_packages, services, bookings, booking_services, messages, admin_messages, pending_approvals, promo_codes, dashboard_metrics

### Step 5: Update your models.py
```bash
# Backup current models
mv backend/models.py backend/models_old.py

# Use complete models
cp backend/models_complete.py backend/models.py
```
- [ ] Models updated with all tables

---

## Testing Queries

Run these to verify everything works:

### Test 1: Get Active Bookings
```sql
SELECT * FROM bookings WHERE status IN ('Confirmed', 'Processing');
```
Expected: 3 results (BK-001, BK-003, BK-005)
- [ ] Returns bookings

### Test 2: Get Dashboard Metrics
```sql
SELECT 
    COUNT(*) as total_bookings,
    SUM(total_price)::float as total_revenue
FROM bookings WHERE status != 'Cancelled';
```
Expected: 5 bookings total, ~$61,500 revenue
- [ ] Metrics calculated correctly

### Test 3: Get Admin Users
```sql
SELECT name, role, status FROM admin_users;
```
Expected: 4 admin users
- [ ] Admins visible

### Test 4: Get Event Packages
```sql
SELECT package_name, base_price FROM event_packages WHERE status = 'Active';
```
Expected: 7 packages
- [ ] Packages available

### Test 5: Get Messages
```sql
SELECT * FROM messages WHERE status = 'Unread';
```
Expected: 2 unread messages
- [ ] Messages retrieved

---

## FastAPI Integration

### Step 1: Create API endpoints
```python
# Add to main.py
from models import User, Booking, EventPackage
from database import SessionLocal

@app.get("/api/dashboard")
def get_dashboard():
    db = SessionLocal()
    metrics = db.query(Booking).filter(
        Booking.status.in_(["Confirmed", "Processing"])
    ).all()
    return {
        "active_bookings": len(metrics),
        "total_revenue": sum(b.total_price for b in metrics)
    }
```
- [ ] Endpoints created

### Step 2: Test endpoints
```bash
# Start FastAPI
uvicorn main:app --reload

# Test in browser or Postman
GET http://localhost:8000/api/dashboard
```
- [ ] API responds with data

### Step 3: Connect to frontend
```javascript
// Update React components
const fetchDashboard = async () => {
  const response = await fetch('http://localhost:8000/api/dashboard');
  const data = await response.json();
  setMetrics(data);
};
```
- [ ] Frontend receives data

---

## Files Summary

| File | Purpose | Status |
|------|---------|--------|
| database_schema.sql | Complete database schema | ✅ Ready |
| database_setup.py | Python initialization script | ✅ Ready |
| models_complete.py | SQLAlchemy ORM models | ✅ Ready |
| DATABASE_SETUP_GUIDE.md | Full setup documentation | ✅ Ready |
| QUERY_REFERENCE.md | Query reference guide | ✅ Ready |

---

## Troubleshooting Guide

### Issue: "psql: command not found"
```bash
# Add PostgreSQL to PATH (Windows)
# Or install PostgreSQL CLI tools
```
- [ ] PostgreSQL CLI working

### Issue: "FATAL: database does not exist"
```bash
# Create database first
psql -U postgres -c "CREATE DATABASE gala_crafters_db;"
```
- [ ] Database created

### Issue: "Connection refused"
```bash
# Ensure PostgreSQL is running
sudo systemctl start postgresql  # Linux
brew services start postgresql  # Mac
# Windows: Start Services > PostgreSQL
```
- [ ] PostgreSQL running

### Issue: "Permission denied"
```bash
# Use correct credentials in .env
# Default: postgres with password
psql -U postgres  # Test connection
```
- [ ] Credentials verified

---

## Quick Commands Reference

```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Connect to database
psql -U postgres -d gala_crafters_db

# Run all queries
psql -U postgres -d gala_crafters_db -f database_schema.sql

# Python setup
python database_setup.py

# FastAPI server
uvicorn main:app --reload

# Reset database
psql -U postgres -c "DROP DATABASE gala_crafters_db;" && \
psql -U postgres -c "CREATE DATABASE gala_crafters_db;"
```

---

## Data Ready Reference

### Users (5)
- natasha.khaleira@email.com
- john.anderson@email.com
- sarah.jenkins@email.com
- emma.thompson@email.com
- marcus.chen@email.com

### Packages (7)
- Intimate Wedding - $5,000
- Utopian Wedding - $15,000
- Elite Wedding - $25,000
- Custom Wedding - Flexible
- Corporate Expo - $8,000
- Debut Celebration - $12,000
- Birthday Bash - $3,000

### Bookings (5)
- BK-001 ✅ Confirmed
- BK-002 ⏳ Pending
- BK-003 ✅ Confirmed
- BK-004 ⏳ Pending
- BK-005 🔄 Processing

---

## Performance Tips

```sql
-- Add indexes for faster queries
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(event_date);
CREATE INDEX idx_users_email ON users(email);
```
- [ ] Indexes created for performance

---

## Backup & Restore

```bash
# Backup database
pg_dump -U postgres gala_crafters_db > backup.sql

# Restore database
psql -U postgres gala_crafters_db < backup.sql

# Backup sample data
pg_dump -U postgres --data-only gala_crafters_db > data_backup.sql
```
- [ ] Backup strategy in place

---

## Next Steps After Setup

1. [ ] ✅ Database schema installed
2. [ ] ✅ Sample data loaded
3. [ ] ⏭️ Create FastAPI endpoints
4. [ ] ⏭️ Add authentication (JWT)
5. [ ] ⏭️ Connect React frontend
6. [ ] ⏭️ Add error handling
7. [ ] ⏭️ Add logging
8. [ ] ⏭️ Deploy to production

---

## Support Resources

- PostgreSQL Docs: https://www.postgresql.org/docs/
- SQLAlchemy: https://docs.sqlalchemy.org/
- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/

---

**Your database is ready! Start building! 🎉**

Date Created: March 17, 2026
