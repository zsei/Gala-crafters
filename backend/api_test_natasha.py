import requests
import json
import time

url_list = "http://localhost:8000/api/users/bookings"
url_create = "http://localhost:8000/api/bookings"
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJuYXRhc2hhLmtoYWxlaXJhQGVtYWlsLmNvbSIsInJvbGUiOiJDdXN0b21lciIsImV4cCI6MTc3Mzc2MTkxNH0.r9PlDUGQZUMNe_z1etEp-eYlRCrMzs4WKe_-v86HP3Q"
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

def test_api():
    print("--- Testing GET /api/users/bookings ---")
    try:
        r = requests.get(url_list, headers=headers, timeout=10)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")

    print("\n--- Testing POST /api/bookings ---")
    data = {
        "package_id": 1,
        "event_date": "2026-11-20",
        "event_type": "Wedding",
        "venue_proposed": "Beach Resort",
        "guest_count": 100,
        "notes": "Automated test booking"
    }
    try:
        r = requests.post(url_create, headers=headers, json=data, timeout=10)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
