# 🔐 Login API Testing Guide

## Setup

### 1. Install Required Dependencies
```bash
pip install fastapi uvicorn python-multipart pyjwt sqlalchemy psycopg2-binary python-dotenv
```

### 2. Run the API Server
```bash
cd backend
python auth_endpoints.py
```

The server will start at `http://localhost:8000`

---

## 📖 API Documentation

### Interactive Docs
Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🧪 Test Credentials

### Customer Users
```json
{
  "email": "natasha.khaleira@email.com",
  "password": "hashed_password_123"
}
```

Other customers:
- john.anderson@email.com / hashed_password_456
- sarah.jenkins@email.com / hashed_password_789
- emma.thompson@email.com / hashed_password_012
- marcus.chen@email.com / hashed_password_345

### Admin Users
```json
{
  "email": "a.sterling@gala.com",
  "password": "hashed_admin_123"
}
```

Other admins:
- e.rhodes@gala.com / hashed_admin_456
- j.thorne@gala.com / hashed_admin_789
- b.vance@gala.com / hashed_admin_012

---

## 🔑 API Endpoints

### 1. Customer Login
**POST** `/api/auth/login`

**Request:**
```json
{
  "email": "natasha.khaleira@email.com",
  "password": "hashed_password_123"
}
```

**Response:**
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

### 2. Admin Login
**POST** `/api/auth/admin-login`

**Request:**
```json
{
  "email": "a.sterling@gala.com",
  "password": "hashed_admin_123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "name": "Alexander Sterling",
    "email": "a.sterling@gala.com",
    "role": "Executive Admin",
    "status": "Active"
  }
}
```

### 3. Get User Profile
**GET** `/api/users/profile`

**Headers:**
```
Authorization: Bearer <token_from_login>
```

**Response:**
```json
{
  "id": 1,
  "first_name": "Natasha",
  "last_name": "Khaleira",
  "email": "natasha.khaleira@email.com",
  "phone": "(+62) 821 2554-5846",
  "country": "United Kingdom",
  "city": "Leeds",
  "postal_code": "ERT 1254",
  "status": "Active"
}
```

### 4. Get Admin Profile
**GET** `/api/admin/profile`

**Headers:**
```
Authorization: Bearer <token_from_login>
```

### 5. List All Users
**GET** `/api/users`

**Response:**
```json
{
  "total": 5,
  "users": [
    {
      "id": 1,
      "name": "Natasha Khaleira",
      "email": "natasha.khaleira@email.com",
      "status": "Active",
      "created_at": "2026-03-17T03:03:58.895953"
    }
  ]
}
```

### 6. Get All Admin Users
**GET** `/api/admin/users`

### 7. Health Check
**GET** `/api/health`

---

## 🧪 Test with cURL

### Login as Customer
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"natasha.khaleira@email.com","password":"hashed_password_123"}'
```

### Login as Admin
```bash
curl -X POST "http://localhost:8000/api/auth/admin-login" \
  -H "Content-Type: application/json" \
  -d '{"email":"a.sterling@gala.com","password":"hashed_admin_123"}'
```

### Get Profile (with token)
```bash
curl -X GET "http://localhost:8000/api/users/profile" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🧪 Test with Postman

1. **Create Login Request**
   - Method: POST
   - URL: http://localhost:8000/api/auth/login
   - Body (JSON):
   ```json
   {
     "email": "natasha.khaleira@email.com",
     "password": "hashed_password_123"
   }
   ```

2. **Copy the Token** from response

3. **Create Profile Request**
   - Method: GET
   - URL: http://localhost:8000/api/users/profile
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer <your_token>`

---

## 🧪 Test with Python

```python
import requests

# Login
response = requests.post(
    "http://localhost:8000/api/auth/login",
    json={
        "email": "natasha.khaleira@email.com",
        "password": "hashed_password_123"
    }
)

login_data = response.json()
token = login_data["token"]

print("Login successful!")
print(f"Token: {token}")
print(f"User: {login_data['user']}")

# Get Profile
headers = {"Authorization": f"Bearer {token}"}
profile_response = requests.get(
    "http://localhost:8000/api/users/profile",
    headers=headers
)

print("\nProfile:")
print(profile_response.json())
```

---

## 🧪 Test with JavaScript/React

```javascript
// Login
const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'natasha.khaleira@email.com',
    password: 'hashed_password_123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.token;

// Get Profile
const profileResponse = await fetch('http://localhost:8000/api/users/profile', {
  headers: { Authorization: `Bearer ${token}` }
});

const profile = await profileResponse.json();
console.log(profile);
```

---

## ⚠️ Important Notes

1. **Password Security**: The current setup uses plain text password comparison. In production, use:
   - bcrypt for hashing
   - argon2 or similar strong algorithms
   - Never store plain passwords

2. **Secret Key**: Change `SECRET_KEY` in `auth_endpoints.py` in production!

3. **CORS**: Add CORS middleware if testing from different domain:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

4. **Error Handling**: 
   - 401: Invalid credentials
   - 404: User not found
   - 422: Invalid request format

---

## 🚀 Next Steps

1. ✅ Start API server with `python auth_endpoints.py`
2. ✅ Test login endpoints in Swagger UI or Postman
3. ✅ Get JWT token from login response
4. ✅ Use token to access protected endpoints
5. Connect React frontend to these endpoints

---

## 📚 Integration with React

Update your LoginPage.tsx:

```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  } catch (error) {
    setError('Login failed');
  }
};
```

---

**Happy Testing! 🎉**
