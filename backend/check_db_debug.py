
from database import SessionLocal
from sqlalchemy import text

def check_bookings():
    db = SessionLocal()
    try:
        # Check columns
        result = db.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'bookings'"))
        columns = [row[0] for row in result]
        print(f"Columns in bookings table: {columns}")
        
        # Check data
        result = db.execute(text("SELECT * FROM bookings LIMIT 1"))
        row = result.fetchone()
        if row:
            print(f"First row in bookings: {dict(zip(result.keys(), row))}")
        else:
            print("No bookings found")
            
        # Check users
        result = db.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'"))
        columns = [row[0] for row in result]
        print(f"Columns in users table: {columns}")
    finally:
        db.close()

if __name__ == "__main__":
    check_bookings()
