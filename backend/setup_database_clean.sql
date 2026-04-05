-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS booking_services CASCADE;
DROP TABLE IF EXISTS promo_codes CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS admin_messages CASCADE;
DROP TABLE IF EXISTS pending_approvals CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS promo_codes CASCADE;
DROP TABLE IF EXISTS dashboard_metrics CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS event_packages CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 8 AND LENGTH(password) <= 15),
    date_of_birth DATE,
    building_details VARCHAR(255),
    country VARCHAR(100),
    city VARCHAR(100),
    barangay VARCHAR(100),
    postal_code VARCHAR(20),
    user_role VARCHAR(50) DEFAULT 'Customer',
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Admin Users table
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Event Packages table
CREATE TABLE event_packages (
    id SERIAL PRIMARY KEY,
    package_name VARCHAR(150) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    max_guests INT,
    features TEXT[],
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Services table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    base_price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    customer_id INT NOT NULL,
    package_id INT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    event_type VARCHAR(100),
    venue_proposed VARCHAR(255),
    guest_count INT,
    total_price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (package_id) REFERENCES event_packages(id)
);

-- Create Booking Services junction table
CREATE TABLE booking_services (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10, 2),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Create Messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message_subject VARCHAR(255),
    message_body TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Admin Messages table
CREATE TABLE admin_messages (
    id SERIAL PRIMARY KEY,
    sender_id INT,
    sender_name VARCHAR(150),
    sender_email VARCHAR(255),
    message_body TEXT NOT NULL,
    message_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    conversation_id VARCHAR(100)
);

-- Create Pending Approvals table
CREATE TABLE pending_approvals (
    id SERIAL PRIMARY KEY,
    approval_type VARCHAR(100) NOT NULL,
    related_booking_id INT,
    customer_name VARCHAR(150),
    description TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (related_booking_id) REFERENCES bookings(id)
);

-- Create Promo Codes table
CREATE TABLE promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage DECIMAL(5, 2),
    discount_amount DECIMAL(10, 2),
    expiry_date DATE,
    max_uses INT,
    current_uses INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Dashboard Metrics table
CREATE TABLE dashboard_metrics (
    id SERIAL PRIMARY KEY,
    metric_date DATE NOT NULL,
    total_revenue DECIMAL(12, 2),
    active_bookings INT,
    pending_approvals INT,
    registered_users INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    customer_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status VARCHAR(50) DEFAULT 'Visible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (customer_id) REFERENCES users(id)
);

-- Create Promo Codes table
CREATE TABLE promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage DECIMAL(5,2),
    discount_amount DECIMAL(10,2),
    expiry_date DATE,
    max_uses INT,
    current_uses INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INSERT SAMPLE DATA
-- ============================================================================

-- Insert Users
INSERT INTO users (first_name, middle_name, last_name, email, phone, password, date_of_birth, country, city, postal_code, user_role)
VALUES
    ('Natasha', '', 'Khaleira', 'natasha.khaleira@email.com', '(+62) 821 2554-5846', 'hashed_pw123', '1990-12-10', 'United Kingdom', 'Leeds', 'ERT 1254', 'Customer'),
    ('John', 'Michael', 'Anderson', 'john.anderson@email.com', '(+1) 555-123-4567', 'hashed_pw456', '1995-06-15', 'United States', 'New York', '10001', 'Customer'),
    ('Sarah', 'Elizabeth', 'Jenkins', 'sarah.jenkins@email.com', '(+44) 20-7946-0958', 'hashed_pw789', '1992-03-22', 'United Kingdom', 'London', 'SW1A 1AA', 'Customer'),
    ('Emma', 'Jane', 'Thompson', 'emma.thompson@email.com', '(+1) 555-987-6543', 'hashed_pw012', '1998-09-08', 'United States', 'Los Angeles', '90001', 'Customer'),
    ('Marcus', 'David', 'Chen', 'marcus.chen@email.com', '(+65) 6789-1234', 'hashed_pw345', '1994-11-30', 'Singapore', 'Singapore', '188024', 'Customer');

-- Insert Admin Users
INSERT INTO admin_users (name, email, password, phone, role, status)
VALUES
    ('Alexander Sterling', 'a.sterling@gala.com', 'hashed_admin_123', '+1 (555) 902-1244', 'Executive Admin', 'Active'),
    ('Eleanor Rhodes', 'e.rhodes@gala.com', 'hashed_admin_456', '+1 (555) 438-9901', 'Compliance Officer', 'Active'),
    ('Julian Thorne', 'j.thorne@gala.com', 'hashed_admin_789', '+1 (555) 212-0092', 'Security Lead', 'Active'),
    ('Beatrice Vance', 'b.vance@gala.com', 'hashed_admin_012', '+1 (555) 771-3342', 'Support Manager', 'Active');

-- Insert Event Packages
INSERT INTO event_packages (package_name, event_type, description, base_price, max_guests, features, status)
VALUES
    ('Intimate Package', 'Wedding', 'Perfect for small, intimate weddings', 5000.00, 50, ARRAY['Venue coordination', 'Catering for 50 guests', 'Basic decor', 'Photography'], 'Active'),
    ('Utopian Package', 'Wedding', 'Comprehensive wedding package with premium services', 15000.00, 150, ARRAY['Venue', 'Four-course catering', 'Premium decor', 'Photography + Videography', 'Live band'], 'Active'),
    ('Elite Package', 'Wedding', 'Luxury wedding experience with white-glove service', 25000.00, 250, ARRAY['Premium venue', 'Michelin-trained catering', 'Bespoke decor', 'Professional photography+video', 'Live orchestra', 'Concierge service'], 'Active'),
    ('Custom Package', 'Wedding', 'Fully customizable wedding experience', 0.00, NULL, ARRAY['Tailored services', 'Personalized planning', 'Flexible budget'], 'Active'),
    ('Corporate Expo', 'Corporate', 'Professional event management', 8000.00, 300, ARRAY['Venue', 'Catering', 'AV setup', 'Branding'], 'Active'),
    ('Debut Celebration', 'Debut', 'Coming-of-age celebration for debutantes', 12000.00, 200, ARRAY['Venue', 'Catering', 'Dance floor', 'Photography', 'Entertainment'], 'Active'),
    ('Birthday Bash', 'Birthday', 'Fun and memorable birthday celebrations', 3000.00, 100, ARRAY['Venue', 'Catering', 'Decorations', 'Entertainment'], 'Active');

-- Insert Services
INSERT INTO services (service_name, description, category, base_price, status)
VALUES
    ('Premium Catering', 'Full-service catering with custom menu', 'Food & Beverage', 50.00, 'Active'),
    ('Live Band Performance', 'Professional live band for 4 hours', 'Entertainment', 2000.00, 'Active'),
    ('Professional Photography', 'Full-day photography coverage', 'Photography', 1500.00, 'Active'),
    ('Videography', 'Professional video with editing', 'Photography', 2000.00, 'Active'),
    ('Floral Arrangements', 'Custom floral designs and decor', 'Decoration', 1200.00, 'Active'),
    ('DJ Services', 'DJ with sound system for 6 hours', 'Entertainment', 800.00, 'Active'),
    ('Event Coordination', 'Day-of event coordination', 'Planning', 500.00, 'Active'),
    ('Lighting Design', 'Custom ambient and accent lighting', 'Decoration', 1000.00, 'Active');

-- Insert Bookings
INSERT INTO bookings (booking_reference, customer_id, package_id, event_date, event_time, event_type, venue_proposed, guest_count, total_price, status)
VALUES
    ('BK-001', 1, 2, '2026-04-15', '18:00:00', 'Wedding Reception', 'The Grand Ballroom', 150, 20000.00, 'Confirmed'),
    ('BK-002', 2, 1, '2026-05-20', '19:00:00', 'Wedding Reception', 'Riverside Gardens', 60, 8500.00, 'Pending'),
    ('BK-003', 3, 5, '2026-06-10', '09:00:00', 'Corporate Event', 'Convention Center', 250, 12000.00, 'Confirmed'),
    ('BK-004', 4, 6, '2026-07-25', '17:00:00', 'Debut', 'Elegance Hall', 180, 16500.00, 'Pending'),
    ('BK-005', 5, 7, '2026-03-30', '15:00:00', 'Birthday Bash', 'Community Center', 80, 5000.00, 'Processing');

-- Insert Booking Services
INSERT INTO booking_services (booking_id, service_id, quantity, price)
VALUES
    (1, 3, 1, 1500.00),
    (1, 4, 1, 2000.00),
    (1, 5, 1, 1200.00),
    (2, 2, 1, 2000.00),
    (2, 3, 1, 1500.00),
    (3, 1, 250, 50.00),
    (3, 6, 1, 800.00),
    (4, 5, 3, 400.00),
    (4, 2, 1, 2000.00),
    (5, 6, 1, 800.00);

-- Insert Messages
INSERT INTO messages (name, email, phone, message_subject, message_body, status)
VALUES
    ('Robert Williams', 'robert@email.com', '(+1) 555-234-5678', 'Wedding Inquiry', 'Hi, I would like to inquire about your wedding packages for August 2026. Could you send me more details?', 'Unread'),
    ('Lisa Martinez', 'lisa@email.com', '(+1) 555-345-6789', 'Corporate Event', 'We need catering for a corporate event with 200 guests. Can you provide a quote?', 'Read'),
    ('Michael Brown', 'michael@email.com', '(+44) 20-9876-5432', 'Debut Package Details', 'I am interested in the Debut package. What customization options are available?', 'Unread'),
    ('Angela Rodriguez', 'angela@email.com', '(+1) 555-456-7890', 'Special Request', 'We want a themed wedding. Do you offer custom decoration services?', 'Read');

-- Insert Pending Approvals
INSERT INTO pending_approvals (approval_type, related_booking_id, customer_name, description, status)
VALUES
    ('Package Modification', 1, 'Natasha Khaleira', 'Request to modify decor from traditional to minimalist style', 'Pending'),
    ('Payment Verification', 2, 'John Anderson', 'Payment received, awaiting final confirmation', 'Pending'),
    ('Venue Change', 4, 'Emma Thompson', 'Customer requesting alternative venue due to availability', 'Pending');

-- Insert Promo Codes
INSERT INTO promo_codes (code, discount_percentage, discount_amount, expiry_date, max_uses, status)
VALUES
    ('GALA10', 10.00, NULL, '2026-12-31', 100, 'Active'),
    ('SPRING20', 20.00, NULL, '2026-06-30', 50, 'Active'),
    ('EARLY2000', NULL, 2000.00, '2026-04-30', 25, 'Active'),
    ('LOYAL15', 15.00, NULL, '2026-12-31', 200, 'Active');

-- Insert Dashboard Metrics
INSERT INTO dashboard_metrics (metric_date, total_revenue, active_bookings, pending_approvals, registered_users)
VALUES
    ('2026-03-01', 42850.00, 156, 12, 1204),
    ('2026-03-02', 45200.00, 158, 11, 1210),
    ('2026-03-03', 48500.00, 160, 10, 1215),
    ('2026-03-17', 51200.00, 165, 8, 1248);

-- Insert Sample Reviews
INSERT INTO reviews (booking_id, customer_id, rating, comment)
VALUES
    (1, 1, 5, 'The wedding was magical! Everything was perfect.'),
    (3, 3, 4, 'Great corporate event. Highly professional.'),
    (5, 5, 5, 'Best birthday bash ever! The catering was amazing.');
