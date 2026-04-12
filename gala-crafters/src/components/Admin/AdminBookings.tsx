import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Download, Calendar as CalendarIcon, Filter, ChevronDown, MoreVertical, DollarSign,  TrendingUp, ClipboardList, AlertCircle, CheckCircle, XCircle, Clock, CalendarDays, CalendarRange } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css'; // Inheriting the primary admin styles

const bookingsData = [];

import { API_BASE_URL, API_ENDPOINTS } from '../../api/config';

const AdminBookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';
  const refSearch = searchParams.get('ref') || '';
  
  // Inherit the theme logic
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [metrics, setMetrics] = React.useState<any>({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = React.useState(refSearch);
  const [dateFilterOpen, setDateFilterOpen] = React.useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = React.useState('all');
  const [typeFilterOpen, setTypeFilterOpen] = React.useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = React.useState('all');
  
  // Dropdown and modal states
  const [openDropdown, setOpenDropdown] = React.useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);
  
  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = React.useState<{
    show: boolean;
    title: string;
    message: string;
    confirmText: string;
    type: 'danger' | 'warning' | 'primary' | 'success';
    onConfirm: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    type: 'primary',
    onConfirm: () => {}
  });
  
  // Notification state
  const [notification, setNotification] = React.useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });

  const showNotification = (type: 'success' | 'error', title: string, message: string) => {
    setNotification({ show: true, type, title, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  React.useEffect(() => {
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
        console.log('Bookings API response:', data);
        
        // Ensure data is always an array
        const bookingsArray = Array.isArray(data) ? data : (data?.bookings || []);
        console.log('Processed bookings:', bookingsArray);
        setBookings(bookingsArray);
      } catch (err: any) {
        setError(err.message);
        setBookings([]); // Set empty array on error
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.METRICS}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error('Error fetching metrics:', err);
      }
    };

    fetchBookings();
    fetchMetrics();
  }, []);

  // Effect to handle ref parameter changes (when coming from Reviews page)
  React.useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setSearchTerm(ref);
      // Optional: clear the ref param after applying it to search
      // const newParams = new URLSearchParams(searchParams);
      // newParams.delete('ref');
      // setSearchParams(newParams);
    }
  }, [searchParams]);

  // Action handlers
  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
    setOpenDropdown(null);
  };

  const handleConfirmBooking = (booking: any) => {
    setConfirmModal({
      show: true,
      title: 'Confirm Booking',
      message: `Are you sure you want to confirm this booking for ${booking.first_name || booking.customer_name}?`,
      confirmText: 'Confirm Booking',
      type: 'success',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, show: false }));
        try {
          setActionLoading(true);
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${booking.booking_reference}/confirm`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            setBookings(bookings.map(b => 
              b.booking_reference === booking.booking_reference 
                ? { ...b, status: 'Confirmed' } 
                : b
            ));
            setOpenDropdown(null);
            setShowDetailsModal(false);
            showNotification('success', 'Booking Confirmed', 'The booking has been confirmed successfully!');
          } else {
            showNotification('error', 'Confirmation Failed', 'Failed to confirm the booking');
          }
        } catch (err) {
          console.error('Error confirming booking:', err);
          showNotification('error', 'Error', 'Error confirming booking');
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const handleCancelBooking = (booking: any) => {
    setConfirmModal({
      show: true,
      title: 'Cancel Booking',
      message: `Are you sure you want to cancel this booking for ${booking.first_name || booking.customer_name}? This action cannot be undone.`,
      confirmText: 'Cancel Booking',
      type: 'danger',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, show: false }));
        try {
          setActionLoading(true);
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${booking.booking_reference}/cancel`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            setBookings(bookings.map(b => 
              b.booking_reference === booking.booking_reference 
                ? { ...b, status: 'Cancelled' } 
                : b
            ));
            setOpenDropdown(null);
            setShowDetailsModal(false);
            showNotification('success', 'Booking Cancelled', 'The booking has been cancelled successfully!');
          } else {
            showNotification('error', 'Cancellation Failed', 'Failed to cancel the booking');
          }
        } catch (err) {
          console.error('Error cancelling booking:', err);
          showNotification('error', 'Error', 'Error cancelling booking');
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const handleCompleteBooking = (booking: any) => {
    setConfirmModal({
      show: true,
      title: 'Complete Event',
      message: `Are you sure you want to mark this booking for ${booking.first_name || booking.customer_name} as Completed?`,
      confirmText: 'Mark Completed',
      type: 'primary',
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, show: false }));
        try {
          setActionLoading(true);
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/api/admin/bookings/${booking.booking_reference}/complete`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            setBookings(bookings.map(b => 
              b.booking_reference === booking.booking_reference 
                ? { ...b, status: 'Completed Event' } 
                : b
            ));
            setOpenDropdown(null);
            setShowDetailsModal(false);
            showNotification('success', 'Booking Completed', 'The booking has been marked as completed successfully!');
          } else {
            showNotification('error', 'Update Failed', 'Failed to mark the booking as completed');
          }
        } catch (err) {
          console.error('Error completing booking:', err);
          showNotification('error', 'Error', 'Error completing booking');
        } finally {
          setActionLoading(false);
        }
      }
    });
  };

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  // Map URL status parameter to actual database status values
  const getActualStatusValue = (urlParam: string): string[] => {
    const statusMap: { [key: string]: string[] } = {
      'pending': ['Pending'],
      'confirmed': ['Confirmed', 'On-going Event'],
      'ongoing': ['On-going Event'],
      'completed': ['Completed Event'],
      'cancelled': ['Cancelled'],
      'all': []
    };
    return statusMap[urlParam] || [];
  };

  const isWithinDateRange = (bookingDateStr: string, filter: string) => {
    if (filter === 'all' || !bookingDateStr) return true;
    
    const bookingDate = new Date(bookingDateStr);
    bookingDate.setHours(0, 0, 0, 0); // Normalize to start of day

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
      case 'today':
        return bookingDate.getTime() === today.getTime();
      case 'this-week': {
        // Intuitive "This Week": Last 7 days including today
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);

        const match = bookingDate >= sevenDaysAgo && bookingDate <= endOfToday;
        return match;
      }
      case 'this-month':
        return bookingDate.getMonth() === today.getMonth() && bookingDate.getFullYear() === today.getFullYear();
      case 'this-year':
        return bookingDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  };

  // Filter bookings based on status, search, date, and type
  const actualStatuses = getActualStatusValue(statusFilter);
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || actualStatuses.includes(booking.status || '');
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      (booking.first_name || booking.customer_name || '').toLowerCase().includes(searchLower) ||
      (booking.last_name || '').toLowerCase().includes(searchLower) ||
      (booking.email || '').toLowerCase().includes(searchLower) ||
      (booking.booking_reference || '').toLowerCase().includes(searchLower) ||
      (booking.package_name || '').toLowerCase().includes(searchLower) ||
      (booking.venue_proposed || '').toLowerCase().includes(searchLower) ||
      (booking.specific_venue_address || '').toLowerCase().includes(searchLower);
      
    const matchesDate = isWithinDateRange(booking.booked_date || booking.event_date, selectedDateFilter);
    
    const matchesType = selectedTypeFilter === 'all' || 
      (booking.package_name || '').toLowerCase().includes(selectedTypeFilter.toLowerCase());
      
    return matchesStatus && matchesSearch && matchesDate && matchesType;
  });

  // Calculate Paginated Bookings
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination Handlers
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setOpenDropdown(null);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setOpenDropdown(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      setOpenDropdown(null);
    }
  };

  const handleExport = () => {
    if (filteredBookings.length === 0) {
      showNotification('error', 'No Data', 'There are no bookings to export');
      return;
    }

    // Prepare CSV data
    const headers = ['Booking ID', 'Client Name', 'Email', 'Phone', 'Package', 'Event Date', 'Booked Date', 'Guest Count', 'Status', 'Total Price', 'Venue', 'Location'];
    const csvContent = [
      headers.join(','),
      ...filteredBookings.map(booking => [
        booking.booking_reference || '',
        `"${(booking.first_name || '') + ' ' + (booking.last_name || '')}"`,
        booking.email || '',
        booking.phone_number || '',
        `"${booking.package_name || ''}"`,
        booking.event_date || '',
        booking.booked_date || '',
        booking.guest_count || '',
        booking.status || '',
        booking.total_price || '',
        `"${booking.venue_proposed || ''}"`,
        `"${booking.specific_venue_address || ''}"`
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('success', 'Export Successful', `${filteredBookings.length} bookings exported`);
  };

  // Reset page and close dropdowns when filter or search changes
  React.useEffect(() => {
    setCurrentPage(1);
    setDateFilterOpen(false);
    setTypeFilterOpen(false);
  }, [statusFilter, searchTerm]);

  // Helper for status colors
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'on-going event': return 'primary';
      case 'completed event': return 'secondary';
      case 'cancelled': return 'danger';
      default: return 'info';
    }
  };

  // Helper for page title
  const getPageTitle = () => {
    switch (statusFilter) {
      case 'pending': return 'Pending Bookings';
      case 'confirmed': return 'Confirmed Bookings';
      case 'ongoing': return 'On-going Events';
      case 'completed': return 'Completed Events';
      case 'cancelled': return 'Cancelled Bookings';
      default: return 'All Event Bookings';
    }
  };

  // Helper for date filter label
  const getDateFilterLabel = () => {
    switch (selectedDateFilter) {
      case 'today': return 'Today';
      case 'this-week': return 'This Week';
      case 'this-month': return 'This Month';
      case 'this-year': return 'This Year';
      default: return 'All Dates';
    }
  };

  // Helper for type filter label
  const getTypeFilterLabel = () => {
    switch (selectedTypeFilter) {
      case 'wedding': return 'Type: Wedding';
      case 'corporate': return 'Type: Corporate';
      case 'debut': return 'Type: Debut';
      case 'party': return 'Type: Children\'s Party';
      default: return 'Type: All Events';
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar 
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />
      
      <main className={`admin-main ${isCollapsed ? 'collapsed-main' : ''}`}>
        
        {/* Page Header */}
        <header className="bookings-header">
          <div className="bookings-header-title">
            <h1>{getPageTitle()}</h1>
            <p>Curating and managing high-tier luxury experiences.</p>
          </div>
          
          <div className="bookings-header-actions">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="export-btn" onClick={handleExport}>
              <Download size={16} />
              Export
            </button>
          </div>
        </header>

        {/* Filters & Actions Bar */}
        <div className="bookings-toolbar">
          <div className="filters-group">
            <div style={{ position: 'relative' }}>
              <button 
                className={`filter-dropdown ${selectedDateFilter !== 'all' ? 'active' : ''}`}
                onClick={() => setDateFilterOpen(!dateFilterOpen)}
              >
                <CalendarIcon size={16} className="text-accent" />
                {getDateFilterLabel()}
                <ChevronDown size={14} className="text-sub" />
              </button>

              {dateFilterOpen && (
                <div className="admin-dropdown-menu" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '8px',
                  zIndex: 100,
                  minWidth: '160px'
                }}>
                  {[
                    { id: 'all', label: 'All Dates', icon: <CalendarIcon size={14} /> },
                    { id: 'today', label: 'Today', icon: <Clock size={14} /> },
                    { id: 'this-week', label: 'This Week', icon: <CalendarDays size={14} /> },
                    { id: 'this-month', label: 'This Month', icon: <CalendarRange size={14} /> },
                    { id: 'this-year', label: 'This Year', icon: <CalendarIcon size={14} /> }
                  ].map(option => (
                    <button
                      key={option.id}
                      className={`dropdown-item ${selectedDateFilter === option.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedDateFilter(option.id);
                        setDateFilterOpen(false);
                      }}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {statusFilter === 'all' && (
              <div style={{ position: 'relative' }}>
                <button 
                  className={`filter-dropdown ${selectedTypeFilter !== 'all' ? 'active' : ''}`}
                  onClick={() => setTypeFilterOpen(!typeFilterOpen)}
                >
                  {getTypeFilterLabel()}
                  <ChevronDown size={14} className="text-sub" />
                </button>

                {typeFilterOpen && (
                  <div className="admin-dropdown-menu" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '8px',
                    zIndex: 100,
                    minWidth: '200px'
                  }}>
                    {[
                      { id: 'all', label: 'All Events' },
                      { id: 'wedding', label: 'Weddings' },
                      { id: 'corporate', label: 'Corporate' },
                      { id: 'debut', label: 'Debut' },
                      { id: 'party', label: 'Children\'s Party' }
                    ].map(option => (
                      <button
                        key={option.id}
                        className={`dropdown-item ${selectedTypeFilter === option.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedTypeFilter(option.id);
                          setTypeFilterOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="entries-count text-sub font-medium" style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            SHOWING {filteredBookings.length} ENTRIES
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
          ) : filteredBookings.length === 0 ? (
            <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--admin-text-sub)' }}>
              <ClipboardList size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
              {searchTerm ? (
                <>
                  <p style={{ fontSize: '16px', marginBottom: '10px' }}>No bookings found for "{searchTerm}"</p>
                  <p style={{ fontSize: '13px', opacity: 0.7 }}>Try adjusting your search or filters to find what you're looking for</p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '16px', marginBottom: '10px' }}>No {statusFilter !== 'all' ? statusFilter : 'active'} bookings yet</p>
                  <p style={{ fontSize: '13px', opacity: 0.7 }}>New customer bookings will appear here once submitted</p>
                </>
              )}
            </div>
          ) : (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>BOOKING ID</th>
                  <th>CLIENT DETAILS</th>
                  <th>PACKAGE</th>
                  <th>BOOKED DATE</th>
                  <th>EVENT DATE</th>
                  <th>BOOKING STATUS</th>
                  <th>TOTAL PRICE</th>
                  <th></th> 
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((row: any, index: number) => (
                  <tr key={index}>
                    {/* Booking ID */}
                    <td>
                      <span className="font-mono text-accent text-sm font-bold">
                        {row.booking_reference || 'N/A'}
                      </span>
                    </td>

                    {/* Client Info */}
                    <td>
                      <div className="client-cell">
                        <div className="client-avatar" style={{ backgroundColor: 'var(--admin-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {row.first_name && row.last_name 
                            ? `${row.first_name.charAt(0)}${row.last_name.charAt(0)}` 
                            : (row.first_name || row.customer_name)?.charAt(0) || '?'}
                        </div>
                        <div className="client-info">
                          <strong>{row.first_name || row.customer_name} {row.last_name || ''}</strong>
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

                    {/* Booked Date */}
                    <td>
                      <div className="date-cell">
                        <strong>{row.booked_date ? new Date(row.booked_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</strong>
                        <span style={{ fontSize: '10px', opacity: 0.7 }}>
                          {row.booked_date ? new Date(row.booked_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </td>

                    {/* Event Date */}
                    <td>
                      <div className="date-cell">
                        <strong>{row.event_date ? new Date(row.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</strong>
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
                      <strong className="valuation-text">₱{row.total_price?.toLocaleString()}</strong>
                    </td>

                    {/* Actions */}
                    <td className="actions-cell">
                      <div style={{ position: 'relative' }}>
                        <button 
                          className="more-btn"
                          onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {openDropdown === index && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            backgroundColor: 'var(--admin-card-bg)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            zIndex: 1000,
                            minWidth: '200px',
                            overflow: 'hidden',
                            marginTop: '8px'
                          }}>
                            <button
                              onClick={() => handleViewDetails(row)}
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: 'none',
                                background: 'none',
                                color: 'var(--admin-text)',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '13px',
                                borderBottom: '1px solid var(--admin-border)',
                                transition: 'background 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--admin-hover)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                            >
                              View Details
                            </button>
                            
                            {row.status === 'Pending' && (
                              <button
                                onClick={() => handleConfirmBooking(row)}
                                disabled={actionLoading}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: 'none',
                                  background: 'none',
                                  color: '#4CAF50',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  fontWeight: '500',
                                  borderBottom: '1px solid var(--admin-border)',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-hover)')}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >
                                Confirm Booking
                              </button>
                            )}
                            
                            {(row.status === 'Pending' || row.status === 'Confirmed') && (
                              <button
                                onClick={() => handleCancelBooking(row)}
                                disabled={actionLoading}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: 'none',
                                  background: 'none',
                                  color: '#FF3B30',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  fontWeight: '500',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-hover)')}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >
                                Cancel Booking
                              </button>
                            )}
                            
                            {row.status === 'On-going Event' && (
                              <button
                                onClick={() => handleCompleteBooking(row)}
                                disabled={actionLoading}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  border: 'none',
                                  background: 'none',
                                  color: 'var(--admin-accent)',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  fontWeight: '600',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--admin-hover)')}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >
                                Mark as Completed
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Table Footer / Pagination */}
          {filteredBookings.length > 0 && (
            <div className="table-footer-alt">
               <span className="text-sub" style={{ fontSize: '13px' }}>
                 Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBookings.length)} of {filteredBookings.length} bookings
               </span>
               <div className="pagination-compact">
                 <button 
                   className={`page-nav-btn ${currentPage === 1 ? 'disabled' : ''}`}
                   onClick={handlePrevPage}
                   disabled={currentPage === 1}
                 >
                   &lt;
                 </button>
                 
                 {[...Array(totalPages)].map((_, i) => (
                   <button 
                     key={i + 1}
                     className={`page-num ${currentPage === i + 1 ? 'active' : ''}`}
                     onClick={() => handlePageChange(i + 1)}
                   >
                     {i + 1}
                   </button>
                 ))}
                 
                 <button 
                   className={`page-nav-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                   onClick={handleNextPage}
                   disabled={currentPage === totalPages}
                 >
                   &gt;
                 </button>
               </div>
            </div>
          )}
        </div>

        {/* Summary Cards Row */}
        <div className="bookings-summary-grid">
           
           <div className="admin-card summary-card">
             <div className="summary-icon-row">
               <div className="summary-icon-badge bg-success-light text-success">
                 <DollarSign size={20} />
               </div>
               <div className="summary-info">
                 <span>TOTAL REVENUE</span>
                 <h3>₱{(metrics.total_revenue || 0).toLocaleString()}</h3>
               </div>
             </div>
           </div>

           <div className="admin-card summary-card">
             <div className="summary-icon-row">
               <div className="summary-icon-badge bg-warning-light text-warning">
                 <ClipboardList size={20} />
               </div>
               <div className="summary-info">
                 <span>PENDING APPROVALS</span>
                 <h3>{metrics.pending_approvals || 0}</h3>
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
                 <h3>₱{metrics.active_bookings && metrics.active_bookings > 0 ? Math.round((metrics.total_revenue || 0) / metrics.active_bookings).toLocaleString() : 0}</h3>
               </div>
             </div>
           </div>

        </div>

      </main>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'var(--admin-card-bg)',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '1000px',
            width: '100%',
            maxHeight: '95vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'sticky', top: 0, backgroundColor: 'var(--admin-card-bg)', paddingBottom: '16px', borderBottom: '1px solid var(--admin-border)' }}>
              <h2 style={{ color: 'var(--admin-text)', margin: 0, fontSize: '20px' }}>Booking Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--admin-text-sub)',
                  cursor: 'pointer',
                  fontSize: '24px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--admin-text)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--admin-text-sub)'}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Booking Reference</label>
                <p style={{ color: 'var(--admin-accent)', fontSize: '16px', fontWeight: '700', margin: '8px 0 0 0' }}>{selectedBooking.booking_reference || 'N/A'}</p>
              </div>
              <div>
                <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</label>
                <p style={{ margin: '8px 0 0 0' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    backgroundColor: selectedBooking.status === 'Pending' ? 'rgba(255, 152, 0, 0.15)' : 
                                    selectedBooking.status === 'Confirmed' ? 'rgba(76, 175, 80, 0.15)' : 
                                    selectedBooking.status === 'On-going Event' ? 'rgba(33, 150, 243, 0.15)' :
                                    'rgba(255, 59, 48, 0.15)',
                    color: selectedBooking.status === 'Pending' ? '#FF9800' : 
                          selectedBooking.status === 'Confirmed' ? '#4CAF50' : 
                          selectedBooking.status === 'On-going Event' ? '#2196F3' :
                          '#FF3B30',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {selectedBooking.status}
                  </span>
                </p>
              </div>
              <div>
                <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Price</label>
                <p style={{ color: 'var(--admin-accent)', fontSize: '16px', fontWeight: '700', margin: '8px 0 0 0' }}>${selectedBooking.total_price?.toLocaleString()}</p>
              </div>
            </div>

            {/* PERSONAL INFORMATION SECTION */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ color: 'var(--admin-text)', margin: '0 0 16px 0', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '2px solid var(--admin-accent)', paddingBottom: '12px' }}>👤 Personal Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>First Name</label>
                  <p style={{ color: 'var(--admin-text)', fontSize: '15px', fontWeight: '500', margin: '6px 0 0 0' }}>{selectedBooking.first_name || 'N/A'}</p>
                </div>

                <div>
                  <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Last Name</label>
                  <p style={{ color: 'var(--admin-text)', fontSize: '15px', fontWeight: '500', margin: '6px 0 0 0' }}>{selectedBooking.last_name || 'N/A'}</p>
                </div>

                <div>
                  <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
                  <p style={{ color: 'var(--admin-text)', fontSize: '15px', fontWeight: '500', margin: '6px 0 0 0' }}>{selectedBooking.email}</p>
                </div>

                <div>
                  <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</label>
                  <p style={{ color: 'var(--admin-text)', fontSize: '15px', fontWeight: '500', margin: '6px 0 0 0' }}>{selectedBooking.phone_number || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* BOOKING INFORMATION SECTION */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ color: 'var(--admin-text)', margin: '0 0 16px 0', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '2px solid var(--admin-accent)', paddingBottom: '12px' }}>📅 Booking Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Base Package</label>
                  <p style={{ color: 'var(--admin-text)', fontSize: '15px', fontWeight: '600', margin: '6px 0 0 0' }}>{selectedBooking.package_name}</p>
                </div>

                <div>
                  <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Event Date</label>
                  <p style={{ color: 'var(--admin-text)', fontSize: '15px', fontWeight: '600', margin: '6px 0 0 0' }}>{new Date(selectedBooking.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div>
                  <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Guest Count</label>
                  <p style={{ color: 'var(--admin-text)', fontSize: '15px', fontWeight: '600', margin: '6px 0 0 0' }}>{selectedBooking.guest_count} guests</p>
                </div>

                <div>
                  <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Venue / Location</label>
                  <p style={{ color: 'var(--admin-text)', fontSize: '15px', fontWeight: '600', margin: '6px 0 0 0' }}>{selectedBooking.venue_proposed}</p>
                </div>
              </div>
            </div>

            {/* EVENT CUSTOMIZATION SECTION */}
            {(selectedBooking.event_theme || selectedBooking.color_palette || selectedBooking.event_location || selectedBooking.specific_venue_address || selectedBooking.special_requests) && (
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ color: 'var(--admin-text)', margin: '0 0 16px 0', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '2px solid var(--admin-accent)', paddingBottom: '12px' }}>🎨 Event Customization</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                  {selectedBooking.event_theme && (
                    <div>
                      <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Theme of Event</label>
                      <p style={{ color: 'var(--admin-text)', fontSize: '15px', fontWeight: '500', margin: '6px 0 0 0' }}>{selectedBooking.event_theme}</p>
                    </div>
                  )}
                  
                  {selectedBooking.color_palette && (
                    <div>
                      <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Color Palette</label>
                      <p style={{ color: 'var(--admin-text)', fontSize: '15px', fontWeight: '500', margin: '6px 0 0 0' }}>{selectedBooking.color_palette}</p>
                    </div>
                  )}
                  
                  {selectedBooking.event_location && (
                    <div>
                      <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Event Location / Area</label>
                      <p style={{ color: 'var(--admin-text)', fontSize: '15px', fontWeight: '500', margin: '6px 0 0 0' }}>{selectedBooking.event_location}</p>
                    </div>
                  )}
                  
                  {selectedBooking.specific_venue_address && (
                    <div>
                      <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Specific Venue Address</label>
                      <p style={{ color: 'var(--admin-text)', fontSize: '15px', fontWeight: '500', margin: '6px 0 0 0' }}>{selectedBooking.specific_venue_address}</p>
                    </div>
                  )}
                </div>
                
                {selectedBooking.special_requests && (
                  <div>
                    <label style={{ color: 'var(--admin-text-sub)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Additional Customer Notes</label>
                    <p style={{ color: 'var(--admin-text)', fontSize: '14px', lineHeight: '1.6', backgroundColor: 'var(--admin-input-bg)', padding: '12px', borderRadius: '6px', margin: '6px 0 0 0', borderLeft: '3px solid var(--admin-accent)' }}>{selectedBooking.special_requests}</p>
                  </div>
                )}
              </div>
            )}

            {/* ADMIN NOTES SECTION */}
            {selectedBooking.notes && (
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ color: 'var(--admin-text)', margin: '0 0 16px 0', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', borderBottom: '2px solid var(--admin-accent)', paddingBottom: '12px' }}>📝 Customer Notes</h3>
                <p style={{ color: 'var(--admin-text)', fontSize: '14px', lineHeight: '1.6', backgroundColor: 'var(--admin-input-bg)', padding: '12px', borderRadius: '6px', margin: '0', borderLeft: '3px solid var(--admin-accent)' }}>{selectedBooking.notes}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', paddingTop: '20px', borderTop: '1px solid var(--admin-border)', flexWrap: 'wrap' }}>
              {selectedBooking.status === 'Pending' && (
                <button
                  onClick={() => handleConfirmBooking(selectedBooking)}
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    minWidth: '150px',
                    padding: '12px 16px',
                    backgroundColor: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  ✓ Confirm Booking
                </button>
              )}
              
              {(selectedBooking.status === 'Pending' || selectedBooking.status === 'Confirmed') && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking)}
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    minWidth: '150px',
                    padding: '12px 16px',
                    backgroundColor: '#FF3B30',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  ✕ Cancel Booking
                </button>
              )}

              {selectedBooking.status === 'On-going Event' && (
                <button
                  onClick={() => handleCompleteBooking(selectedBooking)}
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    minWidth: '150px',
                    padding: '12px 16px',
                    backgroundColor: 'var(--admin-accent)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  ✓ Mark Completed
                </button>
              )}

              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  flex: 1,
                  minWidth: '150px',
                  padding: '12px 16px',
                  backgroundColor: 'var(--admin-hover)',
                  color: 'var(--admin-text)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-input-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-hover)';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Confirmation Modal */}
      {confirmModal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 4000,
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            backgroundColor: 'var(--admin-card-bg)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
            border: '1px solid var(--admin-border)',
            animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              backgroundColor: confirmModal.type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 
                               confirmModal.type === 'primary' ? 'rgba(196, 154, 44, 0.1)' : 
                               'rgba(59, 130, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: confirmModal.type === 'danger' ? '#ef4444' : 
                     confirmModal.type === 'primary' ? 'var(--admin-accent)' : 
                     '#3b82f6'
            }}>
              {confirmModal.type === 'danger' ? <XCircle size={32} /> : 
               confirmModal.type === 'success' ? <CheckCircle size={32} /> : 
               <AlertCircle size={32} />}
            </div>
            
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              color: 'var(--admin-text-main)', 
              marginBottom: '12px',
              fontFamily: "'Playfair Display', serif"
            }}>{confirmModal.title}</h2>
            
            <p style={{ 
              fontSize: '15px', 
              color: 'var(--admin-text-sub)', 
              lineHeight: '1.6',
              marginBottom: '32px'
            }}>{confirmModal.message}</p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: '1px solid var(--admin-border)',
                  backgroundColor: 'transparent',
                  color: 'var(--admin-text-main)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--admin-bg)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: confirmModal.type === 'danger' ? '#ef4444' : 'var(--admin-accent)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: notification.type === 'success' ? '#4CAF50' : '#FF3B30',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideIn 0.3s ease-in-out'
        }}>
          <span style={{ fontSize: '20px' }}>
            {notification.type === 'success' ? '✓' : '✕'}
          </span>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>{notification.title}</div>
            <div style={{ fontSize: '13px', opacity: 0.9 }}>{notification.message}</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminBookings;
