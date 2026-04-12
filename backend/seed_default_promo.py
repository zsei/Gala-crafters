"""
Ensure the default Gala Crafters promo exists in the database.
Run from backend/: python seed_default_promo.py
"""
import datetime as dt

from database import SessionLocal
import models

DEFAULT_CODE = "GALACRAFTERS12"
DEFAULT_PCT = 12.0
DEFAULT_EXPIRY = "2026-12-31"
DEFAULT_MAX_USES = 500


def main():
    db = SessionLocal()
    try:
        existing = (
            db.query(models.PromoCode)
            .filter(models.PromoCode.code == DEFAULT_CODE)
            .first()
        )
        if existing:
            print(f"Promo {DEFAULT_CODE} already exists (id={existing.id}).")
            return
        row = models.PromoCode(
            code=DEFAULT_CODE,
            discount_percentage=DEFAULT_PCT,
            discount_amount=None,
            expiry_date=dt.datetime.strptime(DEFAULT_EXPIRY, "%Y-%m-%d").date(),
            max_uses=DEFAULT_MAX_USES,
            current_uses=0,
            status="Active",
            audience="all",
        )
        db.add(row)
        db.commit()
        print(f"Inserted promo {DEFAULT_CODE} ({DEFAULT_PCT}% off, expires {DEFAULT_EXPIRY}).")
    finally:
        db.close()


if __name__ == "__main__":
    main()
