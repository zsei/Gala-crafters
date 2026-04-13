import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, Eye, CheckCircle, Clock, XCircle, List } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS } from '../../api/config';

const RecentBookingActivity = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.BOOKINGS}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const bookingsArray = Array.isArray(data) ? data : (data?.bookings || []);
          // Sort by date to get most recent
          const sorted = [...bookingsArray].sort((a, b) => 
            new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
          );
          setBookings(sorted);
        }
      } catch (error) {
        console.error('Error fetching recent bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'all' || 
      (b.status || '').toLowerCase() === statusFilter.toLowerCase();
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      (b.booking_reference || '').toLowerCase().includes(searchLower) ||
      (b.customer_name || b.first_name || '').toLowerCase().includes(searchLower) ||
      (b.package_name || '').toLowerCase().includes(searchLower) ||
      (b.status || '').toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'on-going event': 
        return 'success';
      case 'pending':
      case 'processing': 
        return 'warning';
      case 'cancelled': 
        return 'danger';
      case 'completed event':
        return 'info';
      default: 
        return 'info';
    }
  };

  return (
    <div className="admin-card table-card">
      <div className="table-header-toolbar">
        <h3>Recent Booking Activity</h3>
        <div className="table-actions">
           <div className="search-bar">
             <Search size={16} className="search-icon" />
             <input 
               type="text" 
               placeholder="Search bookings..." 
               value={searchTerm}
               onChange={(e) => {
                 setSearchTerm(e.target.value);
                 setCurrentPage(1);
               }}
             />
           </div>
           <div style={{ position: 'relative' }}>
             <button 
               className={`filter-btn ${statusFilter !== 'all' ? 'active' : ''}`}
               onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
             >
               <Filter size={16} /> Filter
             </button>
             {filterDropdownOpen && (
               <div className="admin-dropdown-menu" style={{
                 position: 'absolute',
                 top: '100%',
                 right: 0,
                 zIndex: 110,
                 marginTop: '8px',
                 minWidth: '160px',
                 boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
               }}>
                 {[
                   { id: 'all', label: 'All Status', icon: <List size={14} /> },
                   { id: 'pending', label: 'Pending', icon: <Clock size={14} className="text-warning" /> },
                   { id: 'confirmed', label: 'Confirmed', icon: <CheckCircle size={14} className="text-success" /> },
                   { id: 'cancelled', label: 'Cancelled', icon: <XCircle size={14} className="text-danger" /> }
                 ].map(option => (
                   <button
                     key={option.id}
                     className={`dropdown-item ${statusFilter === option.id ? 'active' : ''}`}
                     onClick={() => {
                       setStatusFilter(option.id);
                       setFilterDropdownOpen(false);
                       setCurrentPage(1);
                     }}
                   >
                     {option.icon}
                     {option.label}
                   </button>
                 ))}
               </div>
             )}
           </div>
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
             {loading ? (
               <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
             ) : filteredBookings.length === 0 ? (
               <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>No bookings found</td></tr>
             ) : (
               currentItems.map((row, index) => (
                <tr key={index}>
                  <td className="font-medium">{row.booking_reference}</td>
                  <td>
                    <div className="customer-cell">
                      <span className={`customer-avatar bg-${getStatusColor(row.status)}`}>
                        {(row.customer_name || row.first_name || '?').charAt(0)}
                      </span>
                      {row.customer_name || `${row.first_name || ''} ${row.last_name || ''}`}
                    </div>
                  </td>
                  <td>{row.package_name}</td>
                  <td className="text-sub">{new Date(row.event_date).toLocaleDateString()}</td>
                  <td className="font-semibold">₱{row.total_price?.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ position: 'relative' }}>
                    <button 
                      className="more-btn"
                      onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {openDropdown === index && (
                      <div className="admin-dropdown-menu" style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        zIndex: 100,
                        marginTop: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }}>
                        <button 
                          className="dropdown-item"
                          onClick={() => navigate(`/admin/bookings?ref=${row.booking_reference}`)}
                        >
                          <Eye size={14} /> View Details
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
             )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span className="text-sub">
          Showing {filteredBookings.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of {filteredBookings.length} results
        </span>
        <div className="pagination">
          <button 
            className="page-btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <button 
            className="page-btn" 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentBookingActivity;
