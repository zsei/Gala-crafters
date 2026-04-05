import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  ShieldCheck, 
  Users, 
  UserCheck, 
  Bell, 
  CreditCard, 
  Download, 
  Trash2, 
  Check, 
  ChevronRight,
  Edit2,
  X,
  Lock,
  History,
  MessageSquare,
  Gift,
  HelpCircle,
  LogOut,
  Mail,
  Search,
  Plus,
  Send,
  FileText,
  Calendar,
  Star,
  AlertTriangle
} from 'lucide-react';
import { authService } from '../api/auth';
import bgImage from '../assets/img3.jpg';
import './SettingsPage.css';
import './AccountPage.css'; // Reusing existing card styles

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Profile Specific States (from AccountPage)
  const [isEditPersonalOpen, setIsEditPersonalOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    age: ''
  });
  const [addressData, setAddressData] = useState({
    city: '',
    barangay: '',
    postal_code: '',
    building_details: ''
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [bookings, setBookings] = useState<any[]>([]);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Complaint/Report States
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintStatus, setComplaintStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [complaintForm, setComplaintForm] = useState({
    bookingId: '',
    category: 'Service Quality',
    subject: '',
    details: ''
  });
  const [complaintErrors, setComplaintErrors] = useState<any>({});

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!authService.isLoggedIn()) {
      navigate('/login');
      return;
    }
    const userData = authService.getStoredUser();
    if (userData) {
      setUser(userData);
      // Initialize form data
      setFormData({
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone?.replace('+63 9', '') || '',
        dateOfBirth: userData.date_of_birth || '',
        age: calculateAge(userData.date_of_birth) || ''
      });
      setAddressData({
        city: userData.city || '',
        barangay: userData.barangay || '',
        postal_code: userData.postal_code || '',
        building_details: userData.building_details || ''
      });

      // Also fetch fresh user profile from backend to ensure data is synced
      authService.getProfile().then(freshData => {
        if (freshData) {
          setUser(freshData);
          localStorage.setItem('user', JSON.stringify(freshData));
          setFormData({
            firstName: freshData.first_name || '',
            lastName: freshData.last_name || '',
            email: freshData.email || '',
            phone: freshData.phone?.replace('+63 9', '') || '',
            dateOfBirth: freshData.date_of_birth || '',
            age: calculateAge(freshData.date_of_birth) || ''
          });
          setAddressData({
            city: freshData.city || '',
            barangay: freshData.barangay || '',
            postal_code: freshData.postal_code || '',
            building_details: freshData.building_details || ''
          });
        }
      }).catch(err => console.error("Failed to sync profile:", err));
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
      // Clear the state so it doesn't override manual clicks later
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    // Load bookings whenever activeTab changes
    const loadAllBookings = async () => {
      // 1. Get local bookings
      const localBookings = JSON.parse(localStorage.getItem('gala_crafters_bookings') || '[]');
      
      // 2. Try to get backend bookings if logged in
      let backendBookings = [];
      try {
        if (authService.isLoggedIn()) {
          const fetched = await authService.getUserBookings();
          // Map backend format to frontend format if they differ
          backendBookings = fetched.map((b: any) => ({
            id: b.booking_reference || `BK-${b.id}`,
            packageTitle: b.event_type + " Package", // Fallback title
            totalPrice: b.total_price || 0,
            selectedDate: b.event_date || 'TBD',
            guestCount: b.guest_count || 0,
            status: b.status || 'Pending',
            isBackend: true,
            dbId: b.id,
            formData: {
              firstName: user?.first_name,
              lastName: user?.last_name,
              email: user?.email,
              phone: user?.phone?.replace('+63 9', ''),
              venueAddress: b.venue_proposed,
              notes: b.notes,
              eventLocation: 'Metro Manila' // Default
            }
          }));
        }
      } catch (err) {
        console.error("Failed to fetch backend bookings:", err);
      }

      // 3. Merge and deduplicate (using ID as key)
      const merged = [...backendBookings];
      localBookings.forEach((lb: any) => {
        if (!merged.find(mb => mb.id === lb.id)) {
          merged.push(lb);
        }
      });

      // Sort by date or ID to keep it consistent
      setBookings(merged.sort((a, b) => b.id.localeCompare(a.id)));
    };

    if (activeTab === 'transactions') {
      loadAllBookings();
    }
  }, [activeTab, user]);

  // Profile Helper Functions
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

  const validateName = (name: string) => /^[a-zA-Z\s]*$/.test(name);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => phone.replace(/[^\d]/g, '').length === 9;

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'dateOfBirth') updated.age = calculateAge(value);
      return updated;
    });
    setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: any = {};
    if (!validateName(formData.firstName)) errors.firstName = 'First name can only contain letters and spaces';
    if (!validateName(formData.lastName)) errors.lastName = 'Last name can only contain letters and spaces';
    if (!validateEmail(formData.email)) errors.email = 'Please enter a valid email address';
    if (!validatePhone(formData.phone)) errors.phone = 'Phone must have exactly 9 digits after +63 9';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePersonalInfo = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const updateData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: '+63 9' + formData.phone.replace(/\D/g, '').replace(/^639/, '').slice(0, 9),
          date_of_birth: formData.dateOfBirth
        };
        const result = await authService.updateProfile(updateData);
        const updatedUser = { ...user, ...(result.user || updateData) };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditPersonalOpen(false);
      } catch (err: any) {
        setFormErrors({ submit: err.message || 'Failed to update profile' });
      } finally {
        setLoading(false);
      }
    }
  };

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleOpenChat = () => {
    window.dispatchEvent(new CustomEvent('open_gala_chat'));
  };

  const handleOpenComplaint = () => {
    setComplaintForm({
      bookingId: '',
      category: 'Service Quality',
      subject: '',
      details: ''
    });
    setComplaintErrors({});
    setComplaintStatus('idle');
    setShowComplaintModal(true);
  };

  const handleSubmitComplaint = async () => {
    // Basic validation
    const errors: any = {};
    if (!complaintForm.bookingId) errors.bookingId = 'Please select an event';
    if (!complaintForm.subject.trim()) errors.subject = 'Please enter a subject';
    if (!complaintForm.details.trim()) errors.details = 'Please provide report details';

    if (Object.keys(errors).length > 0) {
      setComplaintErrors(errors);
      return;
    }

    setComplaintStatus('submitting');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setComplaintStatus('success');
    // Hide success message after 3 seconds and close modal
    setTimeout(() => {
      setShowComplaintModal(false);
    }, 3000);
  };

  const confirmLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading || !user) {
    return <div className="settings-page-loader">Loading...</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'security':
        return (
          <div className="settings-tab-section security-tab-content">
            {/* Email Address */}
            <div className="settings-group">
              <div className="settings-group-info">
                <div className="settings-group-title" style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>Email address</div>
                <div className="settings-group-desc" style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginBottom: '10px' }}>The email address associated with your account.</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', color: '#ffffff', fontWeight: '500' }}>{user.email}</span>
                  <span className="badge-unverified" style={{ 
                    backgroundColor: 'rgba(255, 59, 48, 0.1)', 
                    color: '#ff3b30', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontSize: '11px', 
                    fontWeight: '700',
                    letterSpacing: '0.5px'
                  }}>UNVERIFIED</span>
                </div>
              </div>
              <button className="edit-btn-mini" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '6px 14px', 
                borderRadius: '6px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                background: 'rgba(255,255,255,0.05)',
                color: '#ffffff',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                Edit <Edit2 size={14} />
              </button>
            </div>

            {/* Phone Number */}
            <div className="settings-group" style={{ paddingTop: '0px', marginTop: '0px' }}>
              <div className="settings-group-info">
                <div className="settings-group-title" style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>Phone number</div>
                <div className="settings-group-desc" style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', marginBottom: '10px' }}>The phone number associated with your account.</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', color: '#ffffff', fontWeight: '500' }}>{user.phone || 'Not set'}</span>
                  <span className="badge-unverified" style={{ 
                    backgroundColor: 'rgba(255, 59, 48, 0.1)', 
                    color: '#ff3b30', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontSize: '11px', 
                    fontWeight: '700',
                    letterSpacing: '0.5px'
                  }}>UNVERIFIED</span>
                </div>
              </div>
              <button className="edit-btn-mini" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '6px 14px', 
                borderRadius: '6px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                background: 'rgba(255,255,255,0.05)',
                color: '#ffffff',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
                Edit <Edit2 size={14} />
              </button>
            </div>

            {/* Password */}
            <div className="settings-group">
              <div className="settings-group-info">
                <div className="settings-group-title">Password</div>
                <div className="settings-group-desc">Set a unique password to protect your account.</div>
              </div>
              <button className="action-btn" onClick={() => setShowPasswordModal(true)}>Change Password</button>
            </div>

            {/* Deactivate account */}
            <div className="settings-group">
              <div className="settings-group-info">
                <div className="settings-group-title">Deactivate my account</div>
                <div className="settings-group-desc">This will shut down your account. Your account will be reactive when you sign in again.</div>
              </div>
              <button className="action-link" onClick={() => setShowDeactivateModal(true)}>Deactivate</button>
            </div>

            {/* Delete Account */}
            <div className="settings-group">
              <div className="settings-group-info">
                <div className="settings-group-title">Delete Account</div>
                <div className="settings-group-desc">This will delete your account. Your account will be permanently deleted from Prodeel.</div>
              </div>
              <button className="action-link danger" onClick={() => setShowDeleteModal(true)}>Delete</button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="settings-tab-section profile-tab-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              {/* Profile Header Card */}
              <div className="profile-card profile-header-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0' }}>
                <div className="avatar-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                  <div className="avatar-wrapper">
                    {user.profile_picture ? (
                      <img src={user.profile_picture} alt="Avatar" className="avatar-img" />
                    ) : (
                      <div className="avatar-placeholder">{user.first_name?.charAt(0)}{user.last_name?.charAt(0)}</div>
                    )}
                  </div>
                  <div className="avatar-info">
                    <h2 className="user-name">{user.first_name} {user.last_name}</h2>
                    <div className="user-role-label">{user.role}</div>
                    <div className="user-location">{user.city || 'Location not set'}</div>
                  </div>
                </div>
              </div>

              {/* Personal Info Card */}
              <div className="profile-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0' }}>
                <div className="card-header" style={{ marginBottom: '5px', borderBottom: 'none', paddingBottom: '0' }}>
                  <h2 className="card-title" style={{ fontSize: '18px', letterSpacing: '1px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '800' }}>Personal Information</h2>
                </div>
                <div className="info-grid personal-grid" style={{ rowGap: '15px' }}>
                  <div className="info-item">
                    <div className="info-label">First Name</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.first_name}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Last Name</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.last_name}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Email Address</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.email}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Phone Number</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.phone}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Date of Birth</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.date_of_birth || 'Not set'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Age</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{calculateAge(user.date_of_birth) || 'N/A'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button className="edit-btn-primary" onClick={() => setIsEditPersonalOpen(true)} style={{ backgroundColor: '#c49a2c' }}>
                    Edit <Edit2 size={14} className="edit-icon" />
                  </button>
                </div>
              </div>

              {/* Address Card */}
              <div className="profile-card" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0', marginTop: '5px' }}>
                <div className="card-header" style={{ marginBottom: '5px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px', paddingBottom: '0', borderBottom: 'none' }}>
                  <h2 className="card-title" style={{ fontSize: '18px', letterSpacing: '1px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: '800' }}>Address</h2>
                </div>
                <div className="info-grid address-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', rowGap: '15px' }}>
                  <div className="info-item">
                    <div className="info-label">City</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.city || 'Not set'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Barangay</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.barangay || 'Not set'}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Postal Code</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.postal_code || 'Not set'}</div>
                  </div>
                  <div className="info-item" style={{ gridColumn: 'span 3' }}>
                    <div className="info-label">Street Name, Building, etc. (Optional)</div>
                    <div className="info-value" style={{ fontSize: '16px', fontWeight: '600' }}>{user.building || 'Not set'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                  <button className="edit-btn-secondary" onClick={() => setIsEditAddressOpen(true)} style={{ color: '#c49a2c', border: '1px solid rgba(196,154,44,0.4)', background: 'transparent' }}>
                    Edit <Edit2 size={14} className="edit-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="settings-tab-section">
            <h2 className="settings-header-title">Transaction History</h2>
            {bookings.length > 0 ? (
              <div className="transaction-list">
                {bookings.map((booking) => (
                  <div key={booking.id} className="transaction-card">
                    <div className="transaction-icon">
                      <History size={24} color="#c49a2c" />
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-main">
                        <span className="transaction-id">{booking.id}</span>
                        <h3 className="transaction-title">{booking.packageTitle}</h3>
                      </div>
                      <div className="transaction-meta">
                        <span className="transaction-date">Event Date: {booking.selectedDate}</span>
                        <span className="transaction-guests">{booking.guestCount} Guests</span>
                      </div>
                    </div>
                    <div className="transaction-amount-status">
                      <div className="transaction-amount">₱{booking.totalPrice.toLocaleString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button 
                          className="details-btn" 
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowTransactionDetails(true);
                          }}
                        >
                          View Details
                        </button>
                        <div className={`transaction-status status-${booking.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-card">
                <History size={48} className="empty-icon" />
                <p>You have no recent transactions yet.</p>
                <button className="action-btn" onClick={() => navigate('/services')}>Explore Services</button>
              </div>
            )}
          </div>
        );
      case 'reviews':
        return (
          <div className="settings-tab-section">
            <h2 className="settings-header-title">My Reviews</h2>
            <div className="empty-state-card">
              <MessageSquare size={48} className="empty-icon" />
              <p>You haven't left any reviews yet.</p>
              <button className="action-btn">View My Bookings</button>
            </div>
          </div>
        );
      case 'bonuses':
        return (
          <div className="settings-tab-section">
            <h2 className="settings-header-title">Discount and Bonuses</h2>
            <div className="bonus-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div className="bonus-card" style={{ background: 'rgba(196, 154, 44, 0.1)', border: '1px dashed #c49a2c', padding: '25px', borderRadius: '15px', position: 'relative', overflow: 'hidden' }}>
                <Gift style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.1, transform: 'rotate(-15deg)' }} size={100} />
                <h3 style={{ color: '#c49a2c', fontSize: '20px', fontWeight: '800', marginBottom: '5px' }}>WELCOME GALA</h3>
                <p style={{ color: '#ffffff', fontSize: '14px', marginBottom: '15px' }}>15% off on your first grand wedding booking.</p>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Status: Available</span>
              </div>
            </div>
          </div>
        );
      case 'help':
        return (
          <div className="settings-tab-section">
            <h2 className="settings-header-title">Help and Complain</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="settings-group">
                <div className="settings-group-info">
                  <div className="settings-group-title">Contact Support</div>
                  <div className="settings-group-desc">Our team is available 24/7 to assist you with any issues.</div>
                </div>
                <button className="action-btn" onClick={handleOpenChat}>Open Chat</button>
              </div>
              <div className="settings-group">
                <div className="settings-group-info">
                  <div className="settings-group-title">File a Complaint</div>
                  <div className="settings-group-desc">We value your feedback. Let us know if something didn't meet your expectations.</div>
                </div>
                <button className="action-btn" onClick={handleOpenComplaint}>Submit Report</button>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="settings-tab-section">
            <h2 className="settings-header-title">Notifications</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '5px' }}>Manage how you receive updates and promotional offers.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              {/* Email Notifications Segment */}
              <div className="settings-group" style={{ paddingTop: '10px' }}>
                <div className="settings-group-info">
                  <div className="settings-group-title">Email Notifications</div>
                  <div className="settings-group-desc">Receive account activity and security alerts via email.</div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Promotions & Discounts */}
              <div className="settings-group" style={{ paddingTop: '10px' }}>
                <div className="settings-group-info">
                  <div className="settings-group-title">Promotions & Discounts</div>
                  <div className="settings-group-desc">Get the latest gala deals, seasonal discounts, and early access to packages.</div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Booking Updates */}
              <div className="settings-group" style={{ paddingTop: '10px', borderBottom: 'none' }}>
                <div className="settings-group-info">
                  <div className="settings-group-title">Booking Updates</div>
                  <div className="settings-group-desc">Real-time alerts regarding your ongoing bookings and event schedules.</div>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="settings-tab-section">
            <h2 className="settings-header-title">Billing & Payments</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '10px' }}>Manage your payment methods and billing preferences.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="settings-group">
                <div className="settings-group-info">
                  <div className="settings-group-title">Saved Payment Methods</div>
                  <div className="settings-group-desc">You haven't saved any payment methods yet.</div>
                </div>
                <button className="action-btn">Add Method</button>
              </div>

              <div className="settings-group">
                <div className="settings-group-info">
                  <div className="settings-group-title">Billing History</div>
                  <div className="settings-group-desc">Download invoices and receipts from your past events.</div>
                </div>
                <button className="action-btn">View Invoices</button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="settings-tab-section">
            <h2 className="settings-header-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>This section is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="contact-page-wrapper contact-hero-dark" style={{ padding: 0, margin: 0, minHeight: '100vh' }}>
      <section
        className="enhanced-vm-section enhanced-vision"
        style={{
          '--bg-img': `url(${bgImage})`,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '80px 0'
        } as React.CSSProperties}
      >
        <div className="settings-container">
          {/* Sidebar */}
          <aside className="settings-sidebar">
            <ul className="sidebar-menu">
              {/* Personal Section */}
              <li className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => handleTabChange('profile')}><User size={18} /> My Profile</li>
              <li className={`sidebar-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => handleTabChange('security')}><ShieldCheck size={18} /> Security</li>
              <li className={`sidebar-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => handleTabChange('notifications')}><Bell size={18} /> Notifications</li>
              <li className={`sidebar-item ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => handleTabChange('billing')}><CreditCard size={18} /> Billing</li>
              
              <li className="sidebar-divider"></li>

              {/* Activity Section */}
              <li className={`sidebar-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => handleTabChange('transactions')}><History size={18} /> Transaction History</li>
              <li className={`sidebar-item ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => handleTabChange('reviews')}><MessageSquare size={18} /> My Reviews</li>
              <li className={`sidebar-item ${activeTab === 'bonuses' ? 'active' : ''}`} onClick={() => handleTabChange('bonuses')}><Gift size={18} /> Discount and Bonuses</li>
              
              <li className="sidebar-divider"></li>

              {/* Support Section */}
              <li className={`sidebar-item ${activeTab === 'help' ? 'active' : ''}`} onClick={() => handleTabChange('help')}><HelpCircle size={18} /> Help and Complain</li>
              
              <li className="sidebar-divider"></li>

              {/* Action Section */}
              <li className="sidebar-item logout-item" onClick={handleLogout}><LogOut size={18} /> Log Out</li>
              <li className={`sidebar-item delete-item ${showDeleteModal ? 'active' : ''}`} onClick={() => setShowDeleteModal(true)}><Trash2 size={18} /> Delete Account</li>
            </ul>
          </aside>

          {/* Main Content */}
          <main className="settings-content">
            {renderContent()}
          </main>
        </div>
      </section>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-container password-modal-container">
            <div className="modal-header">
              <h2 className="modal-title">Change Password</h2>
              <button 
                className="modal-close-btn" 
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }} 
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="modal-form-field full-width">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    value={passwordFormData.currentPassword}
                    onChange={(e) => setPasswordFormData({...passwordFormData, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="modal-form-field full-width">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={passwordFormData.newPassword}
                    onChange={(e) => setPasswordFormData({...passwordFormData, newPassword: e.target.value})}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="modal-form-field full-width">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordFormData.confirmPassword}
                    onChange={(e) => setPasswordFormData({...passwordFormData, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <a href="#forgot" onClick={(e) => e.preventDefault()} style={{ 
                  color: '#c49a2c', 
                  fontSize: '14px', 
                  textDecoration: 'none',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>Forgot password?</a>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="modal-save-btn" 
                onClick={() => {
                  // Non-functional as requested
                  setShowPasswordModal(false);
                  setPasswordFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }} 
                style={{ backgroundColor: '#c49a2c' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

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
                      if (value.length <= 30) handleFormChange('firstName', value);
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
                      if (value.length <= 30) handleFormChange('lastName', value);
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
                  <div className="phone-input-wrapper-settings" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(196, 154, 44, 0.3)',
                    borderRadius: '8px',
                    padding: '0 16px',
                    height: '45px'
                  }}>
                    <span className="phone-prefix" style={{ color: '#c49a2c', fontWeight: 'bold', marginRight: '8px', whiteSpace: 'nowrap' }}>+63 9</span>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 9) handleFormChange('phone', value);
                      }}
                      placeholder="XXXXXXXXX"
                      style={{ border: 'none', background: 'transparent', padding: '0', color: '#ffffff', outline: 'none', width: '100%', fontSize: '15px' }}
                    />
                  </div>
                  {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                </div>
                <div className="modal-form-field">
                  <label>Date of Birth</label>
                  <input type="date" value={formData.dateOfBirth} onChange={(e) => handleFormChange('dateOfBirth', e.target.value)} />
                </div>
                <div className="modal-form-field">
                  <label>Age</label>
                  <input type="text" value={formData.age} readOnly />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-save-btn" onClick={handleSavePersonalInfo} style={{ backgroundColor: '#c49a2c' }}>Save Changes</button>
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
                  <label>City</label>
                  <input type="text" value={addressData.city} onChange={(e) => handleAddressChange('city', e.target.value)} placeholder="Enter city" />
                </div>
                <div className="modal-form-field">
                  <label>Postal Code</label>
                  <input type="text" value={addressData.postal_code} onChange={(e) => handleAddressChange('postal_code', e.target.value)} placeholder="Enter postal code" />
                </div>
                <div className="modal-form-field">
                  <label>Barangay</label>
                  <input type="text" value={addressData.barangay} onChange={(e) => handleAddressChange('barangay', e.target.value)} placeholder="Enter barangay" />
                </div>
                <div className="modal-form-field full-width">
                  <label>Street Name, Building, etc. (Optional)</label>
                  <input type="text" value={addressData.building_details} onChange={(e) => handleAddressChange('building_details', e.target.value)} placeholder="e.g. Street name, Building Name, Floor" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-save-btn" onClick={handleSaveAddress} style={{ backgroundColor: '#c49a2c' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-container logout-modal-container">
            <div className="logout-modal-content">
              <h2 className="logout-modal-title">Are you sure you want to sign out?</h2>
              
              <div className="logout-modal-actions">
                <button 
                  className="logout-modal-btn cancel" 
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="logout-modal-btn confirm" 
                  onClick={confirmLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal-container">
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowDeleteModal(false)}
                style={{ position: 'absolute', right: '20px', top: '20px' }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body delete-modal-body" style={{ textAlign: 'center', padding: '0 40px 40px 40px' }}>
              <div className="delete-modal-icon-wrapper" style={{ 
                width: '80px', 
                height: '80px', 
                background: 'rgba(255, 77, 77, 0.1)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 25px auto',
                border: '1px solid rgba(255, 77, 77, 0.3)'
              }}>
                <Trash2 size={40} style={{ color: '#ff4d4d' }} />
              </div>
              
              <h2 className="delete-modal-header" style={{ 
                fontFamily: 'Playfair Display, serif', 
                fontSize: '28px', 
                fontWeight: '900', 
                color: '#ffffff', 
                marginBottom: '15px' 
              }}>Wait, are you sure?</h2>
              
              <p className="delete-modal-desc" style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                fontSize: '16px', 
                lineHeight: '1.6', 
                marginBottom: '30px' 
              }}>
                Deleting your account will permanently remove all your bookings, personal records, and gala data. This action is irreversible.
              </p>
              
              <div className="delete-modal-actions" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <button 
                  className="confirm-delete-btn active" 
                  style={{ 
                    width: '100%', 
                    background: '#ff4d4d', 
                    color: '#ffffff', 
                    padding: '15px', 
                    borderRadius: '12px', 
                    fontWeight: '800', 
                    fontSize: '16px', 
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(255, 77, 77, 0.2)',
                    border: 'none'
                  }}
                >
                  Yes, Delete My Account
                </button>
                <button 
                  className="cancel-delete-btn" 
                  onClick={() => setShowDeleteModal(false)}
                  style={{ 
                    width: '100%', 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    color: '#ffffff', 
                    padding: '15px', 
                    borderRadius: '12px', 
                    fontWeight: '600', 
                    fontSize: '15px', 
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  No, Keep My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Account Confirmation Modal */}
      {showDeactivateModal && (
        <div className="modal-overlay">
          <div className="deactivate-modal-container">
            <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowDeactivateModal(false)}
                style={{ position: 'absolute', right: '20px', top: '20px' }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body deactivate-modal-body" style={{ textAlign: 'center', padding: '0 40px 40px 40px' }}>
              <div className="deactivate-modal-icon-wrapper" style={{ 
                width: '80px', 
                height: '80px', 
                background: 'rgba(196, 154, 44, 0.1)', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 25px auto',
                border: '1px solid rgba(196, 154, 44, 0.3)'
              }}>
                <Lock size={40} style={{ color: '#c49a2c' }} />
              </div>
              
              <h2 className="deactivate-modal-header" style={{ 
                fontFamily: 'Playfair Display, serif', 
                fontSize: '28px', 
                fontWeight: '900', 
                color: '#ffffff', 
                marginBottom: '15px' 
              }}>Deactivate Account?</h2>
              
              <p className="deactivate-modal-desc" style={{ 
                color: 'rgba(255, 255, 255, 0.6)', 
                fontSize: '16px', 
                lineHeight: '1.6', 
                marginBottom: '30px' 
              }}>
                Your profile and records will be hidden. You can reactivate your account at any time by simply signing back in.
              </p>
              
              <div className="deactivate-modal-actions" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <button 
                  className="confirm-deactivate-btn" 
                  style={{ 
                    width: '100%', 
                    background: '#c49a2c', 
                    color: '#ffffff', 
                    padding: '15px', 
                    borderRadius: '12px', 
                    fontWeight: '800', 
                    fontSize: '16px', 
                    cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(196, 154, 44, 0.2)',
                    border: 'none'
                  }}
                >
                  Yes, Deactivate My Account
                </button>
                <button 
                  className="cancel-deactivate-btn" 
                  onClick={() => setShowDeactivateModal(false)}
                  style={{ 
                    width: '100%', 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    color: '#ffffff', 
                    padding: '15px', 
                    borderRadius: '12px', 
                    fontWeight: '600', 
                    fontSize: '15px', 
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  No, Keep It Active
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Complaint / Report Modal */}
      {showComplaintModal && (
        <div className="modal-overlay">
          <div className="modal-container complaint-modal-container" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                {complaintStatus === 'success' ? 'Report Submitted' : 'Submit Event Report'}
              </h2>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowComplaintModal(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {complaintStatus === 'success' ? (
                <div className="success-state" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: 'rgba(72, 187, 120, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 20px' 
                  }}>
                    <Check size={40} color="#48bb78" />
                  </div>
                  <h3 style={{ color: '#ffffff', fontSize: '24px', marginBottom: '10px', fontFamily: "'Playfair Display', serif" }}>Feedback Received</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px', lineHeight: '1.6' }}>
                    Thank you for your report. Our quality assurance team will review your feedback and get back to you shortly.
                  </p>
                </div>
              ) : (
                <div className="modal-form-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Event Selection */}
                  <div className="modal-form-field full-width">
                    <label>Select Event <span style={{ color: '#ff4d4d' }}>*</span></label>
                    <select 
                      value={complaintForm.bookingId}
                      onChange={(e) => {
                        setComplaintForm({...complaintForm, bookingId: e.target.value});
                        setComplaintErrors({...complaintErrors, bookingId: ''});
                      }}
                      className={complaintErrors.bookingId ? 'error' : ''}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${complaintErrors.bookingId ? '#ff4d4d' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    >
                      <option value="" style={{ background: '#0a0f1d' }}>-- Choose an Event --</option>
                      {bookings.map(b => (
                        <option key={b.id} value={b.id} style={{ background: '#0a0f1d' }}>
                          {b.packageTitle} - {b.selectedDate} ({b.id})
                        </option>
                      ))}
                    </select>
                    {complaintErrors.bookingId && <span style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '4px' }}>{complaintErrors.bookingId}</span>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    {/* Category Selection */}
                    <div className="modal-form-field">
                      <label>Report Category</label>
                      <select 
                        value={complaintForm.category}
                        onChange={(e) => setComplaintForm({...complaintForm, category: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      >
                        <option value="Service Quality" style={{ background: '#0a0f1d' }}>Service Quality</option>
                        <option value="Venue Styling" style={{ background: '#0a0f1d' }}>Venue Styling</option>
                        <option value="Catering" style={{ background: '#0a0f1d' }}>Catering</option>
                        <option value="Staff Conduct" style={{ background: '#0a0f1d' }}>Staff Conduct</option>
                        <option value="Billing Issue" style={{ background: '#0a0f1d' }}>Billing Issue</option>
                        <option value="Other" style={{ background: '#0a0f1d' }}>Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="modal-form-field full-width">
                    <label>Report Subject <span style={{ color: '#ff4d4d' }}>*</span></label>
                    <input 
                      type="text" 
                      placeholder="Briefly describe the issue"
                      value={complaintForm.subject}
                      onChange={(e) => {
                        setComplaintForm({...complaintForm, subject: e.target.value});
                        setComplaintErrors({...complaintErrors, subject: ''});
                      }}
                      className={complaintErrors.subject ? 'error' : ''}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${complaintErrors.subject ? '#ff4d4d' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    {complaintErrors.subject && <span style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '4px' }}>{complaintErrors.subject}</span>}
                  </div>

                  {/* Details */}
                  <div className="modal-form-field full-width">
                    <label>Detailed Report <span style={{ color: '#ff4d4d' }}>*</span></label>
                    <textarea 
                      placeholder="Tell us more about your experience..."
                      value={complaintForm.details}
                      onChange={(e) => {
                        setComplaintForm({...complaintForm, details: e.target.value});
                        setComplaintErrors({...complaintErrors, details: ''});
                      }}
                      className={complaintErrors.details ? 'error' : ''}
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${complaintErrors.details ? '#ff4d4d' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '14px',
                        resize: 'vertical',
                        outline: 'none'
                      }}
                    />
                    {complaintErrors.details && <span style={{ color: '#ff4d4d', fontSize: '12px', marginTop: '4px' }}>{complaintErrors.details}</span>}
                  </div>
                </div>
              )}
            </div>

            {complaintStatus !== 'success' && (
              <div className="modal-footer">
                <button 
                  className="modal-save-btn" 
                  onClick={handleSubmitComplaint}
                  disabled={complaintStatus === 'submitting'}
                  style={{ 
                    backgroundColor: '#c49a2c', 
                    width: '100%',
                    opacity: complaintStatus === 'submitting' ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  {complaintStatus === 'submitting' ? (
                    <>
                      <div className="spinner-mini" style={{ 
                        width: '16px', 
                        height: '16px', 
                        border: '2px solid rgba(255,255,255,0.3)', 
                        borderTopColor: '#ffffff', 
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Submitting Report...
                    </>
                  ) : 'Submit Report'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showTransactionDetails && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-container transaction-details-modal">
            <div className="modal-header">
              <div className="details-header-info">
                <span className="details-id">{selectedBooking.id}</span>
                <h2 className="modal-title">{selectedBooking.packageTitle}</h2>
              </div>
              <button 
                className="modal-close-btn" 
                onClick={() => setShowTransactionDetails(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body details-modal-scroll">
              {/* Event Overview Section */}
              <div className="details-section">
                <div className="details-section-header">
                  <Calendar size={18} /> 
                  <h3>Event Overview</h3>
                </div>
                <div className="details-grid">
                  <div className="details-item">
                    <label>Event Date</label>
                    <span>{selectedBooking.selectedDate || 'N/A'}</span>
                  </div>
                  <div className="details-item">
                    <label>Guest Count</label>
                    <span>{selectedBooking.guestCount || '0'} Expected</span>
                  </div>
                  <div className="details-item">
                    <label>Total Price</label>
                    <span className="gold-text">₱{selectedBooking.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="details-item">
                    <label>Booking Status</label>
                    <span className="status-text">{selectedBooking.status}</span>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="details-section">
                <div className="details-section-header">
                  <User size={18} /> 
                  <h3>Personal Information</h3>
                </div>
                <div className="details-grid">
                  <div className="details-item">
                    <label>Client Name</label>
                    <span>
                      {selectedBooking.formData?.firstName || user.first_name || 'Valued'} {' '}
                      {selectedBooking.formData?.lastName || user.last_name || 'Client'}
                    </span>
                  </div>
                  <div className="details-item">
                    <label>Email Address</label>
                    <span>{selectedBooking.formData?.email || user.email}</span>
                  </div>
                  <div className="details-item">
                    <label>Phone Number</label>
                    <span>
                      {selectedBooking.formData?.phone 
                        ? `+63 9${selectedBooking.formData.phone}` 
                        : user.phone || 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Customization */}
              <div className="details-section">
                <div className="details-section-header">
                  <Edit2 size={18} /> 
                  <h3>Event Customization</h3>
                </div>
                <div className="details-grid">
                  <div className="details-item">
                    <label>Event Theme</label>
                    <span>{selectedBooking.formData?.eventTheme || 'Not Specified'}</span>
                  </div>
                  <div className="details-item">
                    <label>Color Palette</label>
                    <span>{selectedBooking.formData?.colorPalette || 'Not Specified'}</span>
                  </div>
                  <div className="details-item full-width">
                    <label>Venue Address ({selectedBooking.formData?.eventLocation})</label>
                    <span>{selectedBooking.formData?.venueAddress || 'Address Not Provided'}</span>
                  </div>
                  {selectedBooking.formData?.notes && (
                    <div className="details-item full-width">
                      <label>Special Requests / Notes</label>
                      <p className="details-notes">{selectedBooking.formData?.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contract Section */}
              <div className="details-section contract-section">
                <div className="contract-box">
                  <div className="contract-info">
                    <FileText size={24} />
                    <div>
                      <h4>Virtual Service Agreement</h4>
                      <p>View your signed contract and terms of service.</p>
                    </div>
                  </div>
                  <a href="/Virtual_Contract.pdf" download className="details-download-btn">
                    <Download size={18} /> Download PDF
                  </a>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="modal-save-btn" 
                onClick={() => setShowTransactionDetails(false)}
                style={{ backgroundColor: '#c49a2c', width: '100%' }}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
