import React, { useEffect } from 'react';

const TermsAndConditions = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="terms-page-wrapper" style={{ padding: '120px 0', backgroundColor: '#fcfbf9', minHeight: '100vh' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', padding: '60px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: '42px', color: '#c49a2c', marginBottom: '30px', textAlign: 'center' }}>Terms and Conditions</h1>
                <div className="gold-line" style={{ margin: '0 auto 40px auto' }}></div>
                
                <div className="terms-content" style={{ color: '#555', lineHeight: '1.8', fontSize: '15px' }}>
                    <p style={{ marginBottom: '20px' }}>
                        Welcome to Gala Crafters. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions of use.
                    </p>

                    <h3 style={{ color: '#c49a2c', margin: '30px 0 15px 0' }}>1. Service Agreement</h3>
                    <p>
                        Gala Crafters provides professional catering and event styling services. All bookings are subject to availability and formal confirmation via our reservation system.
                    </p>

                    <h3 style={{ color: '#c49a2c', margin: '30px 0 15px 0' }}>2. Booking & Payments</h3>
                    <p>
                        A deposit is required to secure your event date. Full payment must be settled according to the payment schedule outlined in your specific package agreement.
                    </p>

                    <h3 style={{ color: '#c49a2c', margin: '30px 0 15px 0' }}>3. Cancellations</h3>
                    <p>
                        Cancellations must be made in writing. Refund eligibility depends on the timeframe of the cancellation relative to the event date.
                    </p>

                    <h3 style={{ color: '#c49a2c', margin: '30px 0 15px 0' }}>4. Event Logistics</h3>
                    <p>
                        Clients are responsible for ensuring the venue allows catering and has necessary permits. Gala Crafters will coordinate logistics as specified in the chosen package.
                    </p>

                    <h3 style={{ color: '#c49a2c', margin: '30px 0 15px 0' }}>5. Limitation of Liability</h3>
                    <p>
                        Gala Crafters is not liable for failures due to circumstances beyond our reasonable control, including but not limited to natural disasters, government restrictions, or venue issues.
                    </p>

                    <p style={{ marginTop: '40px', fontStyle: 'italic', textAlign: 'center' }}>
                        Last Updated: April 2026
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
