import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Package, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth';
import './TransactionHistory.css';
import { API_BASE_URL, API_ENDPOINTS } from '../api/config';

interface Booking {
  id: number;
  booking_reference: string;
  event_type: string;
  event_date: string;
  event_time: string;
  venue_proposed: string;
  guest_count: number;
  total_price: number;
  status: string;
  created_at: string;
}

const TransactionHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!authService.isLoggedIn()) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BOOKINGS.USER_HISTORY}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          setError("Failed to load your transaction history.");
        }
      } catch (err) {
        setError("An error occurred while fetching your history.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#ffaa00';
      case 'confirmed': return '#00cc66';
      case 'processing': return '#3399ff';
      case 'cancelled': return '#ff4d4d';
      case 'completed': return '#c49a2c';
      default: return '#ffffff';
    }
  };

  if (loading) {
    return (
      <div className="transactions-loading">
        <div className="premium-loader"></div>
        <p>Retrieving your curated history...</p>
      </div>
    );
  }

  return (
    <div className="transactions-layout">
      <div className="transactions-container">
        <div className="transactions-header">
          <h1 className="page-main-title">Transaction History</h1>
          <p className="subtitle">Track your luxury bookings and event statuses.</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {bookings.length === 0 ? (
          <div className="no-transactions">
            <ShieldCheck size={48} color="#c49a2c" strokeWidth={1} />
            <h2>No bookings found</h2>
            <p>You haven't made any booking requests yet.</p>
            <button className="book-now-btn" onClick={() => navigate('/services')}>
              EXPLORE OUR SERVICES
            </button>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-item-card">
                <div className="booking-card-main">
                  <div className="booking-ref-side">
                    <span className="ref-label">REF NUMBER</span>
                    <span className="ref-value">{booking.booking_reference}</span>
                  </div>
                  
                  <div className="booking-details-side">
                    <div className="booking-top-row">
                      <h3 className="event-title">{booking.event_type}</h3>
                      <div 
                        className="status-badge" 
                        style={{ '--status-color': getStatusColor(booking.status) } as any}
                      >
                        {booking.status}
                      </div>
                    </div>
                    
                    <div className="booking-info-grid">
                      <div className="info-cell">
                        <Calendar size={14} />
                        <span>{new Date(booking.event_date).toLocaleDateString()}</span>
                      </div>
                      <div className="info-cell">
                        <Clock size={14} />
                        <span>{booking.event_time || 'TBD'}</span>
                      </div>
                      <div className="info-cell full-width">
                        <MapPin size={14} />
                        <span>{booking.venue_proposed}</span>
                      </div>
                      <div className="info-cell">
                        <Package size={14} />
                        <span>Approx. {booking.guest_count || 0} Guests</span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-price-side">
                    <div className="price-amount">
                      {booking.total_price > 0 ? `₱${booking.total_price.toLocaleString()}` : "Price Pending"}
                    </div>
                    <button className="view-details-btn">
                      DETAILS <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
