import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import json
from backend.database import SessionLocal
from sqlalchemy import text

# Default package data structure for migration
packages_data = {
    "Intimate Wedding Package": [
        {"title": "Gourmet Buffet Dining", "desc": "Full buffet service featuring Appetizer, Soup, Salad, 4 main courses (Beef, Pork, Chicken, Fish), Pasta, Vegetables, and Dessert."},
        {"title": "Silverware & Linens", "desc": "Fine Chinaware, Glassware and Silverware with stunning table linens in your choice of colors, plus custom menu and place cards."},
        {"title": "Thematic Setups", "desc": "Stylish couch and thematic backdrop, Tiffany chairs for all, specialized tables for cake/gifts, and a full beverage bar setup."},
        {"title": "Premium Service Team", "desc": "Professional uniformed waiters/pantry with PPE, including VIP setup and seated service for gatherings above 40 guests."}
    ],
    "Utopian Wedding Package": [
        {"title": "Gourmet Grand Buffet", "desc": "Appetizer, Soup Bar, Salad Station, Carving Stations (Beef/Pork), 3 Entrees, Pasta, Veggies, 3-Layer Fondant Cake, and signature Lemon Iced Tea."},
        {"title": "Elite VIP Experience", "desc": "Stylish couch and backdrop, elegant service for 24 VIP guests, custom menu/place cards, and dedicated wine service for VIP tables."},
        {"title": "Sophisticated Venue Setup", "desc": "Round tables with Tiffany chairs, premium linens, centerpieces with tealights, aisle runner, and registration/gift/cake setups."},
        {"title": "Dedicated Professional Team", "desc": "Uniformed staff with PPE, full bar setup, waiters/pantry service, and a chilled bottle of wine for the couple's toast."}
    ],
    "Elite Wedding Package": [
        {"title": "Master Chef Grand Buffet", "desc": "Welcome Cocktails, Soup/Salad Bars, Dual Carving Stations (Beef & Pork), 3 Entrees, Pasta, Veggies, Fondant Cake or Sound & Lights, and Brewed Coffee/Tea."},
        {"title": "Grand VIP & Production", "desc": "Elegant VIP setup for 30 guests, Photowall, Reception Cocktail Tables, custom menu/place cards, and premium wine service for VIP tables."},
        {"title": "Palatial Venue Styling", "desc": "Tiffany chairs for all, stunning array of linens, table centerpieces with tealights, aisle runner, and specialized registration/gift/cake setups."},
        {"title": "White Glove Service Team", "desc": "Uniformed staff with PPE, full bar setup for beverage stations, house blend iced tea, and a chilled bottle of wine for the toast."}
    ]
}

# Generic features used as defaults
default_features = ["Seamless Setup & Breakdown", "Professional Uniformed Team", "Full Buffet Management", "Complete Thematic Styling"]

def migrate_package_inclusions():
    db = SessionLocal()
    try:
        print("Migrating package inclusions to database...")
        for name, inclusions in packages_data.items():
            included_json = json.dumps(inclusions)
            # PostgreSQL array format
            features_list = default_features
            
            # Use bind parameters for safety and to avoid SQL injection/formatting issues
            update_query = text("""
                UPDATE event_packages 
                SET included_items = :inclusions, 
                    features = :features
                WHERE package_name = :name
            """)
            
            result = db.execute(update_query, {
                "inclusions": included_json, 
                "name": name,
                "features": features_list
            })
            print(f"Updated '{name}' - {result.rowcount} row(s) affected.")
            
        db.commit()
        print("Migration complete!")
    except Exception as e:
        print(f"Error during migration: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate_package_inclusions()
