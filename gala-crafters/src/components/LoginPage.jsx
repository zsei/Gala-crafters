import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        // Hardcoded credentials for testing since there's no database yet
        if (email === 'testuser@gmail.com' && password === 'password123') {
            navigate('/');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form-side">
                <div className="auth-container">
                    
                    <div className="auth-logo-header">
                        <div className="diamond"></div>
                        Gala Crafters
                    </div>

                    <div className="auth-header">
                        <h2>Welcome Back</h2>
                        <p>Access your curated event management dashboard.</p>
                    </div>

                    {error && <div className="auth-error" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                placeholder="eleanor.v@email.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>

                        <Link to="#" className="auth-link" style={{ alignSelf: 'flex-end', fontSize: '13px' }}>
                            Forgot Password?
                        </Link>

                        <button type="submit" className="auth-btn-primary">
                            Log In
                        </button>
                    </form>

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
