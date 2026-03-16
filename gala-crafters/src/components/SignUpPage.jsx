import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const SignUpPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sign up submitted");
    };

    return (
        <div className="auth-page">
            <div className="auth-form-side">
                <div className="auth-container">
                    
                    {/* Mockup Logo */}
                    <div className="auth-logo-header">
                        <div className="diamond"></div>
                        Gala Crafters
                    </div>

                    <div className="auth-header">
                        <h2>Join the Elite</h2>
                        <p>Create your account to design unforgettable moments.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="Eleanor Vance" required />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="eleanor.v@email.com" required />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" placeholder="+1 555-0199" required />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="••••••••••••" required />
                        </div>

                        <div className="auth-checkbox-group">
                            <input type="checkbox" id="terms" required />
                            <label htmlFor="terms">
                                I agree to the <Link to="#">Terms of Service</Link> & <Link to="#">Privacy Policy</Link>
                            </label>
                        </div>

                        <button type="submit" className="auth-btn-primary">
                            Create Account
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Log In</Link>
                    </div>
                </div>
            </div>

            {/* Right Side Image */}
            <div className="auth-image-side"></div>
        </div>
    );
};

export default SignUpPage;
