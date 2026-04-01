"""
Check DB columns + simulate forgot-password flow to find the real error
"""
from dotenv import load_dotenv
load_dotenv()

import os, sys
from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:admin123@localhost/gala_crafters_db")
engine = create_engine(DATABASE_URL)

print("=== Checking DB columns on 'users' table ===")
try:
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'users'
            ORDER BY ordinal_position;
        """))
        rows = result.fetchall()
        for r in rows:
            print(f"  {r[0]:<30} {r[1]:<20} nullable={r[2]}")

        col_names = [r[0] for r in rows]
        print()
        if 'reset_token' in col_names:
            print("[OK] reset_token column EXISTS")
        else:
            print("[MISSING] reset_token column DOES NOT EXIST in DB!")

        if 'reset_token_expires' in col_names:
            print("[OK] reset_token_expires column EXISTS")
        else:
            print("[MISSING] reset_token_expires column DOES NOT EXIST in DB!")

except Exception as e:
    print(f"[DB ERROR] {type(e).__name__}: {e}")
    sys.exit(1)

print()
print("=== Simulating full forgot-password call ===")
try:
    from sqlalchemy.orm import sessionmaker
    Session = sessionmaker(bind=engine)
    db = Session()

    from models import User
    import uuid
    from datetime import datetime, timedelta
    from email_service import send_reset_email

    user = db.query(User).first()
    if not user:
        print("[ERROR] No users found in DB")
        sys.exit(1)

    print(f"Testing with user: {user.email}")

    token = str(uuid.uuid4())
    expiry = datetime.utcnow() + timedelta(hours=1)
    user.reset_token = token
    user.reset_token_expires = expiry
    db.commit()
    print(f"[OK] Token saved to DB: {token[:8]}...")

    reset_link = f"http://localhost:5173/reset-password/{token}"
    result = send_reset_email(user.email, reset_link)

    if result:
        print(f"[OK] Email sent successfully to {user.email}")
        print(f"     Reset link: {reset_link}")
    else:
        print(f"[FAILED] send_reset_email() returned False for {user.email}")

    db.close()
except Exception as e:
    import traceback
    print(f"[ERROR] {type(e).__name__}: {e}")
    traceback.print_exc()
