"""
Update test bookings with event customization details
"""

from database import SessionLocal
from sqlalchemy import text

def add_customization_details():
    """Add event customization details to existing test bookings"""
    db = SessionLocal()
    
    try:
        print("=" * 70)
        print("ADDING CUSTOMIZATION DETAILS TO TEST BOOKINGS")
        print("=" * 70)
        
        # Update first test booking
        update_query1 = text("""
            UPDATE bookings 
            SET 
                event_theme = 'Modern Minimalist',
                color_palette = 'Gold & Navy',
                event_location = 'Grand Ballroom',
                specific_venue_address = '123 Luxury Avenue, Metro Manila',
                special_requests = 'Prefer live band instead of DJ. Dietary restrictions: 5 vegetarian guests. Please provide champagne tower service.'
            WHERE booking_reference = 'TESTTODAYF443086'
        """)
        
        # Update second test booking
        update_query2 = text("""
            UPDATE bookings 
            SET 
                event_theme = 'Rustic Garden Wedding',
                color_palette = 'Blush Pink & Sage Green',
                event_location = 'Beachfront Resort',
                specific_venue_address = '456 Seaside Boulevard, Las Piñas',
                special_requests = 'Outdoor ceremony preferred. Need transportation for elderly guests. Allergic to shellfish - please note in menu.'
            WHERE booking_reference = 'TESTTODAYE8198B2'
        """)
        
        # Update third test booking
        update_query3 = text("""
            UPDATE bookings 
            SET 
                event_theme = 'Elegant Classic',
                color_palette = 'White & Rose Gold',
                event_location = 'Country Club',
                specific_venue_address = '789 Elite Drive, Makati',
                special_requests = 'Formal dress code. Need 3 additional tables for late arrivals. Request sparklers for grand exit photo.'
            WHERE booking_reference = 'TESTTODAY8F81AC2'
        """)
        
        db.execute(update_query1)
        db.execute(update_query2)
        db.execute(update_query3)
        db.commit()
        
        print("\n✅ Successfully added customization details:\n")
        
        print("Booking 1 (TESTTODAYF443086):")
        print("  ✓ Theme: Modern Minimalist")
        print("  ✓ Colors: Gold & Navy")
        print("  ✓ Location: Grand Ballroom")
        print("  ✓ Special Requests: Live band, vegetarian options, champagne tower\n")
        
        print("Booking 2 (TESTTODAYE8198B2):")
        print("  ✓ Theme: Rustic Garden Wedding")
        print("  ✓ Colors: Blush Pink & Sage Green")
        print("  ✓ Location: Beachfront Resort")
        print("  ✓ Special Requests: Outdoor ceremony, transportation, allergy notes\n")
        
        print("Booking 3 (TESTTODAY8F81AC2):")
        print("  ✓ Theme: Elegant Classic")
        print("  ✓ Colors: White & Rose Gold")
        print("  ✓ Location: Country Club")
        print("  ✓ Special Requests: Formal dress, extra tables, sparklers\n")
        
        print("=" * 70)
        print("🧪 Test the modal:")
        print("=" * 70)
        print("\n1. Hard refresh browser (Ctrl+F5)")
        print("2. Go to: http://localhost:5174/admin/bookings?status=ongoing")
        print("3. Click on any 'On-going Event' booking")
        print("4. View Details modal will show all customization information!")
        print("\n" + "=" * 70)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_customization_details()
