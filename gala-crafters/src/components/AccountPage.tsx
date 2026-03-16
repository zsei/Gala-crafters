import React, { useEffect, useState } from 'react';
import { Camera, Edit2, X, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth';
import './AccountPage.css';

const AccountPage = () => {
  const [isEditPersonalOpen, setIsEditPersonalOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user is logged in
    if (!authService.isLoggedIn()) {
      navigate('/login');
      return;
    }

    // Get user data from localStorage
    const userData = authService.getStoredUser();
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (!user) {
    return <div style={{ padding: '20px' }}>Please log in to view your profile</div>;
  }

  return (
    <div className="account-layout">
      
      <div className="account-page-wrapper">
        <div className="account-container">
          
          <h1 className="page-main-title">My Profile</h1>

          {/* CARD 1: Profile Header */}
          <div className="profile-card profile-header-card">
            <div className="avatar-section">
              <div className="avatar-wrapper">
                {user.profile_picture ? (
                  <img 
                    src={user.profile_picture}
                    alt={`${user.first_name} ${user.last_name}`} 
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                  </div>
                )}
                <button className="camera-btn" aria-label="Change Avatar">
                  <Camera size={14} />
                </button>
              </div>
              <div className="avatar-info">
                <h2 className="user-name">{user.first_name} {user.last_name}</h2>
                <div className="user-role-label">{user.role}</div>
                <div className="user-location">{user.city}, {user.country}</div>
              </div>
            </div>
          </div>

          {/* CARD 2: Personal Information */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">Personal Information</h2>
              <button className="edit-btn-primary" onClick={() => setIsEditPersonalOpen(true)}>
                Edit <Edit2 size={14} className="edit-icon" />
              </button>
            </div>
            
            <div className="info-grid personal-grid">
              
              <div className="info-item">
                <div className="info-label">First Name</div>
                <div className="info-value">{user.first_name}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Last Name</div>
                <div className="info-value">{user.last_name}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Email Address</div>
                <div className="info-value">{user.email}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Phone Number</div>
                <div className="info-value">{user.phone}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">User Role</div>
                <div className="info-value">{user.role || user.user_role}</div>
              </div>

            </div>
          </div>

          {/* CARD 3: Address */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">Address</h2>
              <button className="edit-btn-secondary" onClick={() => setIsEditAddressOpen(true)}>
                Edit <Edit2 size={14} className="edit-icon" />
              </button>
            </div>
            
            <div className="info-grid address-grid">
              
              <div className="info-item">
                <div className="info-label">Country</div>
                <div className="info-value">{user.country || 'Not provided'}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">City</div>
                <div className="info-value">{user.city || 'Not provided'}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Postal Code</div>
                <div className="info-value">{user.postal_code || 'Not provided'}</div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Edit Personal Info Modal */}
      {isEditPersonalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Edit Personal Information</h2>
              <button className="modal-close-btn" onClick={() => setIsEditPersonalOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-form-grid">
                <div className="modal-form-field">
                  <label>First Name</label>
                  <input type="text" defaultValue="Natashia" />
                </div>
                <div className="modal-form-field">
                  <label>Last Name</label>
                  <input type="text" defaultValue="Khaleira" />
                </div>
                <div className="modal-form-field full-width">
                  <label>Email Address</label>
                  <input type="email" defaultValue="info@binary-fusion.com" />
                </div>
                <div className="modal-form-field full-width">
                  <label>Phone Number</label>
                  <input type="tel" defaultValue="(+62) 821 2554-5846" />
                </div>
                <div className="modal-form-field full-width">
                  <label>Date of Birth</label>
                  <div className="input-with-icon">
                    <input type="text" defaultValue="12/10/1990" />
                    <Lock size={14} className="input-lock-icon" />
                  </div>
                </div>
                <div className="modal-form-field full-width">
                  <label>User Role</label>
                  <select defaultValue="Admin" className="custom-select">
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-save-btn" onClick={() => setIsEditPersonalOpen(false)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {isEditAddressOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Edit Address</h2>
              <button className="modal-close-btn" onClick={() => setIsEditAddressOpen(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-form-grid">
                <div className="modal-form-field full-width">
                  <label>Country</label>
                  <input type="text" defaultValue="United Kingdom" />
                </div>
                <div className="modal-form-field full-width">
                  <label>City</label>
                  <input type="text" defaultValue="Leeds, East London" />
                </div>
                <div className="modal-form-field full-width">
                  <label>Postal Code</label>
                  <input type="text" defaultValue="ERT 1254" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-save-btn" onClick={() => setIsEditAddressOpen(false)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
