import React from 'react';
import { X } from 'lucide-react';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for submitting the booking request
    console.log("Booking request submitted");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="modal-header">
          <h2>Book a Tasting Experience</h2>
          <p>Begin your journey towards a curated luxury event.</p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group-alt">
              <label>First Name</label>
              <input type="text" placeholder="e.g. Eleanor" required />
            </div>
            <div className="form-group-alt">
              <label>Middle Name</label>
              <input type="text" placeholder="e.g. Rose" />
            </div>
            <div className="form-group-alt">
              <label>Last Name</label>
              <input type="text" placeholder="e.g. Vance" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group-alt half">
              <label>Age</label>
              <input type="number" placeholder="e.g. 28" required />
            </div>
            <div className="form-group-alt half">
              <label>Mobile Number</label>
              <input type="tel" placeholder="e.g. +63 912 345 6789" required />
            </div>
          </div>

          <div className="form-group-alt">
            <label>Email Address</label>
            <input type="email" placeholder="e.g. eleanor.v@email.com" required />
          </div>

          <div className="form-group-alt">
            <label>Preferred Date & Time</label>
            <input type="datetime-local" required />
          </div>

          <div className="form-row">
            <div className="form-group-alt half">
              <label>Event Type</label>
              <input type="text" placeholder="e.g. Wedding Reception" required />
            </div>
            <div className="form-group-alt half">
              <label>Venue (Proposed)</label>
              <input type="text" placeholder="e.g. The Grand Ballroom" required />
            </div>
          </div>

          <div className="form-group-alt">
            <label>Select Package</label>
            <select required>
              <option value="" disabled selected>Choose a package...</option>
              <option value="intimate">Intimate Package</option>
              <option value="utopian">Utopian Package</option>
              <option value="elite">Elite Package</option>
              <option value="custom">Custom Package</option>
            </select>
          </div>

          <button type="submit" className="booking-submit-btn">
            CONFIRM REQUEST
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
