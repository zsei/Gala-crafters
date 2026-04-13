from database import SessionLocal
import models
import datetime as gala_dt

def seed_inquiries():
    db = SessionLocal()
    try:
        # First, clear existing sample messages to ensure we only have the new guest accounts
        print("Clearing old inquiries and adding new unregistered guest accounts...")
        db.query(models.Message).delete()
        
        sample_messages = [
            {
                "name": "Julianne Sterling",
                "email": "j.sterling@outlook.com",
                "phone": "+63 905 111 2233",
                "message_subject": "Grand Wedding Plan",
                "event_type": "Wedding",
                "message_body": "I'm planning a grand wedding for next year and would love to see your full portfolio for garden settings.",
                "status": "Unread"
            },
            {
                "name": "Rafael De Silva",
                "email": "rafa.desilva@gmail.com",
                "phone": "+63 917 888 9900",
                "message_subject": "Tech Conference Inquiry",
                "event_type": "Corporate Event",
                "message_body": "Our tech startup is looking for an event partner for our product launch in BGC. Do you handle high-tech stage setups?",
                "status": "Unread"
            },
            {
                "name": "Beatriz Lopez",
                "email": "beatriz.lopez@yahoo.com",
                "phone": "+63 922 333 4455",
                "message_subject": "Sweet 16 Party",
                "event_type": "Childrens Party",
                "message_body": "I want to organize a special birthday party for my niece. She loves the fairytale theme. Can you provide a quote?",
                "status": "Unread"
            },
            {
                "name": "Dominic Wu",
                "email": "dom.wu88@gmail.com",
                "phone": "+63 908 555 6677",
                "message_subject": "Golden Anniversary",
                "event_type": "Special Occasion",
                "message_body": "My parents are celebrating their 50th wedding anniversary. We need a professional team to handle everything from venue to catering.",
                "status": "Read"
            },
            {
                "name": "Sophia Moretti",
                "email": "sophia.m@business.ph",
                "phone": "+63 919 444 5566",
                "message_subject": "Luxury Debut",
                "event_type": "Debut",
                "message_body": "I'm inquiring about the Classy Debut Package for my daughter. We have approximately 200 guests. Is there a viewing for your sets?",
                "status": "Unread"
            },
            {
                "name": "Kevin Tan",
                "email": "kevin.tan@protonmail.com",
                "phone": "+63 927 777 8899",
                "message_subject": "Exhibition Inquiry",
                "event_type": "Other",
                "message_body": "We are hosting an art exhibition and need minimalist but elegant styling for the gallery space. Can you help?",
                "status": "Unread"
            }
        ]

        for msg_data in sample_messages:
            new_msg = models.Message(
                name=msg_data["name"],
                email=msg_data["email"],
                phone=msg_data["phone"],
                message_subject=msg_data["message_subject"],
                event_type=msg_data["event_type"],
                message_body=msg_data["message_body"],
                status=msg_data["status"],
                created_at=gala_dt.datetime.utcnow() - gala_dt.timedelta(days=(gala_dt.datetime.now().second % 10))
            )
            db.add(new_msg)
        
        db.commit()
        print("✓ Successfully added real unregistered guest inquiries!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding inquiries: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_inquiries()
