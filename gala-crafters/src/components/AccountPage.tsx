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
  
  // Form state for Edit Personal Information
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    age: ''
  });

  const [formErrors, setFormErrors] = useState<any>({});
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
      setFormData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || '(+63 9)',
        dateOfBirth: userData.date_of_birth || '',
        age: calculateAge(userData.date_of_birth) || ''
      });
    }
    setLoading(false);
  }, [navigate]);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age > 0 ? age.toString() : '';
  };

  const validateName = (name: string) => {
    return /^[a-zA-Z\s]*$/.test(name);
  };

  const validateEmail = (email: string) => {
    return email.endsWith('@gmail.com');
  };

  const validatePhone = (phone: string) => {
    const phoneNumbers = phone.replace(/[^\d]/g, '');
    return phoneNumbers.length === 11 && phoneNumbers.startsWith('639');
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'dateOfBirth') {
        updated.age = calculateAge(value);
      }
      
      return updated;
    });

    // Clear error for this field
    setFormErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const validateForm = () => {
    const errors: any = {};

    if (!validateName(formData.firstName)) {
      errors.firstName = 'First name can only contain letters and spaces';
    }
    if (!validateName(formData.lastName)) {
      errors.lastName = 'Last name can only contain letters and spaces';
    }
    if (!validateEmail(formData.email)) {
      errors.email = 'Email must be @gmail.com';
    }
    if (!validatePhone(formData.phone)) {
      errors.phone = 'Phone must be (+63 9) with 9 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePersonalInfo = () => {
    if (validateForm()) {
      // Save logic here
      setIsEditPersonalOpen(false);
    }
  };

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
              <button className="edit-btn-primary" onClick={() => setIsEditPersonalOpen(true)} style={{ backgroundColor: '#c49a2c' }}>
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
                <div className="info-label">Date of Birth</div>
                <div className="info-value">{user.date_of_birth}</div>
              </div>
              
              <div className="info-item">
                <div className="info-label">Age</div>
                <div className="info-value">{calculateAge(user.date_of_birth)}</div>
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
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => handleFormChange('firstName', e.target.value)}
                    placeholder="Enter first name (letters only)"
                  />
                  {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
                </div>
                <div className="modal-form-field">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => handleFormChange('lastName', e.target.value)}
                    placeholder="Enter last name (letters only)"
                  />
                  {formErrors.lastName && <span className="error-text">{formErrors.lastName}</span>}
                </div>
                <div className="modal-form-field full-width">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    placeholder="example@gmail.com"
                  />
                  {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                </div>
                <div className="modal-form-field full-width">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      const phoneNumbers = value.replace(/[^\d]/g, '');
                      if (phoneNumbers.length <= 11) {
                        handleFormChange('phone', value);
                      }
                    }}
                    placeholder="(+63 9) XXXXXXXXX"
                  />
                  {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                </div>
                <div className="modal-form-field">
                  <label>Date of Birth</label>
                  <input 
                    type="date" 
                    value={formData.dateOfBirth}
                    onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
                  />
                </div>
                <div className="modal-form-field">
                  <label>Age</label>
                  <input 
                    type="text" 
                    value={formData.age}
                    readOnly
                    placeholder="Auto-calculated"
                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-save-btn" 
                onClick={handleSavePersonalInfo}
                style={{ backgroundColor: '#c49a2c' }}
              >
                Save Changes
              </button>
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
