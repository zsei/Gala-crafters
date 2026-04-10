from database_setup import execute_raw_query

# Check actual raw customer_name values
query = "SELECT booking_reference, customer_name, customer_email FROM bookings LIMIT 5"
result = execute_raw_query(query)
print("Raw customer data:")
print("-" * 80)
for row in result:
    print(f"Ref: {row['booking_reference']:20} | Name: '{row['customer_name']}' | Email: {row['customer_email']}")
