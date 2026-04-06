from database import engine, SessionLocal
from sqlalchemy import text, inspect
import os
import models

def verify_tables():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Current tables in database: {tables}")
    return tables

def run_sql_file(filename):
    print(f"Reading {filename}...")
    if not os.path.exists(filename):
        print(f"Error: {filename} not found.")
        return False
        
    with open(filename, 'r', encoding='utf-8') as f:
        sql = f.read()
    
    print("Executing SQL initialization...")
    # Filter out empty statements resulting from split
    # Note: simple split by ; is usually okay for this schema, 
    # but we'll execute the whole block if the database driver supports it.
    with engine.connect() as connection:
        trans = connection.begin()
        try:
            # Psycopg2 (used for postgres) supports executing multiple statements at once
            connection.execute(text(sql))
            trans.commit()
            print("✓ Database successfully initialized with schema and sample data!")
            return True
        except Exception as e:
            trans.rollback()
            print(f"Error during SQL execution: {e}")
            # Try executing statements one by one as fallback
            print("Attempting statement-by-statement execution...")
            try:
                # This is a bit naive but can work for simple schemas
                statements = [s.strip() for s in sql.split(';') if s.strip()]
                for statement in statements:
                    connection.execute(text(statement))
                connection.commit()
                print("✓ Successfully initialized statement-by-statement!")
                return True
            except Exception as e2:
                print(f"Fatal Error: {e2}")
                return False

def check_admin_user():
    print("Checking for admin users...")
    db = SessionLocal()
    try:
        result = db.execute(text("SELECT email, role FROM admin_users")).fetchall()
        for row in result:
            print(f"Found Admin: {row[0]} ({row[1]})")
        return len(result) > 0
    except Exception as e:
        print(f"Error checking admin users: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("=" * 60)
    print("GALA CRAFTERS - ROBUST DATABASE FIX")
    print("=" * 60)
    
    # 1. Check existing state
    verify_tables()
    
    # 2. Run the full setup script
    success = run_sql_file("setup_database_clean.sql")
    
    if success:
        # 3. Verify final state
        verified_tables = verify_tables()
        if "users" in verified_tables and "admin_users" in verified_tables:
            print("✓ Essential tables verified.")
            if check_admin_user():
                print("✓ Admin data verified.")
                print("\nDATABASE READY FOR USE!")
            else:
                print("✗ No admin users found after setup.")
        else:
            print("✗ Essential tables missing after setup.")
    else:
        print("✗ Database setup failed.")
