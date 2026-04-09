import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS } from '../../api/config';

const RecentBookingActivity = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.BOOKINGS}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Sort by date or id to get most recent, already sorted by event_date ASC actually. 
          // Let's just reverse and take top 5.
          setBookings(data.reverse().slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching recent bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'processing': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  };
  return (
    <div className="admin-card table-card">
      <div className="table-header-toolbar">
        <h3>Recent Booking Activity</h3>
        <div className="table-actions">
           <div className="search-bar">
             <Search size={16} className="search-icon" />
             <input type="text" placeholder="Search bookings..." />
           </div>
           <button className="filter-btn">
             <Filter size={16} /> Filter
           </button>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>BOOKING ID</th>
              <th>CUSTOMER</th>
              <th>PACKAGE TYPE</th>
              <th>DATE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr> :
             bookings.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>No bookings found</td></tr> :
             bookings.map((row, index) => (
              <tr key={index}>
                <td className="font-medium">{row.booking_reference}</td>
                <td>
                  <div className="customer-cell">
                    <span className={`customer-avatar bg-${getStatusColor(row.status)}`}>{row.customer_name?.charAt(0)}</span>
                    {row.customer_name}
                  </div>
                </td>
                <td>{row.package_name}</td>
                <td className="text-sub">{new Date(row.event_date).toLocaleDateString()}</td>
                <td className="font-semibold">${row.total_price?.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <button className="more-btn"><MoreHorizontal size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span className="text-sub">Showing 4 of 156 results</span>
        <div className="pagination">
          <button className="page-btn" disabled>Previous</button>
          <button className="page-btn active-page">Next</button>
        </div>
      </div>
    </div>
  );
};

export default RecentBookingActivity;
