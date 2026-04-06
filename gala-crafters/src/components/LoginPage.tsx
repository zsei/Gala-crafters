import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { authService } from '../api/auth';
import './Auth.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotMessage, setForgotMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        // Check for remembered email
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Call backend login API
            const response = await authService.login(email, password);
            console.log('Login successful:', response.user);

            // Handle Remember Me
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Redirect to home page
            navigate('/');
        } catch (err: any) {
            const errorMessage = err.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setForgotMessage('');
        setLoading(true);

        try {
            const response = await authService.forgotPassword(email);
            setForgotMessage(response.message || 'If an account exists with this email, a password reset link has been sent.');
        } catch (err: any) {
            setError(err.message || 'Failed to send password reset request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form-side">
                <div className="auth-container">

                    <Link to="/" className="back-to-home">
                        <ArrowLeft size={16} />
                        BACK TO HOME
                    </Link>
                    <div className="auth-logo-header">
                        Gala Crafters
                    </div>

                    <div className="auth-header">
                        <h2>Welcome Back</h2>
                        <p>Access your curated event management dashboard.</p>
                    </div>

                    {error && <div className="auth-error" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
                    {forgotMessage && <div className="auth-success" style={{ color: 'green', marginBottom: '15px' }}>{forgotMessage}</div>}

                    {isForgotPassword ? (
                        <form className="auth-form" onSubmit={handleForgotPassword}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="auth-btn-primary" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                <button
                                    type="button"
                                    onClick={() => { setIsForgotPassword(false); setError(''); setForgotMessage(''); }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#c49a2c', // Primary color
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        fontSize: '14px'
                                    }}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder=""
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder=""
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

                            <div className="login-options">
                                <label className="remember-me">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>
                                    Remember Me
                                </label>
                                <button
                                    type="button"
                                    className="auth-link"
                                    onClick={() => { setIsForgotPassword(true); setError(''); setForgotMessage(''); }}
                                    style={{
                                        alignSelf: 'flex-end',
                                        fontSize: '13px',
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <button type="submit" className="auth-btn-primary" disabled={loading}>
                                {loading ? 'Logging in...' : 'Log In'}
                            </button>
                        </form>
                    )}

                    <div className="auth-footer">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </div>
            </div>

            <div className="auth-image-side"></div>
        </div>
    );
};

export default LoginPage;
