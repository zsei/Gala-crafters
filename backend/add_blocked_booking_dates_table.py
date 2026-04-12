"""Create blocked_booking_dates table if it does not exist."""
from sqlalchemy import text

from database import SessionLocal


def main():
    db = SessionLocal()
    try:
        row = db.execute(
            text(
                "SELECT table_name FROM information_schema.tables "
                "WHERE table_schema = 'public' AND table_name = 'blocked_booking_dates'"
            )
        ).fetchone()
        if row:
            print("Table blocked_booking_dates already exists.")
            return
        db.execute(
            text(
                """
                CREATE TABLE blocked_booking_dates (
                    id SERIAL PRIMARY KEY,
                    block_date DATE UNIQUE NOT NULL,
                    note VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
        )
        db.execute(text("CREATE INDEX idx_blocked_booking_dates_date ON blocked_booking_dates(block_date)"))
        db.commit()
        print("Created blocked_booking_dates table.")
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    main()
