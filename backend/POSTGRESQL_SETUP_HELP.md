# 🔧 PostgreSQL Connection Troubleshooting

## Error: Password authentication failed

This error means PostgreSQL needs a password to connect.

## ✅ Solution Steps

### Step 1: Verify PostgreSQL is Running

**Windows - Check PostgreSQL Service:**

1. Press `Win + R`
2. Type `services.msc`
3. Look for "postgresql-x64-18" or similar
4. If it's not running (red icon), right-click → Start

**Or use Task Manager:**
1. Press `Ctrl + Shift + Esc`
2. Look for any PostgreSQL process
3. If you see it, PostgreSQL is running

### Step 2: Find Your PostgreSQL Password

When you installed PostgreSQL on Windows, you set a superuser password for the "postgres" account.

**If you remember the password:**
1. Use that password in the connection string

**If you forgot the password:**
Follow the reset procedure below

### Step 3: Update database.py with Correct Credentials

Edit `backend/database.py`:

```python
# Option 1: If you know your PostgreSQL password
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD_HERE@localhost/gala_crafters_db"

# Option 2: Without password (if trust authentication is set up)
SQLALCHEMY_DATABASE_URL = "postgresql://postgres@localhost/gala_crafters_db"

# Option 3: Different host/port
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:YOUR_PASSWORD@localhost:5432/gala_crafters_db"
```

### Step 4: Reset PostgreSQL Password (If Forgotten)

#### Windows Password Reset:

1. **Open Command Prompt as Administrator** (Start → cmd → Right-click → Run as Administrator)

2. **Find PostgreSQL Installation Directory:**
   ```cmd
   cd "C:\Program Files\PostgreSQL\18\bin"
   ```

3. **Connect as superuser:**
   ```cmd
   psql -U postgres
   ```
   Ifyou get password prompt and don't know the password, try Step 5

4. **If you got psql prompt (postgres=#), reset password:**
   ```sql
   ALTER USER postgres WITH PASSWORD 'newpassword';
   \q
   ```

#### If psql connection fails:

1. **Edit PostgreSQL configuration file:**
   - Path: `C:\Program Files\PostgreSQL\18\data\pg_hba.conf`
   - Find the line that says:
     ```
     # IPv4 local connections:
     host    all             all             127.0.0.1/32            md5
     ```
   - Change `md5` to `trust`:
     ```
     host    all             all             127.0.0.1/32            trust
     ```

2. **Restart PostgreSQL Service:**
   - Open Command Prompt as Administrator
   - Run: `pg_ctl -D "C:\Program Files\PostgreSQL\18\data" restart`

3. **Now connect without password:**
   ```cmd
   cd "C:\Program Files\PostgreSQL\18\bin"
   psql -U postgres
   ```

4. **Set new password:**
   ```sql
   ALTER USER postgres WITH PASSWORD 'newpassword123';
   \q
   ```

5. **Edit pg_hba.conf back to md5 or md5:**
   ```
   host    all             all             127.0.0.1/32            md5
   ```

6. **Restart PostgreSQL again**

7. **Update database.py:**
   ```python
   SQLALCHEMY_DATABASE_URL = "postgresql://postgres:newpassword123@localhost/gala_crafters_db"
   ```

### Step 5: Verify Database and Tables Exist

After fixing the password:

### Step 6: Alternative - Use Different User

If you don't want to reset, create a new user:

```sql
-- Connect as postgres (with your password)
psql -U postgres

-- Create new user
CREATE USER gala_user WITH PASSWORD 'gala_password123';

-- Grant privileges
ALTER ROLE gala_user CREATEDB;
ALTER ROLE gala_user CREATEROLE;
GRANT ALL PRIVILEGES ON DATABASE gala_crafters_db TO gala_user;

-- Use in connection string
SQLALCHEMY_DATABASE_URL = "postgresql://gala_user:gala_password123@localhost/gala_crafters_db"
```

## 🚀 After Fixing Connection String

1. **Update backend/database.py** with correct password
2. **Restart backend:**
   ```bash
   cd backend
   python main.py
   ```

3. **If you see this output, it's working:**
   ```
   INFO:     Uvicorn running on http://127.0.0.1:8000
   INFO:     Application startup complete
   ```

4. **Test in browser:**
   - Open http://localhost:8000/api/health
   - Should see: `{"status": "healthy", "service": "Gala Crafters API"}`

## 🔑 Common PostgreSQL Passwords During Installation

If you don't remember what password you set, try these common ones:
- `postgres`
- `password`
- `admin`
- `123456`
- (blank/no password)

## 📋 Checklist

- [ ] PostgreSQL service  is running
- [ ] Database `gala_crafters_db` exists
- [ ] Database contains sample data (users, bookings, etc.)
- [ ] Correct password in `backend/database.py`
- [ ] Backend starts without "password authentication failed" error
- [ ] Health endpoint responds: http://localhost:8000/api/health
- [ ] Swagger UI loads: http://localhost:8000/docs

## 🆘 Still Not Working?

Try this quick diagnostic:

1. **Open Command Line**
2. **Navigate to PostgreSQL bin folder:**
   ```cmd
   cd "C:\Program Files\PostgreSQL\18\bin"
   ```

3. **Test connection:**
   ```cmd
   psql -U postgres -d gala_crafters_db -c "SELECT 1;"
   ```

4. **If it works**, copy the exact command format to database.py
5. **If it fails**, PostgreSQL isn't set up correctly - may need reinstall

## 📞 PostgreSQL Paths by Version/Installation

- PostgreSQL 18 (Default): `C:\Program Files\PostgreSQL\18`
- PostgreSQL 16: `C:\Program Files\PostgreSQL\16`
- PostgreSQL 14: `C:\Program Files\PostgreSQL\14`
- PostgreSQL 13: `C:\Program Files\PostgreSQL\13`
- PostgreSQL 12: `C:\Program Files\PostgreSQL\12`

## ✨ Once Fixed

Your `backend/database.py` should look like:

```python
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# IMPORTANT: Update with your actual PostgreSQL password
# Format: postgresql://username:password@host:port/database_name
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/gala_crafters_db"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

Then the backend will start successfully! 🎉
