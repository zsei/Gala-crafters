import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { authService } from '../../api/auth';
import '../Auth.css';
import './Admin.css';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        // If already logged in as admin, redirect to dashboard
        const admin = authService.getStoredAdmin();
        if (admin) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.adminLogin(email, password);
            console.log('Admin login successful:', response.admin);
            navigate('/admin');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
            console.error('Admin login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-layout admin-dark-theme">
            <div className="admin-login-container">
                <div className="admin-login-card">
                    <div className="admin-login-header">
                        <div className="admin-login-icon">
                            <ShieldCheck size={32} color="#c49a2c" />
                        </div>
                        <h1>Gala Crafters</h1>
                        <p>Administrative Access Control</p>
                    </div>

                    {error && (
                        <div className="admin-login-error">
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="admin-login-form" onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Admin Email</label>
                            <div className="admin-input-wrapper">
                                <Mail size={18} className="input-icon" />
                                <input 
                                    type="email" 
                                    placeholder="admin@gala.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>Password</label>
                            <div className="admin-input-wrapper">
                                <Lock size={18} className="input-icon" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                                <button 
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="admin-login-btn" 
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Secure Authorization'}
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <p>Authorized personnel only. All access attempts are logged.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
