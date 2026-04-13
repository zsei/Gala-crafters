import sqlite3
import os

def migrate():
    db_path = os.path.join(os.path.dirname(__file__), 'gala_crafters.db')
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        print("Adding promo_notifications column...")
        cursor.execute("ALTER TABLE users ADD COLUMN promo_notifications BOOLEAN DEFAULT 1")
    except sqlite3.OperationalError as e:
        print(f"Note: {e}")

    try:
        print("Adding booking_notifications column...")
        cursor.execute("ALTER TABLE users ADD COLUMN booking_notifications BOOLEAN DEFAULT 1")
    except sqlite3.OperationalError as e:
        print(f"Note: {e}")

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
