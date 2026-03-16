import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);

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
                    
                    {/* Elegant Logo */}
                    <div className="auth-logo-header">
                        <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="20" r="12" stroke="#c49a2c" strokeWidth="2" />
                            <circle cx="24" cy="20" r="12" stroke="#c49a2c" strokeWidth="2" />
                        </svg>
                        Gala Crafters
                    </div>

                    <div className="auth-header">
                        <h2>Join the Elite</h2>
                        <p>Create your account to design unforgettable moments.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="" required />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="" required />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" placeholder="" required />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••••••" 
                                    required 
                                    style={{ width: '100%', paddingRight: '45px' }}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ 
                                        position: 'absolute', 
                                        right: '15px', 
                                        top: '50%', 
                                        transform: 'translateY(-50%)', 
                                        background: 'none', 
                                        border: 'none', 
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: 0
                                    }}
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
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
