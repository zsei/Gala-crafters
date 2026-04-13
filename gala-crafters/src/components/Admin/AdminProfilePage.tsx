import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Camera, Save, Loader2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { authService } from '../../api/auth';
import { API_BASE_URL } from '../../api/config';
import AdminSidebar from './AdminSidebar';
import './Admin.css';

const AdminProfilePage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: '',
    image_url: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAdminData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            role: data.role || '',
            status: data.status || '',
            image_url: data.image_url || ''
          });
        }
      } catch (err) {
        console.error('Error fetching admin profile:', err);
        setMessage({ type: 'error', text: 'Failed to load profile data.' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: adminData.name,
          phone: adminData.phone
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        // Update local storage if name changed
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin) {
          const admin = JSON.parse(storedAdmin);
          admin.name = adminData.name;
          localStorage.setItem('admin', JSON.stringify(admin));
        }
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.detail || 'Failed to update profile.' });
      }
    } catch (err) {
      console.error('Error updating admin profile:', err);
      setMessage({ type: 'error', text: 'A network error occurred.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/profile/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setAdminData(prev => ({ ...prev, image_url: data.url }));
        setMessage({ type: 'success', text: 'Profile picture updated!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to upload image.' });
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setMessage({ type: 'error', text: 'Network error during upload.' });
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/profile/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        })
      });

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setIsPasswordModalOpen(false), 2000);
      } else {
        const error = await response.json();
        setPasswordMessage({ type: 'error', text: error.detail || 'Failed to update password.' });
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordMessage({ type: 'error', text: 'Network error.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <main className={`admin-main ${isCollapsed ? 'collapsed-main' : ''}`}>
          <div className="admin-loading-container">
            <Loader2 className="animate-spin" size={40} color="#c49a2c" />
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      <main className={`admin-main ${isCollapsed ? 'collapsed-main' : ''}`}>
        <header className="admin-header">
          <div className="admin-header-text">
            <h1>Profile Settings</h1>
            <p>Manage your administrative account information</p>
          </div>
        </header>

        <div className="admin-profile-container">
          <div className="admin-card profile-card shadow-sm">
            <div className="profile-header-section">
              <div className="profile-avatar-wrapper">
                {adminData.image_url ? (
                  <img src={adminData.image_url} alt="Profile" className="profile-avatar-img" />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {adminData.name ? adminData.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                )}
                <label className="avatar-edit-btn" title="Change Avatar" style={{ cursor: 'pointer' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                </label>
              </div>
              <div className="profile-title-info">
                <h2>{adminData.name}</h2>
                <p className="profile-role-badge">{adminData.role.replace('_', ' ').toUpperCase()}</p>
              </div>
            </div>

            {message.text && (
              <div className={`admin-alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="admin-profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name" className="admin-label-badge">Full Name</label>
                  <div className="input-with-icon">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={adminData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="admin-label-badge">Email Address</label>
                  <div className="input-with-icon disabled">
                    <Mail size={18} className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={adminData.email}
                      disabled
                      title="Email cannot be changed"
                    />
                  </div>
                  <span className="form-help">Contact system administrator to change email.</span>
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="admin-label-badge">Phone Number</label>
                  <div className="input-with-icon">
                    <Phone size={18} className="input-icon" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={adminData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="role" className="admin-label-badge">Access Level</label>
                  <div className="input-with-icon disabled">
                    <Shield size={18} className="input-icon" />
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={adminData.role.replace('_', ' ').toUpperCase()}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="profile-form-footer">
                <button 
                  type="submit" 
                  className="admin-btn-gold"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="admin-card security-card mt-6 shadow-sm">
            <div className="card-header-with-icon">
              <Shield size={20} className="text-accent" />
              <h3>Security & Password</h3>
            </div>
            <p className="text-sub mb-4">Update your password regularly to keep your account secure.</p>
            <button className="admin-btn-outline" onClick={() => setIsPasswordModalOpen(true)}>
              Change Account Password
            </button>
          </div>
        </div>

        {isPasswordModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-content password-modal">
              <div className="modal-header">
                <h3>Change Password</h3>
                <button className="modal-close" onClick={() => setIsPasswordModalOpen(false)}><XCircle size={20} /></button>
              </div>
              <form onSubmit={handlePasswordChange}>
                {passwordMessage.text && (
                  <div className={`admin-alert ${passwordMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    {passwordMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{passwordMessage.text}</span>
                  </div>
                )}
                <div className="form-group">
                  <label className="admin-label-badge">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="admin-label-badge">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="admin-label-badge">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Repeat new password"
                    required
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="admin-btn-outline" onClick={() => setIsPasswordModalOpen(false)}>Cancel</button>
                  <button type="submit" className="admin-btn-gold" disabled={passwordSaving}>
                    {passwordSaving ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .admin-profile-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .admin-label-badge {
          display: inline-block;
          background-color: var(--admin-text-main);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        }
        
        .profile-card {
          padding: 32px;
        }
        
        .profile-header-section {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--admin-border);
        }
        
        .profile-avatar-wrapper {
          position: relative;
        }
        
        .profile-avatar-placeholder {
          width: 80px;
          height: 80px;
          background-color: var(--admin-accent);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(196, 154, 44, 0.2);
        }

        .profile-avatar-img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--admin-accent);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        
        .avatar-edit-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background-color: white;
          border: 1px solid var(--admin-border);
          color: var(--admin-text-main);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          transition: all 0.2s;
        }
        
        .avatar-edit-btn:hover {
          background-color: var(--admin-hover);
          color: var(--admin-accent);
          border-color: var(--admin-accent);
        }
        
        .profile-title-info h2 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          margin: 0 0 6px 0;
        }
        
        .profile-role-badge {
          display: inline-block;
          background-color: var(--admin-hover);
          color: var(--admin-accent);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }
        
        .admin-alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .alert-success {
          background-color: var(--admin-success-bg);
          color: var(--admin-success-text);
          border: 1px solid rgba(22, 101, 52, 0.1);
        }
        
        .alert-error {
          background-color: var(--admin-danger-bg);
          color: var(--admin-danger-text);
          border: 1px solid rgba(153, 27, 27, 0.1);
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--admin-text-sub);
          margin-bottom: 8px;
        }
        
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-icon {
          position: absolute;
          left: 12px;
          color: var(--admin-text-sub);
        }
        
        .input-with-icon input {
          width: 100%;
          padding: 12px 12px 12px 42px;
          background-color: white;
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          font-size: 14px;
          color: var(--admin-text-main);
          transition: all 0.2s;
        }
        
        .input-with-icon input:focus {
          border-color: var(--admin-accent);
          outline: none;
          box-shadow: 0 0 0 3px rgba(196, 154, 44, 0.05);
        }
        
        .input-with-icon.disabled input {
          background-color: var(--admin-bg);
          color: var(--admin-text-sub);
          cursor: not-allowed;
        }
        
        .form-help {
          display: block;
          font-size: 11px;
          color: var(--admin-text-sub);
          margin-top: 6px;
        }
        
        .profile-form-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid var(--admin-border);
        }
        
        .admin-btn-gold {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: var(--admin-accent);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .admin-btn-gold:hover:not(:disabled) {
          background-color: var(--admin-accent-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(196, 154, 44, 0.2);
        }
        
        .admin-btn-gold:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .admin-btn-outline {
          background: transparent;
          border: 1px solid var(--admin-border);
          color: var(--admin-text-main);
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .admin-btn-outline:hover {
          background-color: var(--admin-hover);
          border-color: var(--admin-accent);
          color: var(--admin-accent);
        }
        
        .card-header-with-icon {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .card-header-with-icon h3 {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          margin: 0;
        }
        
        .mt-6 { margin-top: 24px; }
        .mb-4 { margin-bottom: 16px; }
        .shadow-sm { box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        
        .admin-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          gap: 16px;
          color: var(--admin-text-sub);
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .admin-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(4px);
        }

        .password-modal {
          width: 100%;
          max-width: 450px;
          background-color: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--admin-border);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 0;
          border-bottom: none;
        }

        .modal-header h3 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: var(--admin-accent);
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          color: var(--admin-text-sub);
          cursor: pointer;
          transition: color 0.2s;
        }

        .modal-close:hover {
          color: #ef4444;
        }

        .password-modal .form-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .password-modal .form-group .admin-label-badge {
          background-color: var(--admin-text-main);
          margin-bottom: 8px;
        }

        .password-modal input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--admin-border);
          font-family: inherit;
          font-size: 14px;
          background-color: white;
        }

        .modal-footer {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 32px;
          padding-top: 0;
          border-top: none;
        }

        .modal-footer button {
          width: 100%;
          padding: 12px;
          justify-content: center;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default AdminProfilePage;
