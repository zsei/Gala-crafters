"""
Phone verification service - SMS sending via backend
In demo mode, codes are printed to terminal for testing
"""

import random
import string
import sys
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models import User

# DEMO MODE - Set to False when you have a real SMS provider
DEMO_MODE = True

# Store verification codes temporarily (in production, use Redis or database)
verification_codes = {}

def generate_verification_code(length: int = 6) -> str:
    """Generate a random 6-digit verification code"""
    return ''.join(random.choices(string.digits, k=length))

def send_verification_sms(phone_number: str) -> dict:
    """
    Send verification code via SMS
    Phone number should be in format: +63 9XXXXXXXXX or 09XXXXXXXXX
    """
    try:
        # Normalize phone number
        phone = phone_number.replace('+63 9', '09').replace('+63', '0')
        if not phone.startswith('0'):
            phone = '0' + phone
        
        # Generate code
        code = generate_verification_code()
        
        # Store code with expiry (5 minutes)
        verification_codes[phone] = {
            'code': code,
            'expires_at': datetime.utcnow() + timedelta(minutes=5),
            'attempts': 0
        }
        
        if DEMO_MODE:
            # Demo mode - write code to file so user can see it
            try:
                with open('VERIFICATION_CODE.txt', 'w') as f:
                    f.write(f"Phone: {phone_number}\n")
                    f.write(f"Code: {code}\n")
                    f.write(f"Expires at: {verification_codes[phone]['expires_at']}\n")
                print(f"✅ Code written to VERIFICATION_CODE.txt", flush=True)
            except Exception as write_err:
                print(f"Error writing to file: {write_err}", flush=True)
            
            return {
                'success': True,
                'message': f'Verification code sent. Check VERIFICATION_CODE.txt in the backend folder.',
                'phone': phone_number
            }
        
        # In production, integrate with real SMS provider here
        return {
            'success': True,
            'message': 'Verification code sent to your phone',
            'phone': phone_number
        }
            
    except Exception as e:
        print(f"❌ Phone verification error: {e}", flush=True)
        sys.stdout.flush()
        return {
            'success': False,
            'message': f'Error sending verification SMS: {str(e)}'
        }

def verify_phone_code(phone_number: str, code: str) -> dict:
    """
    Verify the phone number with the provided code
    """
    try:
        # Normalize phone number
        phone = phone_number.replace('+63 9', '09').replace('+63', '0')
        if not phone.startswith('0'):
            phone = '0' + phone
        
        # DEBUG
        print(f"\n📱 VERIFY DEBUG:", flush=True)
        print(f"   Input phone: {phone_number}", flush=True)
        print(f"   Normalized phone: {phone}", flush=True)
        print(f"   Input code: {code}", flush=True)
        print(f"   Stored phones: {list(verification_codes.keys())}", flush=True)
        print(f"   Stored codes: {[v['code'] for v in verification_codes.values()]}\n", flush=True)
        sys.stdout.flush()
        
        # Check if code exists
        if phone not in verification_codes:
            return {
                'success': False,
                'message': 'No verification code found. Please request a new one.'
            }
        
        stored_data = verification_codes[phone]
        
        # Check if code expired
        if datetime.utcnow() > stored_data['expires_at']:
            del verification_codes[phone]
            return {
                'success': False,
                'message': 'Verification code has expired. Please request a new one.'
            }
        
        # Check attempts (max 3 attempts)
        if stored_data['attempts'] >= 3:
            del verification_codes[phone]
            return {
                'success': False,
                'message': 'Too many failed attempts. Please request a new verification code.'
            }
        
        # Verify code
        if stored_data['code'] != code:
            stored_data['attempts'] += 1
            remaining = 3 - stored_data['attempts']
            return {
                'success': False,
                'message': f'Invalid code. {remaining} attempts remaining.'
            }
        
        # Code is valid - clean up
        del verification_codes[phone]
        
        return {
            'success': True,
            'message': 'Phone number verified successfully!',
            'phone': phone_number
        }
        
    except Exception as e:
        print(f"Phone verification error: {e}")
        return {
            'success': False,
            'message': f'Error verifying phone: {str(e)}'
        }

def update_phone_verification_status(user: User, db: Session, is_verified: bool = True):
    """Update user's phone verification status in database"""
    try:
        user.is_phone_verified = is_verified
        db.commit()
        return True
    except Exception as e:
        print(f"Error updating phone verification status: {e}")
        db.rollback()
        return False


