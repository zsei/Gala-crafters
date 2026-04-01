"""
Direct email test script - shows exactly what's failing
"""
from dotenv import load_dotenv
load_dotenv()

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "")

print(f"SMTP_SERVER   : {SMTP_SERVER}")
print(f"SMTP_PORT     : {SMTP_PORT}")
print(f"SENDER_EMAIL  : {SENDER_EMAIL}")
print(f"SENDER_PASSWORD set: {'YES' if SENDER_PASSWORD else 'NO'}")

if not SENDER_EMAIL or not SENDER_PASSWORD:
    print("\n[ERROR] SENDER_EMAIL or SENDER_PASSWORD is empty. The .env is not loading.")
    exit(1)

# send to yourself for testing
TO_EMAIL = SENDER_EMAIL

try:
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = TO_EMAIL
    msg['Subject'] = "Gala Crafters - Email Test"
    msg.attach(MIMEText("This is a test email from the Gala Crafters backend.", 'plain'))

    print(f"\nConnecting to {SMTP_SERVER}:{SMTP_PORT} ...")
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=15)
    server.set_debuglevel(1)   # shows SMTP conversation
    server.starttls()
    print("STARTTLS OK")
    server.login(SENDER_EMAIL, SENDER_PASSWORD)
    print("LOGIN OK")
    server.sendmail(SENDER_EMAIL, TO_EMAIL, msg.as_string())
    server.quit()
    print("\n[SUCCESS] Email sent to", TO_EMAIL)
except Exception as e:
    print(f"\n[FAILED] {type(e).__name__}: {e}")
