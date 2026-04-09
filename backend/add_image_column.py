import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql://postgres:password@localhost/gala_crafters_db"

def add_column():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Check if column exists
        cur.execute("""
            SELECT count(*) 
            FROM information_schema.columns 
            WHERE table_name='event_packages' AND column_name='image_url';
        """)
        
        if cur.fetchone()[0] == 0:
            print("Adding image_url column to event_packages...")
            cur.execute("ALTER TABLE event_packages ADD COLUMN image_url VARCHAR(500);")
            conn.commit()
            print("Column added successfully!")
        else:
            print("Column image_url already exists.")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_column()
