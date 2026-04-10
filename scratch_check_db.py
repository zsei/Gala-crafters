import sqlite3
import os

db_path = os.path.join('backend', 'gala_crafters.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT DISTINCT status FROM bookings")
statuses = cursor.fetchall()
print("Current statuses in DB:", [s[0] for s in statuses])

cursor.execute("SELECT booking_reference, status, event_date FROM bookings")
bookings = cursor.fetchall()
print("\nSample bookings:")
for b in bookings[:10]:
    print(f"Ref: {b[0]}, Status: {b[1]}, Date: {b[2]}")

conn.close()
