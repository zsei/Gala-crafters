import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authService } from '../api/auth';
import './Auth.css';

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      if (!token) throw new Error('Invalid reset token');
      
      await authService.resetPassword(token, password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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

            <div className="auth-header" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <CheckCircle size={64} color="#4CAF50" />
              </div>
              <h2>Password Reset Successful</h2>
              <p>Your password has been updated. You can now log in with your new password.</p>
            </div>

            <Link to="/login" className="auth-btn-primary" style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
              Go to Login
            </Link>
          </div>
        </div>
        <div className="auth-image-side"></div>
      </div>
    );
  }

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
            <h2>Set New Password</h2>
            <p>Please enter your new password below.</p>
          </div>

          {error && <div className="auth-error" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••" 
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

            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="auth-btn-primary" disabled={loading}>
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="auth-footer">
            Remember your password? <Link to="/login">Log In</Link>
          </div>
        </div>
      </div>
      <div className="auth-image-side"></div>
    </div>
  );
};

export default ResetPasswordPage;
