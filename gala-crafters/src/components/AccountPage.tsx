import React, { useEffect, useState } from 'react';
import { Edit2, X, Lock, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth';
import bgImage from '../assets/img3.jpg';
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
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // We are now only validating the 9 digits entered by the user
    const digitsOnly = phone.replace(/[^\d]/g, '');
    return digitsOnly.length === 9;
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
      errors.email = 'Please enter a valid email address';
    }
    if (!validatePhone(formData.phone)) {
      errors.phone = 'Phone must have exactly 9 digits after +63 9';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePersonalInfo = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const emailChanged = formData.email.toLowerCase() !== user.email.toLowerCase();
        
        // Prepare data for backend (mapping camelCase to snake_case)
        const updateData: any = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          // Ensure phone is stored in international format
          phone: '+63 9' + formData.phone.replace(/\D/g, '').replace(/^639/, '').slice(0, 9),
          date_of_birth: formData.dateOfBirth
        };

        if (emailChanged) {
          updateData.is_email_verified = false;
        }

        const result = await authService.updateProfile(updateData);
        
        // Use merging to avoid losing other fields (like address)
        const updatedUser = { ...user, ...(result.user || updateData) };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setIsEditPersonalOpen(false);
        setFormErrors({});
      } catch (err: any) {
        setFormErrors({ submit: err.message || 'Failed to update profile' });
      } finally {
        setLoading(false);
      }
    }
  };

  const [addressData, setAddressData] = useState({
    city: '',
    barangay: '',
    postal_code: '',
    building_details: ''
  });

  const handleAddressChange = (field: string, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (user) {
      setAddressData({
        city: user.city || '',
        barangay: user.barangay || '',
        postal_code: user.postal_code || '',
        building_details: user.building_details || ''
      });
    }
  }, [user]);

  const handleSaveAddress = async () => {
    try {
      setLoading(true);
      const result = await authService.updateProfile(addressData);
      
      const updatedUser = { ...user, ...(result.user || addressData) };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setIsEditAddressOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (!user) {
    return <div style={{ padding: '20px' }}>Please log in to view your profile</div>;
  }

  return (
    <div className="contact-page-wrapper contact-hero-dark" style={{ padding: 0, margin: 0, minHeight: '100vh' }}>
      <section
        className="enhanced-vm-section enhanced-vision"
        style={{
          '--bg-img': `url(${bgImage})`,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '100px 0'
        } as React.CSSProperties}
      >
        <div className="account-container" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 50px' }}>
          
          <div className="profile-hero-header" style={{ marginBottom: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 className="contact-heading" style={{ fontSize: '68px', marginTop: '15px', fontFamily: "'Playfair Display', serif", fontWeight: 900, letterSpacing: '-3px', lineHeight: 1, color: '#ffffff' }}>
              My <span className="contact-heading-italic" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 900, letterSpacing: '-3px', color: '#c49a2c' }}>Profile</span>
            </h1>
            <div className="gold-line" style={{ margin: '20px auto 0 auto' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', width: '100%' }}>
            
            {/* Profile Header Card - NOW CENTERED */}
            <div className="profile-card profile-header-card glass-morphism" style={{ maxWidth: '800px', width: '100%' }}>
              <div className="avatar-section" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
                <div className="avatar-wrapper" style={{ margin: '0 auto' }}>
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
                </div>
                <div className="avatar-info" style={{ marginTop: '20px' }}>
                  <h2 className="user-name">{user.first_name} {user.last_name}</h2>
                  <div className="user-role-label">{user.role}</div>
                  <div className="user-location">{user.city || 'Location not set'}</div>
                </div>
              </div>
            </div>

            {/* Information Cards - NOW CENTERED */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px', width: '100%' }}>
              
              {/* Personal Information */}
              <div className="profile-card glass-morphism">
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
                    <div className="info-value">{user.date_of_birth || 'Not set'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Age</div>
                    <div className="info-value">{calculateAge(user.date_of_birth) || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="profile-card glass-morphism">
                <div className="card-header">
                  <h2 className="card-title">Address</h2>
                  <button className="edit-btn-secondary" onClick={() => setIsEditAddressOpen(true)}>
                    Edit <Edit2 size={14} className="edit-icon" />
                  </button>
                </div>
                
                <div className="info-grid address-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', rowGap: '30px' }}>
                  <div className="info-item">
                    <div className="info-label">City</div>
                    <div className="info-value">{user.city || 'Not set'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Barangay</div>
                    <div className="info-value">{user.barangay || 'Not set'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Postal Code</div>
                    <div className="info-value">{user.postal_code || 'Not set'}</div>
                  </div>
                  <div className="info-item" style={{ gridColumn: 'span 3' }}>
                    <div className="info-label">Building, Apartment, Floor, Unit (Optional)</div>
                    <div className="info-value">{user.building_details || 'Not set'}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

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
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      if (value.length <= 30) {
                        handleFormChange('firstName', value);
                      }
                    }}
                    placeholder="Enter first name"
                    maxLength={30}
                  />
                  {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
                </div>
                <div className="modal-form-field">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                      if (value.length <= 30) {
                        handleFormChange('lastName', value);
                      }
                    }}
                    placeholder="Enter last name"
                    maxLength={30}
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
                  <div className="phone-input-wrapper" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(196, 154, 44, 0.3)',
                    borderRadius: '8px',
                    padding: '0 16px'
                  }}>
                    <span className="phone-prefix" style={{ color: '#c49a2c', fontWeight: 'bold', marginRight: '5px' }}>+63 9</span>
                    <input 
                      type="tel" 
                      value={formData.phone.replace(/\D/g, '').replace(/^639/, '').slice(0, 9)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 9) {
                          handleFormChange('phone', value);
                        }
                      }}
                      placeholder="XXXXXXXXX"
                      style={{ 
                        border: 'none', 
                        background: 'transparent', 
                        padding: '12px 0',
                        color: '#ffffff',
                        outline: 'none',
                        width: '100%'
                      }}
                    />
                  </div>
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
                  <label>Building, Apartment, Floor, Unit (Optional)</label>
                  <input 
                    type="text" 
                    value={addressData.building_details}
                    onChange={(e) => handleAddressChange('building_details', e.target.value)}
                    placeholder="e.g. Building Name, Room No., Floor"
                  />
                </div>
                <div className="modal-form-field">
                  <label>City</label>
                  <input 
                    type="text" 
                    value={addressData.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                <div className="modal-form-field">
                  <label>Barangay</label>
                  <input 
                    type="text" 
                    value={addressData.barangay}
                    onChange={(e) => handleAddressChange('barangay', e.target.value)}
                    placeholder="Enter barangay"
                  />
                </div>
                <div className="modal-form-field full-width">
                  <label>Postal Code</label>
                  <input 
                    type="text" 
                    value={addressData.postal_code}
                    onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-save-btn" 
                onClick={handleSaveAddress}
                style={{ backgroundColor: '#c49a2c' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
