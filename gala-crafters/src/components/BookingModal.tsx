import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './BookingModal.css';
import { API_BASE_URL, API_ENDPOINTS } from '../api/config';

const BookingModal = ({ isOpen, onClose, initialEventType = "" }) => {
  const [formData, setFormData] = useState({
    package_id: "",
    event_date: "",
    event_time: "",
    event_type: initialEventType,
    venue_proposed: "",
    guest_count: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, event_type: initialEventType }));
      setSuccess(false);
      setError("");
    }
  }, [isOpen, initialEventType]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please log in to make a booking.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BOOKINGS.CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          package_id: parseInt(formData.package_id),
          guest_count: formData.guest_count ? parseInt(formData.guest_count) : null
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(data.detail || "Failed to submit booking request.");
      }
    } catch (err) {
      setError("An error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="booking-modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="booking-modal-header">
          <h2>{success ? "Request Sent!" : "Book your Event"}</h2>
          <p>{success ? "We'll get back to you shortly." : "Begin your journey towards a curated luxury event."}</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#c49a2c' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
            <p style={{ fontFamily: 'DM Sans', fontSize: '16px' }}>Your booking request has been submitted successfully.</p>
          </div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            {error && <div style={{ color: '#ff4d4d', fontSize: '12px', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
            
            <div className="form-row">
              <div className="form-group-alt">
                <label>Event Type</label>
                <input 
                  type="text" 
                  name="event_type" 
                  value={formData.event_type} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. Wedding, Corporate"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-alt half">
                <label>Preferred Date</label>
                <input 
                  type="date" 
                  name="event_date" 
                  value={formData.event_date} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group-alt half">
                <label>Preferred Time</label>
                <input 
                  type="time" 
                  name="event_time" 
                  value={formData.event_time} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group-alt half">
                <label>Proposed Venue</label>
                <input 
                  type="text" 
                  name="venue_proposed" 
                  value={formData.venue_proposed} 
                  onChange={handleChange} 
                  required 
                  placeholder="Venue name or city"
                />
              </div>
              <div className="form-group-alt half">
                <label>Guest Count</label>
                <input 
                  type="number" 
                  name="guest_count" 
                  value={formData.guest_count} 
                  onChange={handleChange} 
                  placeholder="Approx. number"
                />
              </div>
            </div>

            <div className="form-group-alt">
              <label>Select Package</label>
              <select name="package_id" value={formData.package_id} onChange={handleChange} required>
                <option value="" disabled>Choose a package...</option>
                <option value="1">Intimate Package (Wedding)</option>
                <option value="2">Elite Package (Wedding)</option>
                <option value="3">Utopian Package (Wedding)</option>
                <option value="4">Classic Corporate</option>
                <option value="5">Premium Corporate</option>
              </select>
            </div>

            <div className="form-group-alt">
              <label>Additional Notes</label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange} 
                placeholder="Any special requests?"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(196, 154, 44, 0.2)',
                  padding: '14px 16px',
                  color: '#ffffff',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '14px',
                  borderRadius: '4px',
                  minHeight: '80px',
                  outline: 'none'
                }}
              />
            </div>

            <button type="submit" className="booking-submit-btn" disabled={loading}>
              {loading ? "PROCCESSING..." : "CONFIRM REQUEST"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
