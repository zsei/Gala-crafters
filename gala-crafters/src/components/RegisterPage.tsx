import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, X } from 'lucide-react';
import { authService } from '../api/auth';
import './Auth.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        building_details: '',
        zip: '',
        city: '',
        barangay: '',
        phone: '+63 9',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Validation functions
    const validateName = (name: string) => {
        return /^[a-zA-Z\s]*$/.test(name);
    };

    const validateEmail = (email: string) => {
        return email.endsWith('@gmail.com');
    };

    const validatePassword = (password: string) => {
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        const isValidLength = password.length >= 8 && password.length <= 12;
        return hasNumber && hasSpecialChar && isValidLength;
    };

    const validatePhone = (phone: string) => {
        // Should be +63 9 + exactly 9 digits
        const phoneRegex = /^\+63 9\d{9}$/;
        return phoneRegex.test(phone);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Special handling for first_name and last_name - no numbers or special chars
        if (name === 'first_name' || name === 'last_name') {
            if (!validateName(value) && value !== '') {
                return; // Don't update if invalid
            }
        }

        // Special handling for phone
        if (name === 'phone') {
            // Only allow +63 9 followed by numbers
            let newValue = value;
            // Remove everything except digits
            const digitsOnly = value.replace(/\D/g, '');
            if (digitsOnly.length === 0) {
                newValue = '+63 9';
            } else if (digitsOnly.startsWith('639')) {
                const remaining = digitsOnly.slice(3);
                if (remaining.length <= 9) {
                    newValue = '+63 9' + remaining;
                } else {
                    newValue = '+63 9' + remaining.slice(0, 9);
                }
            }
            setFormData(prev => ({
                ...prev,
                [name]: newValue
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.first_name.trim()) {
            setError('First name is required');
            return false;
        }
        if (!validateName(formData.first_name)) {
            setError('First name cannot contain numbers or special characters');
            return false;
        }
        if (!formData.last_name.trim()) {
            setError('Last name is required');
            return false;
        }
        if (!validateName(formData.last_name)) {
            setError('Last name cannot contain numbers or special characters');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!validateEmail(formData.email)) {
            setError('Please use a valid Gmail address (@gmail.com)');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        if (!validatePassword(formData.password)) {
            setError('Password must be 8-12 characters with at least 1 number and 1 special character');
            return false;
        }
        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        if (!validatePhone(formData.phone)) {
            setError('Phone must be +63 9 followed by exactly 9 digits');
            return false;
        }
        if (!formData.city.trim()) {
            setError('City is required');
            return false;
        }
        if (!formData.barangay.trim()) {
            setError('Barangay is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        // Show terms modal instead of submitting directly
        setShowTermsModal(true);
    };

    const handleAgreeTerms = async () => {
        if (!termsChecked) {
            setError('You must agree to the terms and conditions');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authService.register({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
                building_details: formData.building_details || null,
                zip: formData.zip || null,
                city: formData.city,
                barangay: formData.barangay,
                phone: formData.phone,
            });
            
            // Redirect to login page
            navigate('/login');
        } catch (err: any) {
            const errorMessage = err.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            console.error('Registration error:', err);
            setShowTermsModal(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form-side">
                <div className="auth-container">
                    
                    <div className="auth-logo-header">
                        <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="20" r="12" stroke="#c49a2c" strokeWidth="2" />
                            <circle cx="24" cy="20" r="12" stroke="#c49a2c" strokeWidth="2" />
                        </svg>
                        Gala Crafters
                    </div>

                    <div className="auth-header">
                        <h2>Create Account</h2>
                        <p>Join us to start booking your perfect events.</p>
                    </div>

                    {error && <div className="auth-error" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                    <form className="auth-form register-form-grid" onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                            <div className="form-group">
                                <label>First Name</label>
                                <input 
                                    type="text" 
                                    name="first_name"
                                    placeholder="Enter first name" 
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input 
                                    type="text" 
                                    name="last_name"
                                    placeholder="Enter last name" 
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="example@gmail.com" 
                                    value={formData.email}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone #</label>
                                <input 
                                    type="text" 
                                    name="phone"
                                    placeholder="+63 9" 
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                            <div className="form-group">
                                <label>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password"
                                        placeholder="8-12 chars, 1 number, 1 special char" 
                                        value={formData.password}
                                        onChange={handleChange}
                                        required 
                                        style={{ width: '100%', paddingRight: '45px', boxSizing: 'border-box' }}
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

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        name="confirm_password"
                                        placeholder="••••••••••••" 
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        required 
                                        style={{ width: '100%', paddingRight: '45px', boxSizing: 'border-box' }}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                        {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                            <div className="form-group">
                                <label>City</label>
                                <input 
                                    type="text" 
                                    name="city"
                                    placeholder="" 
                                    value={formData.city}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Barangay</label>
                                <input 
                                    type="text" 
                                    name="barangay"
                                    placeholder="" 
                                    value={formData.barangay}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                            <div className="form-group">
                                <label>Building, Apartment, Floor, Unit (Optional)</label>
                                <input 
                                    type="text" 
                                    name="building_details"
                                    placeholder="" 
                                    value={formData.building_details}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Zip</label>
                                <input 
                                    type="text" 
                                    name="zip"
                                    placeholder="" 
                                    value={formData.zip}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn-primary" disabled={loading} style={{ marginTop: '10px', alignSelf: 'center', width: '200px' }}>
                            {loading ? 'Creating Account...' : 'Done'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Log In</Link>
                    </div>
                </div>
            </div>

            {/* Terms & Conditions Modal */}
            {showTermsModal && (
                <div className="modal-overlay">
                    <div className="modal-content terms-modal">
                        <div className="modal-header">
                            <h3>Terms and Conditions</h3>
                            <button 
                                className="modal-close-btn"
                                onClick={() => {
                                    setShowTermsModal(false);
                                    setTermsChecked(false);
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <h4>1. Introduction</h4>
                            <p>Welcome to Gala Crafters (hereafter referred to as "we"). By accessing and using this website, you agree to abide by the following terms and conditions. If you do not agree with any part, please do not use this website.</p>

                            <h4>2. Products and Services</h4>
                            <p>We offer a variety of products and services for event planning and management. All products have detailed descriptions, prices, and images. We strive to ensure that the information is accurate but do not guarantee that all information is entirely correct or up to date.</p>

                            <h4>3. Ordering and Payment</h4>
                            <p>By placing an order, you agree to provide accurate and complete information about yourself. We accept multiple forms of payment, including credit cards and bank transfers. All transactions will be processed in a secure environment.</p>

                            <h4>4. Shipping Policy</h4>
                            <p>We will process and prepare your order as soon as possible. Delivery timelines depend on your location and the nature of the service requested. We will notify you of any delays.</p>

                            <h4>5. User Accounts</h4>
                            <p>You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>

                            <h4>6. Intellectual Property Rights</h4>
                            <p>All content on this website, including text, graphics, logos, images, and software, is the property of Gala Crafters or its content suppliers and is protected by international copyright laws.</p>

                            <h4>7. Limitation of Liability</h4>
                            <p>Gala Crafters shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the materials or services on this website.</p>

                            <h4>8. Governing Law</h4>
                            <p>These terms and conditions are governed by and construed in accordance with the laws of the Philippines, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
                        </div>

                        <div className="modal-footer">
                            <label className="checkbox-label">
                                <input 
                                    type="checkbox"
                                    checked={termsChecked}
                                    onChange={(e) => setTermsChecked(e.target.checked)}
                                />
                                <span>I agree to the terms and conditions.</span>
                            </label>

                            <div className="modal-buttons">
                                <button 
                                    className="modal-btn cancel-btn"
                                    onClick={() => {
                                        setShowTermsModal(false);
                                        setTermsChecked(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className={`modal-btn agree-btn ${!termsChecked ? 'disabled' : ''}`}
                                    onClick={handleAgreeTerms}
                                    disabled={!termsChecked || loading}
                                >
                                    {loading ? 'Creating Account...' : 'Agree and Continue'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="auth-image-side"></div>
        </div>
    );
};

export default RegisterPage;
