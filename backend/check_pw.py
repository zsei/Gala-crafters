import psycopg2

dbname = "gala_crafters_db"
user = "postgres"
host = "localhost"
passwords = ["admin123", "postgres", "password", "admin", "123456", ""]

for p in passwords:
    try:
        con = psycopg2.connect(dbname=dbname, user=user, password=p, host=host)
        con.close()
        print(f"PASSWORD_WORKS: {p}")
        break
    except:
        continue
