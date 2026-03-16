-- ============================================================================
-- GALA CRAFTERS CRM DATABASE SCHEMA AND QUERIES
-- ============================================================================

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- Users Table (Customers)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    country VARCHAR(100),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    status VARCHAR(50) DEFAULT 'Active',
    user_role VARCHAR(50) DEFAULT 'Customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users Table
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

-- Event Packages Table
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

-- Services Table
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

-- Bookings Table (Enhanced)
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

-- Booking Services Junction Table (Many-to-Many)
CREATE TABLE booking_services (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(10, 2),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Messages/Inquiries Table
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

-- Admin Messages/Chat Table
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

-- Pending Approvals Table
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

-- Promo Codes Table
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

-- Admin Dashboard Metrics Table (for historical tracking)
CREATE TABLE dashboard_metrics (
    id SERIAL PRIMARY KEY,
    metric_date DATE NOT NULL,
    total_revenue DECIMAL(12, 2),
    active_bookings INT,
    pending_approvals INT,
    registered_users INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. INSERT SAMPLE DATA
-- ============================================================================

-- Insert Sample Users (Customers)
INSERT INTO users (first_name, middle_name, last_name, email, phone, password, date_of_birth, country, city, postal_code, user_role)
VALUES
    ('Natasha', '', 'Khaleira', 'natasha.khaleira@email.com', '(+62) 821 2554-5846', 'hashed_password_123', '1990-12-10', 'United Kingdom', 'Leeds', 'ERT 1254', 'Customer'),
    ('John', 'Michael', 'Anderson', 'john.anderson@email.com', '(+1) 555-123-4567', 'hashed_password_456', '1995-06-15', 'United States', 'New York', '10001', 'Customer'),
    ('Sarah', 'Elizabeth', 'Jenkins', 'sarah.jenkins@email.com', '(+44) 20-7946-0958', 'hashed_password_789', '1992-03-22', 'United Kingdom', 'London', 'SW1A 1AA', 'Customer'),
    ('Emma', 'Jane', 'Thompson', 'emma.thompson@email.com', '(+1) 555-987-6543', 'hashed_password_012', '1998-09-08', 'United States', 'Los Angeles', '90001', 'Customer'),
    ('Marcus', 'David', 'Chen', 'marcus.chen@email.com', '(+65) 6789-1234', 'hashed_password_345', '1994-11-30', 'Singapore', 'Singapore', '188024', 'Customer');

-- Insert Sample Admin Users
INSERT INTO admin_users (name, email, phone, role, status)
VALUES
    ('Alexander Sterling', 'a.sterling@gala.com', '+1 (555) 902-1244', 'Executive Admin', 'Active'),
    ('Eleanor Rhodes', 'e.rhodes@gala.com', '+1 (555) 438-9901', 'Compliance Officer', 'Active'),
    ('Julian Thorne', 'j.thorne@gala.com', '+1 (555) 212-0092', 'Security Lead', 'Online'),
    ('Beatrice Vance', 'b.vance@gala.com', '+1 (555) 771-3342', 'Support Manager', 'Away');

-- Insert Sample Event Packages
INSERT INTO event_packages (package_name, event_type, description, base_price, max_guests, features)
VALUES
    ('Intimate Package', 'Wedding', 'Perfect for small, intimate weddings', 5000.00, 50, ARRAY['Venue coordination', 'Catering for 50 guests', 'Basic decor', 'Photography']),
    ('Utopian Package', 'Wedding', 'Comprehensive wedding package with premium services', 15000.00, 150, ARRAY['Venue', 'Four-course catering', 'Premium decor', 'Photography + Videography', 'Live band']),
    ('Elite Package', 'Wedding', 'Luxury wedding experience with white-glove service', 25000.00, 250, ARRAY['Premium venue', 'Michelin-trained catering', 'Bespoke decor', 'Professional photography+video', 'Live orchestra', 'Concierge service']),
    ('Custom Package', 'Wedding', 'Fully customizable wedding experience', 0.00, NULL, ARRAY['Tailored services', 'Personalized planning', 'Flexible budget']),
    ('Corporate Expo', 'Corporate', 'Professional event management', 8000.00, 300, ARRAY['Venue', 'Catering', 'AV setup', 'Branding']),
    ('Debut Celebration', 'Debut', 'Coming-of-age celebration for debutantes', 12000.00, 200, ARRAY['Venue', 'Catering', 'Dance floor', 'Photography', 'Entertainment']),
    ('Birthday Bash', 'Birthday', 'Fun and memorable birthday celebrations', 3000.00, 100, ARRAY['Venue', 'Catering', 'Decorations', 'Entertainment']);

-- Insert Sample Services
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

-- Insert Sample Bookings
INSERT INTO bookings (booking_reference, customer_id, package_id, event_date, event_time, event_type, venue_proposed, guest_count, total_price, status)
VALUES
    ('BK-001', 1, 2, '2026-04-15', '18:00:00', 'Wedding Reception', 'The Grand Ballroom', 150, 20000.00, 'Confirmed'),
    ('BK-002', 2, 1, '2026-05-20', '19:00:00', 'Wedding Reception', 'Riverside Gardens', 60, 8500.00, 'Pending'),
    ('BK-003', 3, 5, '2026-06-10', '09:00:00', 'Corporate Event', 'Convention Center', 250, 12000.00, 'Confirmed'),
    ('BK-004', 4, 6, '2026-07-25', '17:00:00', 'Debut', 'Elegance Hall', 180, 16500.00, 'Pending'),
    ('BK-005', 5, 7, '2026-03-30', '15:00:00', 'Birthday Bash', 'Community Center', 80, 5000.00, 'Processing');

-- Insert Booking Services (linking bookings with additional services)
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

-- Insert Sample Messages
INSERT INTO messages (name, email, phone, message_subject, message_body, status)
VALUES
    ('Robert Williams', 'robert@email.com', '(+1) 555-234-5678', 'Wedding Inquiry', 'Hi, I would like to inquire about your wedding packages for August 2026. Could you send me more details?', 'Unread'),
    ('Lisa Martinez', 'lisa@email.com', '(+1) 555-345-6789', 'Corporate Event', 'We need catering for a corporate event with 200 guests. Can you provide a quote?', 'Read'),
    ('Michael Brown', 'michael@email.com', '(+44) 20-9876-5432', 'Debut Package Details', 'I''m interested in the Debut package. What customization options are available?', 'Unread'),
    ('Angela Rodriguez', 'angela@email.com', '(+1) 555-456-7890', 'Special Request', 'We want a themed wedding. Do you offer custom decoration services?', 'Read');

-- Insert Sample Pending Approvals
INSERT INTO pending_approvals (approval_type, related_booking_id, customer_name, description, status)
VALUES
    ('Package Modification', 1, 'Natasha Khaleira', 'Request to modify decor from traditional to minimalist style', 'Pending'),
    ('Payment Verification', 2, 'John Anderson', 'Payment received, awaiting final confirmation', 'Pending'),
    ('Venue Change', 4, 'Emma Thompson', 'Customer requesting alternative venue due to availability', 'Pending');

-- Insert Sample Promo Codes
INSERT INTO promo_codes (code, discount_percentage, discount_amount, expiry_date, max_uses, status)
VALUES
    ('GALA10', 10.00, NULL, '2026-12-31', 100, 'Active'),
    ('SPRING20', 20.00, NULL, '2026-06-30', 50, 'Active'),
    ('EARLY2000', NULL, 2000.00, '2026-04-30', 25, 'Active'),
    ('LOYAL15', 15.00, NULL, '2026-12-31', 200, 'Active');

-- Insert Sample Dashboard Metrics
INSERT INTO dashboard_metrics (metric_date, total_revenue, active_bookings, pending_approvals, registered_users)
VALUES
    ('2026-03-01', 42850.00, 156, 12, 1204),
    ('2026-03-02', 45200.00, 158, 11, 1210),
    ('2026-03-03', 48500.00, 160, 10, 1215),
    ('2026-03-17', 51200.00, 165, 8, 1248);

-- ============================================================================
-- 3. COMMON SELECT QUERIES
-- ============================================================================

-- Query 1: Get all active bookings with customer details
SELECT 
    b.booking_reference,
    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
    u.email,
    u.phone,
    ep.package_name,
    b.event_date,
    b.event_time,
    b.venue_proposed,
    b.guest_count,
    b.total_price,
    b.status
FROM bookings b
INNER JOIN users u ON b.customer_id = u.id
INNER JOIN event_packages ep ON b.package_id = ep.id
WHERE b.status IN ('Confirmed', 'Processing')
ORDER BY b.event_date ASC;

-- Query 2: Get recent messages
SELECT 
    id,
    name,
    email,
    message_subject,
    message_body,
    status,
    created_at
FROM messages
WHERE status = 'Unread'
ORDER BY created_at DESC
LIMIT 10;

-- Query 3: Get all pending approvals
SELECT 
    id,
    approval_type,
    customer_name,
    description,
    status,
    created_at
FROM pending_approvals
WHERE status = 'Pending'
ORDER BY created_at DESC;

-- Query 4: Get booking details with all services
SELECT 
    b.booking_reference,
    CONCAT(u.first_name, ' ', u.last_name) AS customer_name,
    ep.package_name,
    ep.base_price AS package_price,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'service_name', s.service_name,
            'quantity', bs.quantity,
            'price', bs.price
        )
    ) AS additional_services,
    b.total_price,
    b.status
FROM bookings b
INNER JOIN users u ON b.customer_id = u.id
INNER JOIN event_packages ep ON b.package_id = ep.id
LEFT JOIN booking_services bs ON b.id = bs.booking_id
LEFT JOIN services s ON bs.service_id = s.id
WHERE b.id = 1
GROUP BY b.id, u.id, ep.id;

-- Query 5: Dashboard overview - Key metrics
SELECT 
    (SELECT COUNT(*) FROM bookings WHERE status = 'Confirmed' OR status = 'Processing') AS active_bookings,
    (SELECT COUNT(*) FROM pending_approvals WHERE status = 'Pending') AS pending_approvals,
    (SELECT COUNT(*) FROM users WHERE user_role = 'Customer') AS total_customers,
    (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE EXTRACT(MONTH FROM event_date) = EXTRACT(MONTH FROM CURRENT_DATE)) AS monthly_revenue;

-- Query 6: Get all admin users
SELECT 
    id,
    name,
    email,
    phone,
    role,
    status,
    created_at
FROM admin_users
WHERE status = 'Active'
ORDER BY name;

-- Query 7: Monthly revenue report
SELECT 
    DATE_TRUNC('month', b.event_date) AS month,
    SUM(b.total_price) AS total_revenue,
    COUNT(b.id) AS total_bookings,
    AVG(b.total_price) AS average_booking_value
FROM bookings b
WHERE b.status IN ('Confirmed', 'Processing', 'Completed')
GROUP BY DATE_TRUNC('month', b.event_date)
ORDER BY month DESC;

-- Query 8: Customer booking history
SELECT 
    b.booking_reference,
    ep.package_name,
    b.event_date,
    b.total_price,
    b.status
FROM bookings b
INNER JOIN event_packages ep ON b.package_id = ep.id
WHERE b.customer_id = 1
ORDER BY b.created_at DESC;

-- Query 9: Available event packages
SELECT 
    id,
    package_name,
    event_type,
    description,
    base_price,
    max_guests
FROM event_packages
WHERE status = 'Active'
ORDER BY base_price ASC;

-- Query 10: Get conversations for admin messages
SELECT 
    conversation_id,
    sender_name,
    sender_email,
    MAX(message_date) AS last_message_time,
    COUNT(*) AS message_count,
    SUM(CASE WHEN is_read = FALSE THEN 1 ELSE 0 END) AS unread_count
FROM admin_messages
GROUP BY conversation_id, sender_name, sender_email
ORDER BY MAX(message_date) DESC;

-- ============================================================================
-- 4. AUTHENTICATION & UPDATE QUERIES
-- ============================================================================

-- Query 11: User login verification
SELECT id, first_name, email, user_role
FROM users
WHERE email = 'natasha.khaleira@email.com' AND password = 'hashed_password_123';

-- Query 12: Update booking status
UPDATE bookings
SET status = 'Confirmed', updated_at = CURRENT_TIMESTAMP
WHERE booking_reference = 'BK-001';

-- Query 13: Mark message as read
UPDATE messages
SET status = 'Read', updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Query 14: Create new booking (example insert)
INSERT INTO bookings (booking_reference, customer_id, package_id, event_date, event_time, event_type, guest_count, total_price, status)
VALUES ('BK-999', 3, 2, '2026-08-15', '19:00:00', 'Wedding Reception', 120, 18500.00, 'Pending');

-- Query 15: Update customer profile
UPDATE users
SET city = 'Manchester', postal_code = 'M1 1AW', updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- ============================================================================
-- 5. REPORTING QUERIES
-- ============================================================================

-- Query 16: Top performing packages
SELECT 
    ep.package_name,
    ep.event_type,
    COUNT(b.id) AS bookings_count,
    SUM(b.total_price) AS total_revenue,
    AVG(b.total_price) AS average_value
FROM bookings b
INNER JOIN event_packages ep ON b.package_id = ep.id
WHERE b.status != 'Cancelled'
GROUP BY ep.id, ep.package_name, ep.event_type
ORDER BY total_revenue DESC;

-- Query 17: Customer acquisition over time
SELECT 
    DATE_TRUNC('month', created_at) AS registration_month,
    COUNT(*) AS new_customers,
    COUNT(*) OVER (ORDER BY DATE_TRUNC('month', created_at)) AS cumulative_customers
FROM users
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY registration_month;

-- Query 18: Booking status distribution
SELECT 
    status,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
FROM bookings
GROUP BY status;

-- Query 19: Most used additional services
SELECT 
    s.service_name,
    COUNT(bs.id) AS times_used,
    SUM(bs.price) AS total_revenue,
    AVG(bs.price) AS average_price
FROM services s
LEFT JOIN booking_services bs ON s.id = bs.service_id
WHERE s.status = 'Active'
GROUP BY s.id, s.service_name
ORDER BY times_used DESC;

-- Query 20: Promo code effectiveness
SELECT 
    code,
    discount_percentage,
    discount_amount,
    current_uses,
    max_uses,
    ROUND((current_uses * 100.0 / NULLIF(max_uses, 0)), 2) AS usage_percentage,
    status
FROM promo_codes
ORDER BY current_uses DESC;
