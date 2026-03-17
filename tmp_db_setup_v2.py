import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def run_setup():
    dbname = "gala_crafters_db"
    user = "postgres"
    host = "localhost"
    
    # Common passwords to try
    passwords = ["admin123", "postgres", "password", "admin", "123456", ""]
    
    sql_file_path = r"c:\Users\DELL\OneDrive\Desktop\GC\Gala-crafters\backend\setup_database_clean.sql"
    
    success_pw = None
    
    print("Testing common passwords for user 'postgres'...")
    
    for pw in passwords:
        try:
            con = psycopg2.connect(dbname='postgres', user=user, password=pw, host=host)
            con.close()
            success_pw = pw
            print(f"✓ Success with password: '{pw}'" if pw else "✓ Success with blank password")
            break
        except Exception:
            continue
            
    if success_pw is None:
        print("❌ Could not connect with common passwords.")
        return

    try:
        # 1. Connect and create database
        con = psycopg2.connect(dbname='postgres', user=user, password=success_pw, host=host)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{dbname}'")
        if not cur.fetchone():
            print(f"Creating database {dbname}...")
            cur.execute(f"CREATE DATABASE {dbname}")
            
        cur.close()
        con.close()
        
        # 2. Run SQL script
        con = psycopg2.connect(dbname=dbname, user=user, password=success_pw, host=host)
        cur = con.cursor()
        
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_script = f.read()
            
        print("Executing SQL script...")
        cur.execute(sql_script)
        con.commit()
        
        print("✓ Database setup completed successfully!")
        cur.close()
        con.close()
        
    except Exception as e:
        print(f"❌ Error during setup: {e}")

if __name__ == "__main__":
    run_setup()
