"""
Check the password check constraint in the database
"""

from database import engine
from sqlalchemy import text

try:
    with engine.connect() as connection:
        result = connection.execute(text("""
            SELECT cc.constraint_name, cc.check_clause
            FROM information_schema.check_constraints cc
            WHERE cc.constraint_name LIKE '%password%'
        """))
        
        for row in result:
            print(f"Constraint: {row[0]}")
            print(f"Definition: {row[1]}")
            print()
        
except Exception as e:
    print(f"Error: {e}")
