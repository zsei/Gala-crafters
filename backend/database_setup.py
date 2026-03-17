"""
Database setup and query execution script for Gala Crafters CRM
This script helps initialize the database and run common queries
"""

from database import SessionLocal, engine
from sqlalchemy import text
import models

def setup_database():
    """Create all database tables"""
    print("Creating database tables...")
    models.Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")


def execute_raw_query(query: str):
    """Execute a raw SQL query"""
    db = SessionLocal()
    try:
        result = db.execute(text(query))
        db.commit()
        # Convert result to list of dictionaries if it's a SELECT query
        if query.strip().upper().startswith("SELECT"):
            columns = result.keys()
            return [dict(zip(columns, row)) for row in result]
        return result
    except Exception as e:
        print(f"Error executing query: {e}")
        db.rollback()
        return None
    finally:
        db.close()


def get_active_bookings():
    """Get all active bookings with customer details"""
    query = """
    SELECT 
        b.booking_reference,
        CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
        u.email,
        ep.package_name,
        b.event_date,
        b.venue_proposed,
        b.guest_count,
        b.total_price,
        b.status
    FROM bookings b
    INNER JOIN users u ON b.customer_id = u.id
    INNER JOIN event_packages ep ON b.package_id = ep.id
    WHERE b.status IN ('Confirmed', 'Processing', 'Pending')
    ORDER BY b.event_date ASC
    """
    return execute_raw_query(query)


def get_dashboard_metrics():
    """Get key dashboard metrics"""
    query = """
    SELECT 
        (SELECT COUNT(*) FROM bookings WHERE status IN ('Confirmed', 'Processing')) AS active_bookings,
        (SELECT COUNT(*) FROM pending_approvals WHERE status = 'Pending') AS pending_approvals,
        (SELECT COUNT(*) FROM users WHERE user_role = 'Customer') AS total_customers,
        (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status IN ('Confirmed', 'Processing')) AS total_revenue
    """
    return execute_raw_query(query)


def get_pending_approvals():
    """Get all pending approvals"""
    query = """
    SELECT 
        id,
        approval_type,
        customer_name,
        description,
        status,
        created_at
    FROM pending_approvals
    WHERE status = 'Pending'
    ORDER BY created_at DESC
    """
    return execute_raw_query(query)


def get_recent_messages(limit: int = 10):
    """Get recent unread messages"""
    query = f"""
    SELECT 
        id,
        name,
        email,
        message_subject,
        message_body,
        status,
        created_at
    FROM messages
    WHERE status = 'Unread'
    ORDER BY created_at DESC
    LIMIT {limit}
    """
    return execute_raw_query(query)


def get_user_bookings(user_id: int):
    """Get booking history for a specific user"""
    query = f"""
    SELECT 
        b.booking_reference,
        ep.package_name,
        b.event_date,
        b.total_price,
        b.status
    FROM bookings b
    INNER JOIN event_packages ep ON b.package_id = ep.id
    WHERE b.customer_id = {user_id}
    ORDER BY b.created_at DESC
    """
    return execute_raw_query(query)


def get_monthly_revenue():
    """Get monthly revenue report"""
    query = """
    SELECT 
        DATE_TRUNC('month', b.event_date) AS month,
        SUM(b.total_price) AS total_revenue,
        COUNT(b.id) AS total_bookings,
        AVG(b.total_price) AS average_booking_value
    FROM bookings b
    WHERE b.status IN ('Confirmed', 'Processing', 'Completed')
    GROUP BY DATE_TRUNC('month', b.event_date)
    ORDER BY month DESC
    """
    return execute_raw_query(query)


def get_available_packages():
    """Get all available event packages"""
    query = """
    SELECT 
        id,
        package_name,
        event_type,
        description,
        base_price,
        max_guests
    FROM event_packages
    WHERE status = 'Active'
    ORDER BY base_price ASC
    """
    return execute_raw_query(query)


def update_booking_status(booking_reference: str, new_status: str):
    """Update booking status"""
    query = f"""
    UPDATE bookings
    SET status = '{new_status}', updated_at = CURRENT_TIMESTAMP
    WHERE booking_reference = '{booking_reference}'
    """
    return execute_raw_query(query)


def mark_message_as_read(message_id: int):
    """Mark a message as read"""
    query = f"""
    UPDATE messages
    SET status = 'Read', updated_at = CURRENT_TIMESTAMP
    WHERE id = {message_id}
    """
    return execute_raw_query(query)


def get_top_packages():
    """Get top performing packages by revenue"""
    query = """
    SELECT 
        ep.package_name,
        ep.event_type,
        COUNT(b.id) AS bookings_count,
        SUM(b.total_price) AS total_revenue,
        AVG(b.total_price) AS average_value
    FROM bookings b
    INNER JOIN event_packages ep ON b.package_id = ep.id
    WHERE b.status != 'Cancelled'
    GROUP BY ep.id, ep.package_name, ep.event_type
    ORDER BY total_revenue DESC
    """
    return execute_raw_query(query)


def get_booking_status_distribution():
    """Get distribution of booking statuses"""
    query = """
    SELECT 
        status,
        COUNT(*) AS count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
    FROM bookings
    GROUP BY status
    """
    return execute_raw_query(query)


if __name__ == "__main__":
    print("=" * 60)
    print("GALA CRAFTERS CRM - DATABASE SETUP")
    print("=" * 60)
    
    # Setup database
    setup_database()
    
    print("\n✓ Database is ready!")
    print("You can now use the functions in this script to query your database")
    print("\nExample usage:")
    print("  - get_active_bookings()")
    print("  - get_dashboard_metrics()")
    print("  - get_pending_approvals()")
    print("  - get_recent_messages()")
    print("  - get_available_packages()")
    print("  - update_booking_status('BK-001', 'Confirmed')")
