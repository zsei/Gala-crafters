# 🚀 Backend Setup & Execution Guide

## 📋 Prerequisites

Ensure you have installed:
- Python 3.8+
- PostgreSQL 18
- pip (Python package manager)

## 🔧 Installation Steps

### 1. Install Python Dependencies

Navigate to the backend folder and install all required packages:

```bash
cd backend
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-multipart pyjwt python-dotenv
```

### 2. Verify Database Connection

Make sure PostgreSQL is running:

```bash
# Windows (if installed as service)
# PostgreSQL service should be running automatically

# Or start from command line
pg_ctl -D "C:\Program Files\PostgreSQL\18\data" start
```

### 3. Verify Database Setup

Check that the database was created and populated:

```bash
psql -U postgres -d gala_crafters_db

# In psql, run:
\dt
# Should show 11 tables: users, admin_users, event_packages, services, 
#                       bookings, booking_services, messages, admin_messages,
#                       pending_approvals, promo_codes, dashboard_metrics

SELECT * FROM users LIMIT 5;
# Should show 5 customer records
```

**If tables don't exist**, run the setup script:

```bash
psql -U postgres -d gala_crafters_db -f setup_database_clean.sql
```

## 📁 File Structure

```
backend/
├── main.py                    # Main FastAPI application (ENTRY POINT)
├── auth_endpoints.py          # Authentication endpoints
├── database.py                # Database connection & configuration
├── models.py                  # SQLAlchemy ORM models
├── database.py                # Database initialization
├── setup_database_clean.sql   # SQL schema & sample data
└── LOGIN_API_TESTING.md       # API testing guide
```

## ✅ File Verification

Ensure all these files exist in the backend folder:

- [ ] `main.py` - FastAPI entry point
- [ ] `auth_endpoints.py` - Authentication logic
- [ ] `database.py` - Database connection
- [ ] `models.py` - ORM models
- [ ] `setup_database_clean.sql` - Database schema
- [ ] `LOGIN_API_TESTING.md` - Testing guide

## 🚀 Starting the Backend Server

### Method 1: Direct Python Execution

```bash
cd backend
python main.py
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Method 2: Using Uvicorn Directly

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Options:
- `--reload`: Restart server on file changes (development only)
- `--host 0.0.0.0`: Accessible from other machines
- `--port 8000`: Default port (can be changed)

## 🌐 Access the API

Once the server is running:

### 1. **Swagger UI** (Interactive API Testing)
   - URL: [http://localhost:8000/docs](http://localhost:8000/docs)
   - Features: Try endpoints directly, see request/response schemas

### 2. **ReDoc** (API Documentation)
   - URL: [http://localhost:8000/redoc](http://localhost:8000/redoc)
   - Features: Read-only documentation view

### 3. **Health Check**
   - URL: [http://localhost:8000/api/health](http://localhost:8000/api/health)
   - Expected response: `{"status": "healthy", "service": "Gala Crafters API"}`

## 🧪 Quick Test

### Test 1: Login as Customer

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "natasha.khaleira@email.com",
    "password": "hashed_password_123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "first_name": "Natasha",
    "last_name": "Khaleira",
    "email": "natasha.khaleira@email.com",
    "role": "Customer",
    "status": "Active"
  }
}
```

### Test 2: Get User Profile

Copy the token from login response above, then:

```bash
curl -X GET "http://localhost:8000/api/users/profile" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test 3: Admin Login

```bash
curl -X POST "http://localhost:8000/api/auth/admin-login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "a.sterling@gala.com",
    "password": "hashed_admin_123"
  }'
```

## 📊 Available Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/login` | Customer login | ❌ |
| POST | `/api/auth/admin-login` | Admin login | ❌ |
| GET | `/api/users/profile` | Get current user | ✅ |
| PUT | `/api/users/profile` | Update user profile | ✅ |
| GET | `/api/users/{user_id}` | Get specific user | ❌ |
| GET | `/api/users` | List all customers | ❌ |
| GET | `/api/admin/profile` | Get admin profile | ✅ |
| GET | `/api/admin/users` | List all admins | ❌ |
| GET | `/api/health` | Health check | ❌ |
| GET | `/` | Root info | ❌ |

## 🔐 Test Credentials

### Customers
```
natasha.khaleira@email.com / hashed_password_123
john.anderson@email.com / hashed_password_456
sarah.jenkins@email.com / hashed_password_789
emma.thompson@email.com / hashed_password_012
marcus.chen@email.com / hashed_password_345
```

### Admins
```
a.sterling@gala.com / hashed_admin_123
e.rhodes@gala.com / hashed_admin_456
j.thorne@gala.com / hashed_admin_789
b.vance@gala.com / hashed_admin_012
```

## ⚙️ Configuration

### Database Connection (database.py)
```python
DATABASE_URL = "postgresql://postgres@localhost/gala_crafters_db"
```

### JWT Settings (auth_endpoints.py)
```python
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24
```

**⚠️ IMPORTANT**: Change `SECRET_KEY` before deploying to production!

## 🐛 Troubleshooting

### Error: "Connection refused"
- Ensure PostgreSQL is running
- Check database URL in `database.py`
- Run: `psql -U postgres` to test connection

### Error: "relation 'users' does not exist"
- Database tables not created
- Solution: `psql -U postgres -d gala_crafters_db -f setup_database_clean.sql`

### Error: "ModuleNotFoundError: No module named 'fastapi'"
- Dependencies not installed
- Solution: `pip install -r requirements.txt` (or install packages manually)

### Error: "Port 8000 already in use"
- Another process using port 8000
- Solution: Kill the process or use different port: `uvicorn main:app --port 8001`

### Error: "Invalid credentials" on login
- Check email/password match test credentials
- Verify database has sample data: `SELECT * FROM users;`

## 🔗 Integration with Frontend

### Update React Login Component

In `gala-crafters/src/components/LoginPage.tsx`:

```typescript
const handleLogin = async (formData: any) => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    // Store token
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    setError('Invalid credentials');
  }
};
```

### Add Authorization Header to API Calls

```typescript
const token = localStorage.getItem('token');
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

fetch('http://localhost:8000/api/users/profile', {
  headers
});
```

## 📝 Complete Testing Workflow

1. **Start Backend**
   ```bash
   cd backend
   python main.py
   ```

2. **Test in Browser**
   - Open: http://localhost:8000/docs

3. **Test Login** (in Swagger UI)
   - Click on `/api/auth/login` POST endpoint
   - Click "Try it out"
   - Enter test credentials:
     ```json
     {
       "email": "natasha.khaleira@email.com",
       "password": "hashed_password_123"
     }
     ```
   - Copy the token from response

4. **Test Protected Endpoint**
   - Click on `/api/users/profile` GET endpoint
   - Click "Authorize" button (top right)
   - Paste: `Bearer YOUR_TOKEN_HERE`
   - Click "Try it out"

## 🚀 Production Deployment

Before deploying:

- [ ] Update `SECRET_KEY` to a random string
- [ ] Enable proper password hashing (bcrypt)
- [ ] Update `DATABASE_URL` for production database
- [ ] Add environment variables (use `.env` file)
- [ ] Enable HTTPS/SSL
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Remove debug mode
- [ ] Set up proper logging

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Guide](https://tools.ietf.org/html/rfc7519)

---

**Ready to test? Start the backend server now! 🎉**
