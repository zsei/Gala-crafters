import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, X, ArrowLeft, Check } from 'lucide-react';
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
        phone: '+63 9 | ',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);
    const [hasReadTerms, setHasReadTerms] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0); // This will now be 0-100 percentage
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        // Explicitly clear any stale form data on mount
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
            building_details: '',
            zip: '',
            city: '',
            barangay: '',
            phone: '',
        });
    }, []);

    // Validation functions
    const validateName = (name: string) => {
        return /^[a-zA-Z\s]*$/.test(name);
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password: string) => {
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        const isValidLength = password.length >= 8 && password.length <= 12;
        return hasNumber && hasSpecialChar && isValidLength;
    };

    const validatePhone = (phone: string) => {
        return phone.length === 9;
    };

    const calculateStrength = (password: string) => {
        if (!password) return 0;
        
        let percentage = 0;
        
        // 1. Length Progress (Max 33%)
        // We give progress for each character up to 8
        const lengthScore = Math.min(password.length, 8) / 8 * 33;
        percentage += lengthScore;
        
        // 2. Number Requirement (33%)
        if (/\d/.test(password)) {
            percentage += 33;
        }
        
        // 3. Special Character Requirement (34%)
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            percentage += 34;
        }
        
        return Math.min(percentage, 100);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Special handling for first_name and last_name - no numbers or special chars, max 30
        if (name === 'first_name' || name === 'last_name') {
            const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
            if (filteredValue.length <= 30) {
                setFormData(prev => ({
                    ...prev,
                    [name]: filteredValue
                }));
            }
            return;
        }

        // Special handling for phone
        if (name === 'phone') {
            const digitsOnly = value.replace(/\D/g, '');
            if (digitsOnly.length <= 9) {
                setFormData(prev => ({
                    ...prev,
                    phone: digitsOnly
                }));
            }
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password') {
            setPasswordStrength(calculateStrength(value));
        }
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
            setError('Please enter a valid email address');
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
            setError('Phone must be exactly 9 digits after +63 9');
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

        if (!termsChecked) {
            setError('Please agree to the Terms and Conditions');
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
                phone: '+63 9' + formData.phone,
            });
            
            // Redirect to login page and prevent going back to a filled signup form
            navigate('/login', { replace: true });
        } catch (err: any) {
            const errorMessage = err.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenTerms = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowTermsModal(true);
        setHasReadTerms(true);
    };

    return (
        <div className="auth-page">
            <div className="auth-form-side">
                <div className="auth-container">
                    
                    <Link to="/login" className="back-to-home">
                        <ArrowLeft size={16} />
                        BACK TO LOGIN
                    </Link>
                    <div className="auth-logo-header">
                        Gala Crafters
                    </div>

                    <div className="auth-header">
                        <h2>Create Account</h2>
                        <p>Join us to start booking your perfect events.</p>
                    </div>

                    {error && <div className="auth-error" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                    <form className="auth-form register-form-grid" onSubmit={handleSubmit} autoComplete="off">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                            <div className="form-group">
                                <label>First Name</label>
                                <input 
                                    type="text" 
                                    name="first_name"
                                    placeholder="Enter first name" 
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required 
                                    maxLength={30}
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
                                    autoComplete="off"
                                    required 
                                    maxLength={30}
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
                                    autoComplete="off"
                                    required 
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <div className="phone-input-wrapper" style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    padding: '0 15px'
                                }}>
                                    <span className="phone-prefix" style={{ color: '#c49a2c', fontWeight: 'bold', marginRight: '5px' }}>+63 9</span>
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        placeholder="XXXXXXXXX" 
                                        value={formData.phone}
                                        onChange={handleChange}
                                        autoComplete="off"
                                        required 
                                        style={{ 
                                            border: 'none', 
                                            background: 'transparent', 
                                            padding: '12px 0',
                                            color: '#ffffff',
                                            outline: 'none',
                                            width: '100%',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                            <div className="form-group">
                                <label>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password"
                                        placeholder="••••••••••••" 
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
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
                                    </button>
                                </div>
                                {formData.password && (
                                    <div className="password-strength-container">
                                        <div className="strength-meter">
                                            <div 
                                                className={`strength-bar ${
                                                    passwordStrength < 40 ? 'bar-weak' : 
                                                    passwordStrength < 80 ? 'bar-medium' : 'bar-strong'
                                                }`} 
                                                style={{ width: `${passwordStrength}%` }}
                                            ></div>
                                        </div>
                                        <span className={`strength-label ${
                                            passwordStrength < 40 ? 'label-weak' : 
                                            passwordStrength < 80 ? 'label-medium' : 'label-strong'
                                        }`}>
                                            {passwordStrength < 25 && "very weak"}
                                            {passwordStrength >= 25 && passwordStrength < 50 && "weak"}
                                            {passwordStrength >= 50 && passwordStrength < 85 && "medium"}
                                            {passwordStrength >= 85 && "strong"}
                                        </span>
                                    </div>
                                )}

                                {formData.password && (
                                    <div className="password-requirements">
                                        <div className={`requirement-item ${formData.password.length >= 8 ? 'met' : ''}`}>
                                            <div className="check-outer">
                                                <Check size={12} className="check-icon" />
                                            </div>
                                            <span>At least 8 characters</span>
                                        </div>
                                        <div className={`requirement-item ${/\d/.test(formData.password) ? 'met' : ''}`}>
                                            <div className="check-outer">
                                                <Check size={12} className="check-icon" />
                                            </div>
                                            <span>Includes a number</span>
                                        </div>
                                        <div className={`requirement-item ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'met' : ''}`}>
                                            <div className="check-outer">
                                                <Check size={12} className="check-icon" />
                                            </div>
                                            <span>Includes a symbol</span>
                                        </div>
                                    </div>
                                )}
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
                                        autoComplete="new-password"
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
                                    autoComplete="off"
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
                                    autoComplete="off"
                                    required 
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                            <div className="form-group">
                                <label>Street Name, Building, etc. (Optional)</label>
                                <input 
                                    type="text" 
                                    name="building_details"
                                    placeholder="e.g. Street name, Building Name, Floor" 
                                    value={formData.building_details}
                                    onChange={handleChange}
                                    autoComplete="off"
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
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="form-info-text">
                            By signing up, you agree to our <a href="#" onClick={handleOpenTerms}>Terms of Service</a>
                        </div>

                        <button 
                            type="submit" 
                            className={`auth-btn-primary ${(!termsChecked || loading) ? 'disabled' : ''}`} 
                            disabled={loading || !termsChecked} 
                            style={{ marginTop: '10px', alignSelf: 'center', width: '200px' }}
                        >
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

                            <div style={{ marginTop: '25px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px' }}>
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox"
                                        checked={termsChecked}
                                        onChange={(e) => setTermsChecked(e.target.checked)}
                                    />
                                    <span>I have read and agree to the Terms and Conditions</span>
                                </label>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="modal-buttons">
                                <button 
                                    className="modal-btn agree-btn"
                                    onClick={() => setShowTermsModal(false)}
                                >
                                    Close
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
