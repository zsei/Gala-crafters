import psycopg2
from psycopg2 import sql

try:
    conn = psycopg2.connect(
        host='localhost',
        database='gala_crafters',
        user='postgres',
        password='natasha123'
    )
    cur = conn.cursor()
    
    # Check existing columns in bookings
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'bookings'")
    columns = [row[0] for row in cur.fetchall()]
    print('Current bookings columns:', columns)
    print()
    
    # Add missing columns
    if 'discount_amount' not in columns:
        cur.execute('ALTER TABLE bookings ADD COLUMN discount_amount FLOAT DEFAULT 0.0')
        conn.commit()
        print('✓ Added discount_amount')
    else:
        print('✓ discount_amount already exists')
    
    if 'is_email_verified' not in columns:
        cur.execute('ALTER TABLE bookings ADD COLUMN is_email_verified BOOLEAN DEFAULT FALSE')
        conn.commit()
        print('✓ Added is_email_verified')
    else:
        print('✓ is_email_verified already exists')
        
    if 'is_phone_verified' not in columns:
        cur.execute('ALTER TABLE bookings ADD COLUMN is_phone_verified BOOLEAN DEFAULT FALSE')
        conn.commit()
        print('✓ Added is_phone_verified')
    else:
        print('✓ is_phone_verified already exists')
    
    # Check users table
    cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'")
    user_columns = [row[0] for row in cur.fetchall()]
    print('\nUsers table columns updated')
    
    cur.close()
    conn.close()
    print('\n✓ Database schema fixed successfully!')
except Exception as e:
    print(f'Error: {e}')
