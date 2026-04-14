"""
Database schema synchronization utility for Gala Crafters CRM.
Ensures the database schema matches the models defined in models.py.
This script is run automatically on server startup.
"""

import logging
from sqlalchemy import create_engine, inspect, text, Column
from sqlalchemy.orm import Session
import models
from database import engine, Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_column_type_sql(column: Column, dialect_name: str) -> str:
    """Convert SQLAlchemy column type to SQL type string based on dialect."""
    from sqlalchemy.types import String, Integer, Boolean, Float, Text, Date, DateTime, ARRAY
    
    col_type = column.type
    
    if isinstance(col_type, String):
        return f"VARCHAR({col_type.length})" if col_type.length else "VARCHAR"
    elif isinstance(col_type, Integer):
        return "INTEGER"
    elif isinstance(col_type, Boolean):
        return "BOOLEAN"
    elif isinstance(col_type, Float):
        return "FLOAT"
    elif isinstance(col_type, Text):
        return "TEXT"
    elif isinstance(col_type, Date):
        return "DATE"
    elif isinstance(col_type, DateTime):
        return "TIMESTAMP" if dialect_name == "postgresql" else "DATETIME"
    elif isinstance(col_type, ARRAY):
        # Only PostgreSQL supports ARRAY natively
        if dialect_name == "postgresql":
            inner_type = get_column_type_sql(Column(type_=col_type.item_type), dialect_name)
            return f"{inner_type}[]"
        else:
            return "TEXT" # Fallback for SQLite
    
    return str(col_type)

def ensure_schema():
    """Check all tables and columns, adding any missing ones."""
    logger.info("Starting database schema synchronization...")
    
    # 1. Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # 2. Check for missing columns
    inspector = inspect(engine)
    dialect_name = engine.dialect.name
    
    # Get all tables defined in Base
    for table_name, table in Base.metadata.tables.items():
        # Get existing columns in the database for this table
        try:
            existing_columns = [col['name'] for col in inspector.get_columns(table_name)]
        except Exception as e:
            logger.warning(f"Could not inspect table {table_name}: {e}")
            continue
            
        # Check each column defined in the model
        for column_name, column in table.columns.items():
            if column_name not in existing_columns:
                logger.info(f"Adding missing column '{column_name}' to table '{table_name}'...")
                
                type_sql = get_column_type_sql(column, dialect_name)
                default_sql = ""
                
                # Handle simple defaults
                if column.default is not None and hasattr(column.default, 'arg'):
                    if isinstance(column.default.arg, (bool, int, float)):
                        default_sql = f" DEFAULT {str(column.default.arg).upper()}"
                    elif isinstance(column.default.arg, str):
                        default_sql = f" DEFAULT '{column.default.arg}'"
                
                alter_query = f"ALTER TABLE {table_name} ADD COLUMN {column_name} {type_sql}{default_sql}"
                
                try:
                    with engine.begin() as conn:
                        conn.execute(text(alter_query))
                    logger.info(f"✓ Successfully added column '{column_name}'")
                except Exception as e:
                    logger.error(f"Failed to add column '{column_name}' to '{table_name}': {e}")

    logger.info("Database schema synchronization complete!")

if __name__ == "__main__":
    ensure_schema()
