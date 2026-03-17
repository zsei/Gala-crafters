import requests
import json

url = "http://localhost:8000/api/admin/bookings"
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhLnN0ZXJsaW5nQGdhbGEuY29tIiwicm9sZSI6IkV4ZWN1dGl2ZSBBZG1pbiIsImV4cCI6MTc3Mzc1NzUzNX0.w3fI5NMt5FeSSix-9kcx8PXIRJni-VjHRxk52X2gPRw"
headers = {"Authorization": f"Bearer {token}"}

try:
    print(f"Requesting {url}...")
    response = requests.get(url, headers=headers, timeout=10)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except requests.exceptions.Timeout:
    print("Error: Request timed out")
except Exception as e:
    print(f"Error: {e}")
