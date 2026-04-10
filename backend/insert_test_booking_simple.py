import psycopg2
from datetime import date, timedelta
import uuid

try:
    conn = psycopg2.connect(
        host='localhost',
        database='gala_crafters_db',
        user='postgres',
        password='password'
    )
    cur = conn.cursor()
    
    # First, check what's in the database
    cur.execute("SELECT COUNT(*) FROM users WHERE user_role = 'Customer'")
    customer_count = cur.fetchone()[0]
    print(f"Customers in DB: {customer_count}")
    
    if customer_count > 0:
        # Get a customer ID
        cur.execute("SELECT id FROM users WHERE user_role = 'Customer' LIMIT 1")
        customer_id = cur.fetchone()[0]
        print(f"Using customer ID: {customer_id}")
        
        # Get a package ID
        cur.execute("SELECT id FROM event_packages LIMIT 1")
        result = cur.fetchone()
        if result:
            package_id = result[0]
            print(f"Using package ID: {package_id}")
            
            # Insert a test booking for today
            today = date.today()
            booking_ref = f"BK{uuid.uuid4().hex[:10].upper()}"
            
            cur.execute("""
                INSERT INTO bookings 
                (booking_reference, customer_id, package_id, event_date, 
                 venue_proposed, guest_count, total_price, status, 
                 is_email_verified, is_phone_verified, discount_amount)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                booking_ref, customer_id, package_id, today,
                'Test Venue', 50, 50000.00, 'Pending',
                True, True, 0.0
            ))
            
            conn.commit()
            print(f"[OK] Inserted test booking: {booking_ref}")
        else:
            print("[ERROR] No packages found")
    else:
        print("[ERROR] No customers found - need to insert customer first")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"[ERROR] {type(e).__name__}: {e}")
