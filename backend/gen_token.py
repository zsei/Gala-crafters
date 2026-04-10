import jwt
import datetime as gala_dt

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"

def create_customer_token():
    payload = {
        "sub": "1", # Natasha Khaleira's ID
        "email": "natasha.khaleira@email.com",
        "role": "Customer",
        "exp": gala_dt.datetime.utcnow() + gala_dt.timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

if __name__ == "__main__":
    print(create_customer_token())
