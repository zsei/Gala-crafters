# 🚀 Gala Crafters - Quick Reference Card

## ⚡ Quick Start (30 seconds)

```bash
# Terminal 1: Start Backend
cd backend
python main.py
# Now available at: http://localhost:8000

# Terminal 2: Start Frontend
cd gala-crafters
npm run dev
# Now available at: http://localhost:5173
```

## 🔐 Test Credentials (Copy & Paste)

### Customer
```
Email: natasha.khaleira@email.com
Password: hashed_password_123
```

### Admin
```
Email: a.sterling@gala.com
Password: hashed_admin_123
```

## 🌐 Important URLs

| What | URL | Purpose |
|----|-----|---------|
| API Docs | http://localhost:8000/docs | Test API endpoints |
| Health Check | http://localhost:8000/api/health | Verify backend is running |
| Frontend | http://localhost:5173 | React app (dev mode) |
| Database | `postgresql://postgres@localhost/gala_crafters_db` | PostgreSQL connection |

## 📋 Main Files

| File | Purpose |
|------|---------|
| `backend/main.py` | FastAPI app entry point |
| `backend/auth_endpoints.py` | Login & auth functions |
| `backend/models.py` | Database models (ORM) |
| `backend/database.py` | Database connection |
| `gala-crafters/src/main.tsx` | React entry point |

## 🔗 Key API Endpoints

```bash
# Login (POST)
POST /api/auth/login
Body: { "email": "...", "password": "..." }

# Get Profile (GET) - Requires token
GET /api/users/profile
Header: Authorization: Bearer <token>

# Admin Login (POST)
POST /api/auth/admin-login
Body: { "email": "...", "password": "..." }
```

## 🔧 Common Commands

```bash
# Start backend
python backend/main.py

# Start frontend
cd gala-crafters && npm run dev

# Check database
psql -U postgres -d gala_crafters_db

# List database tables
psql -U postgres -d gala_crafters_db -c "\dt"

# View users
psql -U postgres -d gala_crafters_db -c "SELECT * FROM users;"

# Reset database
psql -U postgres -d gala_crafters_db -f backend/setup_database_clean.sql
```

## 📁 File Structure at a Glance

```
crm gala crafters/
├── backend/
│   ├── main.py                 ← Start backend
│   ├── auth_endpoints.py
│   ├── models.py
│   ├── database.py
│   └── setup_database_clean.sql
├── gala-crafters/
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── README_SETUP.md             ← Full documentation
├── REACT_INTEGRATION.md        ← Frontend integration
└── DATABASE_SETUP_GUIDE.md
```

## ✅ Checklist

### Setup
- [ ] PostgreSQL running
- [ ] Backend dependencies installed: `pip install fastapi uvicorn sqlalchemy psycopg2-binary pyjwt python-multipart`
- [ ] Frontend dependencies installed: `npm install` (in gala-crafters)
- [ ] Database initialized with sample data

### Testing
- [ ] Backend running on http://localhost:8000
- [ ] Swagger UI accessible at http://localhost:8000/docs
- [ ] Can login with test credentials
- [ ] Frontend running on http://localhost:5173

### Development
- [ ] API service layer created in React
- [ ] Login page connected to backend
- [ ] Token stored in localStorage
- [ ] Protected routes configured

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8000 in use | Kill process: `lsof -ti:8000 \| xargs kill` or use `--port 8001` |
| ModuleNotFoundError | Install: `pip install -r requirements.txt` |
| Database error | Reset: `psql -U postgres -d gala_crafters_db -f backend/setup_database_clean.sql` |
| CORS error | Check backend CORS config in `main.py` includes `http://localhost:5173` |
| Login fails | Check credentials in test list above |
| API not responding | Ensure backend is running: `http://localhost:8000/api/health` |

## 🎯 Today's Tasks

```
1. ✅ Backend API running
2. ✅ Test credentials available
3. ⏳ Connect React login form to API
4. ⏳ Create user dashboard
5. ⏳ Test end-to-end flow
```

## 🔐 Token Management

```typescript
// Get token from login response
const token = response.data.token;

// Store in localStorage
localStorage.setItem('token', token);

// Use in requests
headers: {
  'Authorization': `Bearer ${token}`
}

// Check if logged in
const isLoggedIn = !!localStorage.getItem('token');
```

## 📊 Database Tables (11 total)

```sql
users              - Customer profiles
admin_users        - Admin staff
event_packages     - Service packages
services           - Individual services
bookings           - Event bookings
booking_services   - Service items in bookings
messages           - Customer inquiries
admin_messages     - Admin responses
pending_approvals  - Approval queue
promo_codes        - Discount codes
dashboard_metrics  - Analytics data
```

## 🚀 Deployment Reminders

**BEFORE DEPLOYING TO PRODUCTION:**
- [ ] Change `SECRET_KEY` in `auth_endpoints.py`
- [ ] Enable password hashing (use `bcrypt`)
- [ ] Enable HTTPS/SSL
- [ ] Update database URL to production database
- [ ] Review CORS origins
- [ ] Add rate limiting
- [ ] Test all endpoints
- [ ] Set environment variables

## 📞 Documentation Links

1. **Full Setup**: [README_SETUP.md](README_SETUP.md)
2. **Backend**: [backend/BACKEND_SETUP.md](backend/BACKEND_SETUP.md)
3. **API Testing**: [backend/LOGIN_API_TESTING.md](backend/LOGIN_API_TESTING.md)
4. **Frontend Integration**: [REACT_INTEGRATION.md](REACT_INTEGRATION.md)
5. **Database**: [backend/DATABASE_SETUP_GUIDE.md](backend/DATABASE_SETUP_GUIDE.md)

## 💡 Key Passwords/Secrets

| Item | Current Value | Production |
|------|---------------|------------|
| JWT Secret | `your-secret-key-change-in-production` | ⚠️ CHANGE THIS |
| Database | `postgres@localhost` | Change as needed |
| DB Name | `gala_crafters_db` | Keep or change |
| Token Expiry | 24 hours | Configurable |

## 🎓 Learning Paths

**Just starting?**
1. Read: [README_SETUP.md](README_SETUP.md)
2. Run: Backend server and test in Swagger UI
3. Read: [REACT_INTEGRATION.md](REACT_INTEGRATION.md)
4. Build: React auth service

**Already familiar?**
1. Check: [API Endpoints](#key-api-endpoints)
2. Customize: [backend/models.py](backend/models.py)
3. Extend: Create new endpoints
4. Test: Use Swagger UI at `/docs`

## 🎉 You're Ready!

Everything is set up and ready to use:

1. **Backend**: FastAPI with authentication ✅
2. **Database**: PostgreSQL with sample data ✅
3. **API Documentation**: Swagger UI at http://localhost:8000/docs ✅
4. **Integration Guides**: Complete frontend integration steps ✅

**Next**: Follow [REACT_INTEGRATION.md](REACT_INTEGRATION.md) to connect React!

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Ready for Development
