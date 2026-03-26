import psycopg2

conn = psycopg2.connect('postgresql://postgres:password@localhost/gala_crafters_db')
cur = conn.cursor()

# Check if reviews table exists
cur.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reviews')")
exists = cur.fetchone()[0]
print(f"Reviews table exists: {exists}")

if exists:
    # Insert sample data if empty
    cur.execute("SELECT COUNT(*) FROM reviews")
    count = cur.fetchone()[0]
    if count == 0:
        print("Inserting sample reviews...")
        cur.execute("""
            INSERT INTO reviews (booking_id, customer_id, rating, comment)
            VALUES
                (1, 1, 5, 'The wedding was magical! Everything was perfect.'),
                (3, 3, 4, 'Great corporate event. Highly professional.'),
                (5, 5, 5, 'Best birthday bash ever! The catering was amazing.');
        """)
        conn.commit()
        print("Sample reviews inserted.")
    else:
        print(f"Reviews table already has {count} entries.")

conn.close()
