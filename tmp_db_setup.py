import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os

def run_setup():
    # Database connection parameters
    # Using the defaults found in database.py
    dbname = "gala_crafters_db"
    user = "postgres"
    password = "admin123"
    host = "localhost"
    
    # Path to the SQL file
    sql_file_path = r"c:\Users\DELL\OneDrive\Desktop\GC\Gala-crafters\backend\setup_database_clean.sql"
    
    try:
        # 1. Connect to default postgres database to create the target database
        print("Connecting to PostgreSQL...")
        con = psycopg2.connect(dbname='postgres', user=user, password=password, host=host)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        
        # Check if database exists
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{dbname}'")
        exists = cur.fetchone()
        if not exists:
            print(f"Creating database {dbname}...")
            cur.execute(f"CREATE DATABASE {dbname}")
        else:
            print(f"Database {dbname} already exists.")
            
        cur.close()
        con.close()
        
        # 2. Connect to the target database and run the SQL script
        print(f"Connecting to {dbname}...")
        con = psycopg2.connect(dbname=dbname, user=user, password=password, host=host)
        cur = con.cursor()
        
        print(f"Executing SQL script: {sql_file_path}")
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_script = f.read()
            
        cur.execute(sql_script)
        con.commit()
        
        print("✓ Database setup completed successfully!")
        cur.close()
        con.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nPossible issues:")
        print("1. PostgreSQL service might not be running.")
        print("2. Password 'admin123' might be incorrect for user 'postgres'.")
        print("3. psycopg2-binary might not be installed (run: pip install psycopg2-binary).")

if __name__ == "__main__":
    run_setup()
