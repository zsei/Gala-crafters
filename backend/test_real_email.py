"""
Test forgot-password with the REAL sender email (galacrafters0@gmail.com)
to confirm emails actually land in a real inbox.
"""
import requests
import json

BASE_URL = "http://localhost:8000"

# Use the sender's own Gmail — guaranteed to be a real inbox
TEST_EMAIL = "galacrafters0@gmail.com"

print(f"Testing forgot-password API with REAL email: {TEST_EMAIL}")
print("(This should deliver an email to the galacrafters0@gmail.com inbox)")
print()

# First, temporarily insert/update a user with this email for the test
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

# Check if this email already exists
cur.execute("SELECT id, email FROM users WHERE email = %s", (TEST_EMAIL,))
existing = cur.fetchone()

if not existing:
    print(f"Inserting test user with email: {TEST_EMAIL}")
    cur.execute("""
        INSERT INTO users (first_name, last_name, email, phone, password, city, barangay, user_role, status)
        VALUES ('Test', 'User', %s, '09000000000', 'testpassword123', 'Manila', 'Test', 'Customer', 'Active')
    """, (TEST_EMAIL,))
    conn.commit()
    print("Test user inserted.")
else:
    print(f"User already exists: id={existing[0]}, email={existing[1]}")

cur.close()
conn.close()

# Now hit the API
try:
    response = requests.post(
        f"{BASE_URL}/api/auth/forgot-password",
        json={"email": TEST_EMAIL},
        timeout=30
    )
    print(f"\nStatus Code : {response.status_code}")
    print(f"Response    : {json.dumps(response.json(), indent=2)}")
    print()
    print(">>> Check the galacrafters0@gmail.com inbox for the reset email!")
except Exception as e:
    print(f"[ERROR] {type(e).__name__}: {e}")
