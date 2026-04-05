"""
Minimal DB check - fast, no hanging
"""
from dotenv import load_dotenv
load_dotenv()

import os
import psycopg2

# Parse the connection string manually
db_url = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost/gala_crafters_db")
# postgresql://user:pass@host/dbname
parts = db_url.replace("postgresql://", "").split("@")
user_pass = parts[0].split(":")
host_db = parts[1].split("/")

user = user_pass[0]
password = user_pass[1] if len(user_pass) > 1 else ""
host = host_db[0]
dbname = host_db[1]

print(f"Connecting as user={user} host={host} db={dbname}")

try:
    conn = psycopg2.connect(
        host=host, dbname=dbname, user=user, password=password, connect_timeout=5
    )
    cur = conn.cursor()
    cur.execute("""
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'users' ORDER BY ordinal_position
    """)
    cols = [r[0] for r in cur.fetchall()]
    print("Users table columns:", cols)
    print()
    print("reset_token EXISTS:", "reset_token" in cols)
    print("reset_token_expires EXISTS:", "reset_token_expires" in cols)

    if "reset_token" not in cols:
        print()
        print(">>> FIXING: Adding missing columns...")
        cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255)")
        cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP")
        conn.commit()
        print(">>> Columns added successfully!")
    
    cur.close()
    conn.close()
    print()
    print("DB check complete.")
except Exception as e:
    import traceback
    print(f"ERROR: {e}")
    traceback.print_exc()
