"""Add audience column to promo_codes if missing (all | verified | fully_verified)."""
from sqlalchemy import text

from database import SessionLocal


def main():
    db = SessionLocal()
    try:
        row = db.execute(
            text(
                "SELECT column_name FROM information_schema.columns "
                "WHERE table_name='promo_codes' AND column_name='audience'"
            )
        ).fetchone()
        if row:
            print("Column promo_codes.audience already exists.")
            return
        db.execute(
            text(
                "ALTER TABLE promo_codes ADD COLUMN audience VARCHAR(50) DEFAULT 'all'"
            )
        )
        db.execute(text("UPDATE promo_codes SET audience = 'all' WHERE audience IS NULL"))
        db.commit()
        print("Added promo_codes.audience with default 'all'.")
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    main()
