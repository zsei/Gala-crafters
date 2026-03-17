import React from 'react';
import { Search, Download, Calendar as CalendarIcon, Filter, ChevronDown, MoreVertical, DollarSign,  TrendingUp, ClipboardList } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css'; // Inheriting the primary admin styles

const bookingsData = [];

import { API_BASE_URL, API_ENDPOINTS } from '../../api/config';

const AdminBookings = () => {
  // Inherit the theme logic
  const [isDark, setIsDark] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('galaAdminTheme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.BOOKINGS}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        
        const data = await response.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('galaAdminTheme', newTheme ? 'dark' : 'light');
  };

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  // Helper for status colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'processing': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  };

  return (
    <div className={`admin-layout ${isDark ? 'admin-dark-theme' : ''}`}>
      <AdminSidebar 
        isDark={isDark} 
        toggleTheme={toggleTheme}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />
      
      <main className={`admin-main ${isCollapsed ? 'collapsed-main' : ''}`}>
        
        {/* Page Header */}
        <header className="bookings-header">
          <div className="bookings-header-title">
            <h1>Event Bookings</h1>
            <p>Curating and managing high-tier luxury experiences.</p>
          </div>
          
          <div className="bookings-header-actions">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input type="text" placeholder="Search bookings..." />
            </div>
            <button className="export-btn">
              <Download size={16} />
              Export
            </button>
          </div>
        </header>

        {/* Filters & Actions Bar */}
        <div className="bookings-toolbar">
          <div className="filters-group">
            <button className="filter-dropdown">
              <CalendarIcon size={16} className="text-accent" />
              All Dates
              <ChevronDown size={14} className="text-sub" />
            </button>
            <button className="filter-dropdown">
              Type: All Events
              <ChevronDown size={14} className="text-sub" />
            </button>
            <button className="filter-dropdown">
              Status: Any
              <ChevronDown size={14} className="text-sub" />
            </button>
          </div>
          <div className="entries-count text-sub font-medium" style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            SHOWING {bookings.length} ENTRIES
          </div>
        </div>

        {/* Data Table Container */}
        <div className="admin-card bookings-table-card">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-sub)' }}>
              Loading luxury bookings...
            </div>
          ) : error ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-danger-text)' }}>
              Error: {error}
            </div>
          ) : (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>CLIENT DETAILS</th>
                  <th>PACKAGE</th>
                  <th>EVENT DATE</th>
                  <th>BOOKING STATUS</th>
                  <th>TOTAL PRICE</th>
                  <th></th> 
                </tr>
              </thead>
              <tbody>
                {bookings.map((row: any, index: number) => (
                  <tr key={index}>
                    
                    {/* Client Info */}
                    <td>
                      <div className="client-cell">
                        <div className="client-avatar" style={{ backgroundColor: 'var(--admin-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {row.customer_name?.charAt(0)}
                        </div>
                        <div className="client-info">
                          <strong>{row.customer_name}</strong>
                          <span>{row.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Package */}
                    <td>
                      <span className="font-semibold text-accent">
                        {row.package_name}
                      </span>
                    </td>

                    {/* Event Date */}
                    <td>
                      <div className="date-cell">
                        <strong>{new Date(row.event_date).toLocaleDateString()}</strong>
                        <span>{row.venue_proposed || 'Premium Venue'}</span>
                      </div>
                    </td>

                    {/* Booking Status */}
                    <td>
                      <div className="status-cell">
                        <span className={`status-dot bg-${getStatusColor(row.status)}`}></span>
                        <span className={`text-${getStatusColor(row.status)} font-semibold`}>{row.status}</span>
                      </div>
                    </td>

                    {/* Valuation */}
                    <td>
                      <strong className="valuation-text">${row.total_price?.toLocaleString()}</strong>
                    </td>

                    {/* Actions */}
                    <td className="actions-cell">
                      <button className="more-btn"><MoreVertical size={16} /></button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Table Footer / Pagination */}
          <div className="table-footer-alt">
             <span className="text-sub" style={{ fontSize: '13px' }}>Showing 1 to 4 of 42 bookings</span>
             <div className="pagination-compact">
               <button className="page-nav-btn">&lt;</button>
               <button className="page-num active">1</button>
               <button className="page-num">2</button>
               <button className="page-num">3</button>
               <button className="page-nav-btn">&gt;</button>
             </div>
          </div>
        </div>

        {/* Summary Cards Row */}
        <div className="bookings-summary-grid">
           
           <div className="admin-card summary-card">
             <div className="summary-icon-row">
               <div className="summary-icon-badge bg-success-light text-success">
                 <DollarSign size={20} />
               </div>
               <div className="summary-info">
                 <span>REVENUE (MTD)</span>
                 <h3>$142,800</h3>
               </div>
             </div>
           </div>

           <div className="admin-card summary-card">
             <div className="summary-icon-row">
               <div className="summary-icon-badge bg-warning-light text-warning">
                 <ClipboardList size={20} />
               </div>
               <div className="summary-info">
                 <span>PENDING PROPOSALS</span>
                 <h3>12</h3>
               </div>
             </div>
           </div>

           <div className="admin-card summary-card">
             <div className="summary-icon-row">
               <div className="summary-icon-badge bg-accent-light text-accent">
                 <TrendingUp size={20} />
               </div>
               <div className="summary-info">
                 <span>AVERAGE BOOKING</span>
                 <h3>$18,650</h3>
               </div>
             </div>
           </div>

        </div>

      </main>
    </div>
  );
};

export default AdminBookings;
