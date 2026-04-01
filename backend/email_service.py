import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# To use an actual email, you would set these environment variables or hardcode them
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "")  # e.g., "your.email@gmail.com"
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "")  # e.g., "your-app-password"

def send_reset_email(to_email: str, reset_link: str):
    print(f"--- MOCK EMAIL SENDING ---")
    print(f"To: {to_email}")
    print(f"Link: {reset_link}")
    print(f"--------------------------")
    
    # Check if credentials are set, otherwise just print
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print("[email_service] SENDER_EMAIL or SENDER_PASSWORD not set. Skipping actual email delivery.")
        return True

    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email
        msg['Subject'] = "Gala Crafters - Password Reset"
        
        body = f"""
        Hello,
        
        We received a request to reset your password for your Gala Crafters account.
        
        Click the link below to set a new password:
        {reset_link}
        
        If you did not make this request, you can safely ignore this email.
        
        Best regards,
        Gala Crafters Team
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # HTML version
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #c49a2c; margin: 0;">Gala Crafters</h1>
                    <p style="color: #777; margin-top: 5px;">Your curated event management</p>
                </div>
                
                <h2 style="color: #333; border-bottom: 2px solid #f4f4f4; padding-bottom: 15px;">Reset Your Password</h2>
                
                <p style="color: #555; line-height: 1.6;">Hello,</p>
                <p style="color: #555; line-height: 1.6;">We received a request to reset your password for your Gala Crafters account. Click the button below to secure your account:</p>
                
                <div style="text-align: center; margin: 35px 0;">
                    <a href="{reset_link}" style="background-color: #c49a2c; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Your Password</a>
                </div>
                
                <p style="color: #555; line-height: 1.6;">If the button doesn't work, you can also copy and paste this link into your browser:</p>
                <p style="color: #c49a2c; font-size: 13px; word-break: break-all;">{reset_link}</p>
                
                <p style="color: #999; font-size: 12px; margin-top: 40px; border-top: 2px solid #f4f4f4; padding-top: 20px;">If you did not make this request, you can safely ignore this email.</p>
                <div style="text-align: center; margin-top: 20px; color: #bbb; font-size: 11px;">
                    © 2026 Gala Crafters Event Management
                </div>
            </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(html_body, 'html'))
        
        # Connect and send
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        text_content = msg.as_string()
        server.sendmail(SENDER_EMAIL, to_email, text_content)
        server.quit()
        
        print(f"[email_service] Successfully sent reset email to {to_email}")
        return True
    except Exception as e:
        print(f"[email_service] Error sending email: {e}")
        return False
