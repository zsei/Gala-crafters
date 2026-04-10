import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, CheckCircle, Calendar, Users, ShieldCheck, FileText, ChevronDown } from 'lucide-react';
import { authService } from '../api/auth';
import { API_BASE_URL, API_ENDPOINTS } from '../api/config';
import './ReservationModal.css';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  data: {
    packageTitle: string;
    basePrice: number;
    serviceFee: number;
    promoDiscount: number;
    totalPrice: number;
    guestCount: number;
    selectedDate: string;
  } | null;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, onBack, data }) => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    eventTheme: '',
    colorPalette: '',
    eventLocation: 'Metro Manila',
    venueAddress: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const locations = ['Metro Manila', 'Greater Manila', 'Cavite'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
        setFormData(prev => ({
          ...prev,
          firstName: storedUser.first_name || '',
          lastName: storedUser.last_name || '',
          email: storedUser.email || '',
          phone: (storedUser.phone || '').replace('+63 9', '')
        }));
      }
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // Validation logic as per user requirements
    if (['firstName', 'lastName', 'eventTheme', 'colorPalette'].includes(name)) {
      // Letters only, max 20 characters
      newValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 20);
    } else if (name === 'phone') {
      // Numbers only, max 9 digits
      newValue = value.replace(/[^0-9]/g, '').slice(0, 9);
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const isFormValid = 
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.phone.length === 9 &&
    formData.eventTheme.trim() !== '' &&
    formData.colorPalette.trim() !== '' &&
    formData.venueAddress.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    
    try {
      // 1. Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to continue with the booking.");
        setIsSubmitting(false);
        return;
      }

      // 2. Call backend to create PayMongo Checkout Session
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PAYMENTS.CREATE_CHECKOUT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          package_title: data?.packageTitle || 'Custom Package',
          total_price: data?.totalPrice || 0,
          selected_date: data?.selectedDate || 'Not Set',
          guest_count: data?.guestCount || 0,
          // Include customization data for the backend to create the actual booking record
          event_type: data?.packageTitle?.includes('Wedding') ? 'Wedding' : 
                      data?.packageTitle?.includes('Debut') ? 'Debut' : 
                      data?.packageTitle?.includes('Corporate') ? 'Corporate' : 'Special Occasion',
          venue_proposed: formData.venueAddress,
          notes: formData.notes,
          event_theme: formData.eventTheme,
          color_palette: formData.colorPalette,
          event_location: formData.eventLocation,
          specific_venue_address: formData.venueAddress,
          special_requests: formData.notes
        })
      });

      const resData = await response.json();

      if (response.ok && resData.checkout_url) {
        // 3. Optional: Clear any local "draft" bookings if they exist
        // We no longer need to save to localStorage because the backend now creates a real record
        
        // 4. Redirect to PayMongo Simulation
        window.location.href = resData.checkout_url;
      } else {
        alert(resData.detail || "Failed to create payment session.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("An error occurred while connecting to the payment server.");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (isSuccess) {
    return (
      <div className="res-modal-overlay">
        <div className="res-modal-content success-view">
          <button className="res-close-btn" onClick={onClose}><X size={24} /></button>
          <div className="success-icon-wrapper">
             <CheckCircle size={80} color="#c49a2c" />
          </div>
          <h1>Reservation Received!</h1>
          <p>Thank you for choosing Gala Crafters. We have received your request for the <strong>{data?.packageTitle}</strong>.</p>
          <p>Our team will contact you within 24 hours to finalize the details.</p>
          <button className="success-done-btn" onClick={onClose}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="res-modal-overlay">
      <div className="res-modal-content">
        <button className="res-close-btn" onClick={onClose}><X size={24} /></button>
        
        <div className="res-grid">
          {/* Main Form Section */}
          <div className="res-form-side">
            <button className="res-back-link" onClick={onBack}>
              <ArrowLeft size={16} /> BACK TO PACKAGE
            </button>
            <div className="res-header">
                <h1 className="modal-package-title">Finalize Reservation</h1>
                <p>Ensure your details are correct to secure your event date.</p>
            </div>

            <form className="res-premium-form" onSubmit={handleSubmit}>
              <div className="res-section">
                <div className="modal-section-title">Personal Information</div>
                <div className="modal-gold-dash"></div>
                <div className="res-row">
                    <div className="res-group">
                        <label>First Name</label>
                        <input 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange}
                            placeholder="First Name"
                            maxLength={20}
                            required
                        />
                    </div>
                    <div className="res-group">
                        <label>Last Name</label>
                        <input 
                            type="text" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange}
                            placeholder="Last Name"
                            maxLength={20}
                            required
                        />
                    </div>
                </div>
                <div className="res-row">
                    <div className="res-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange}
                            placeholder="Email Address"
                            required
                        />
                    </div>
                    <div className="res-group">
                        <label>Phone Number</label>
                        <div className="res-phone-group">
                            <span className="prefix">+63 9</span>
                            <div className="res-phone-divider"></div>
                            <input 
                                type="tel" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange}
                                placeholder="912345678"
                                maxLength={9}
                                required
                            />
                        </div>
                    </div>
                </div>
              </div>

              <div className="res-section">
                  <div className="modal-section-title">Event Customization</div>
                  <div className="modal-gold-dash"></div>
                  <div className="res-row">
                      <div className="res-group">
                          <label>Theme of your event (e.g. Rustic, Modern, Minimalist)</label>
                          <input 
                              type="text" 
                              name="eventTheme" 
                              value={formData.eventTheme} 
                              onChange={handleChange}
                              placeholder="Enter event theme"
                              maxLength={20}
                          />
                      </div>
                      <div className="res-group">
                          <label>Color Palette of your event (e.g. Gold & Navy, Burgundy)</label>
                          <input 
                              type="text" 
                              name="colorPalette" 
                              value={formData.colorPalette} 
                              onChange={handleChange}
                              placeholder="Enter color palette"
                              maxLength={20}
                          />
                      </div>
                  </div>
                  <div className="res-row">
                      <div className="res-group">
                          <label>Event Location / Area</label>
                          <div className="custom-select-container" ref={dropdownRef}>
                              <div 
                                className={`custom-select-trigger ${isDropdownOpen ? 'open' : ''}`} 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              >
                                  <span>{formData.eventLocation}</span>
                                  <ChevronDown size={16} className={`chevron ${isDropdownOpen ? 'rotate' : ''}`} />
                              </div>
                              {isDropdownOpen && (
                                  <div className="custom-options-list">
                                      {locations.map(loc => (
                                          <div 
                                              key={loc}
                                              className={`custom-option ${formData.eventLocation === loc ? 'selected' : ''}`}
                                              onClick={() => {
                                                  setFormData(prev => ({ ...prev, eventLocation: loc }));
                                                  setIsDropdownOpen(false);
                                              }}
                                          >
                                              {loc}
                                              {formData.eventLocation === loc && <CheckCircle size={14} className="check-icon" />}
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                      </div>
                      <div className="res-group">
                          <label>Specific Venue Address</label>
                          <input 
                              type="text" 
                              name="venueAddress" 
                              value={formData.venueAddress} 
                              onChange={handleChange}
                              placeholder="Building, Street, Brgy, City"
                              required
                          />
                      </div>
                  </div>
                  <div className="res-group full-width">
                      <label>Special Requests or Additional Notes (Optional)</label>
                      <textarea 
                        name="notes" 
                        value={formData.notes} 
                        onChange={handleChange}
                        placeholder="Tell us about your theme preferences, food restrictions, or specific requests..."
                        rows={5}
                      />
                  </div>
              </div>

              <div className="res-disclaimer">
                  <ShieldCheck size={20} /> 
                  <div className="disclaimer-content">
                      <p>By confirming, you agree to our <strong>Terms and Conditions</strong> and accept the <strong>Service Agreement</strong>.</p>
                      <a href="/Virtual_Contract.pdf" download className="contract-download">
                          <FileText size={14} /> Download Virtual Contract
                      </a>
                  </div>
              </div>

              <button type="submit" className="res-submit-btn" disabled={isSubmitting || !isFormValid}>
                      {isSubmitting ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>

          {/* Sticky Side Summary */}
          <div className="res-summary-side">
            <div className="sum-card">
                <h3>Package Summary</h3>
                <div className="sum-dash"></div>
                <div className="sum-package-name">{data?.packageTitle || "Selected Tier"}</div>
                
                <div className="sum-details">
                    <div className="sum-item">
                        <Calendar size={18} color="#c49a2c" />
                        <div className="sum-info">
                            <label>Event Date</label>
                            <span>{data?.selectedDate || "Not Set"}</span>
                        </div>
                    </div>
                    <div className="sum-item">
                        <Users size={18} color="#c49a2c" />
                        <div className="sum-info">
                            <label>Guests</label>
                            <span>{data?.guestCount || "0"} Expected</span>
                        </div>
                    </div>
                </div>

                <div className="sum-breakdown">
                    <div className="l-item"><span>Base Package</span><span>₱{(data?.basePrice || 0).toLocaleString()}</span></div>
                    <div className="l-item"><span>Service Fee (10%)</span><span>₱{(data?.serviceFee || 0).toLocaleString()}</span></div>
                    {(data?.promoDiscount ?? 0) > 0 && (
                        <div className="l-item discard"><span>Promo Applied</span><span>-₱{(data?.promoDiscount || 0).toLocaleString()}</span></div>
                    )}
                    <div className="l-item total"><span>Final Estimated</span><span className="gold-text">₱{(data?.totalPrice || 0).toLocaleString()}</span></div>
                </div>

                <div className="sum-trust">
                    <div className="trust-item secure">
                        <ShieldCheck size={16} />
                        <span>100% Safe & Secured</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
