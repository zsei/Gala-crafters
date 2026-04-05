"""
Live end-to-end test of forgot-password API endpoint
"""
import requests
import json

BASE_URL = "http://localhost:8000"

# First, get a real user email from the DB
from dotenv import load_dotenv
load_dotenv()
import os, psycopg2

db_url = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/gala_crafters_db")
parts = db_url.replace("postgresql://", "").split("@")
user_pass = parts[0].split(":")
host_db = parts[1].split("/")

conn = psycopg2.connect(
    host=host_db[0], dbname=host_db[1],
    user=user_pass[0], password=user_pass[1] if len(user_pass) > 1 else "",
    connect_timeout=5
)
cur = conn.cursor()
cur.execute("SELECT email FROM users LIMIT 5")
users = [r[0] for r in cur.fetchall()]
cur.close()
conn.close()

print(f"Found users in DB: {users}")
print()

# Test with the first user
test_email = users[0] if users else None
if not test_email:
    print("No users in DB to test with!")
    exit(1)

print(f"Testing forgot-password with: {test_email}")
print()

try:
    response = requests.post(
        f"{BASE_URL}/api/auth/forgot-password",
        json={"email": test_email},
        timeout=30
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except requests.exceptions.ConnectionError:
    print("[ERROR] Cannot connect to backend at", BASE_URL)
    print("Make sure 'python main.py' is running")
except Exception as e:
    print(f"[ERROR] {type(e).__name__}: {e}")
