"""
Test the bookings API endpoint to verify status updates are working
"""

import requests
import json
from datetime import date

API_BASE_URL = "http://localhost:8000"

# Use a valid token from the database
HEADERS = {
    "Authorization": f"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZ2VsMDEyM0BnbWFpbC5jb20iLCJpZCI6MSwiaWF0IjoxNzc0MDM2OTk2LCJleHAiOjE3NzQxMjMzOTZ9.Uc_Jz-oW1RRRIXxH24_FKzNE7j0AqYVdqI82K4G3wqA"
}

print("=" * 80)
print("TESTING BOOKINGS API ENDPOINT")
print("=" * 80)
print(f"\nCurrent Date: {date.today()}\n")

try:
    # Call the API
    response = requests.get(f"{API_BASE_URL}/api/admin/bookings", headers=HEADERS)
    
    print(f"API Response Status: {response.status_code}")
    
    if response.status_code == 200:
        bookings = response.json()
        
        print(f"\n📊 TOTAL BOOKINGS: {len(bookings)}\n")
        
        # Group by status
        by_status = {}
        for booking in bookings:
            status = booking.get('status', 'Unknown')
            if status not in by_status:
                by_status[status] = []
            by_status[status].append(booking)
        
        print("=" * 80)
        print("BOOKINGS BY STATUS:")
        print("=" * 80)
        
        for status, bookings_list in sorted(by_status.items()):
            print(f"\n🏷️  {status.upper()} ({len(bookings_list)} bookings)")
            print("-" * 80)
            
            for booking in bookings_list[:5]:  # Show first 5 of each status
                ref = booking.get('booking_reference', 'N/A')
                event_date = booking.get('event_date', 'N/A')
                venue = booking.get('venue_proposed', 'N/A')
                
                print(f"  ✓ {ref:<18} | Date: {event_date} | Venue: {venue}")
            
            if len(bookings_list) > 5:
                print(f"  ... and {len(bookings_list) - 5} more")
        
        print("\n" + "=" * 80)
        print("✅ API IS RETURNING BOOKINGS CORRECTLY")
        print("=" * 80)
        
        # Check specifically for our test bookings
        test_refs = ['BKFF21F3F51C3', 'BKD5BF927CEC5', 'BK79CBE4C79D6']
        print("\n🔍 CHECKING FOR OUR TEST BOOKINGS:")
        print("-" * 80)
        
        all_bookings = response.json()
        for test_ref in test_refs:
            found = False
            for booking in all_bookings:
                if booking.get('booking_reference') == test_ref:
                    status = booking.get('status')
                    date_val = booking.get('event_date')
                    print(f"  ✓ {test_ref} | Status: {status} | Date: {date_val}")
                    found = True
                    break
            if not found:
                print(f"  ✗ {test_ref} | NOT FOUND")
        
        print("\n" + "=" * 80)
        print("📝 NEXT STEP:")
        print("=" * 80)
        print("\n1. Go to: http://localhost:5174/admin/bookings?status=ongoing")
        print("2. Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)")  
        print("3. Click 'On-going Events' in the left sidebar")
        print("4. You should see all the test bookings there!")
        print("\nIf it STILL shows 'No ongoing bookings yet':")
        print("  - Check browser console (F12) for any errors")
        print("  - Check that the filter mapping is correct")
        print("  - Make sure 'status=ongoing' maps to 'On-going Event'")
        print("=" * 80)
            
    else:
        print(f"❌ API Error: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"❌ Error: {e}")
