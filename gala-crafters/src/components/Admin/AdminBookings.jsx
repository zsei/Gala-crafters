import React from 'react';
import { Search, Download, Calendar as CalendarIcon, Filter, ChevronDown, MoreVertical, DollarSign,  TrendingUp, ClipboardList } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css'; // Inheriting the primary admin styles

const bookingsData = [
  {
    id: 1,
    clientImg: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    clientName: 'Alexander Wright',
    clientEmail: 'alex.wright@luxury.co',
    tier: 'Wedding',
    tierColor: 'warning',
    date: 'Oct 12, 2023',
    time: '18:00 - 23:00',
    status: 'Confirmed',
    statusColor: 'success',
    valuation: '$15,200.00'
  },
  {
    id: 2,
    clientImg: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    clientName: 'Sophia Loren',
    clientEmail: 's.loren@gala.org',
    tier: 'Gala',
    tierColor: 'info',
    date: 'Oct 15, 2023',
    time: '20:00 - 02:00',
    status: 'Pending',
    statusColor: 'warning',
    valuation: '$22,500.00'
  },
  {
    id: 3,
    clientImg: 'https://i.pravatar.cc/150?u=a04258114e29026708c',
    clientName: 'Julian Vane',
    clientEmail: 'jvane@corporate.net',
    tier: 'Corporate',
    tierColor: 'sub', // grey style
    date: 'Oct 20, 2023',
    time: '09:00 - 17:00',
    status: 'Completed',
    statusColor: 'sub', // grey dot
    valuation: '$8,000.00'
  },
  {
    id: 4,
    clientImg: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
    clientName: 'Isabella Rossi',
    clientEmail: 'i.rossi@luxury.it',
    tier: 'Wedding',
    tierColor: 'warning',
    date: 'Nov 02, 2023',
    time: '16:00 - 23:00',
    status: 'Confirmed',
    statusColor: 'success',
    valuation: '$18,450.00'
  }
];

const AdminBookings = () => {
  // Inherit the theme logic
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('galaAdminTheme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('galaAdminTheme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className={`admin-layout ${isDark ? 'admin-dark-theme' : ''}`}>
      <AdminSidebar isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="admin-main">
        
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
              October 2023
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
            SHOWING 42 ENTRIES
          </div>
        </div>

        {/* Data Table Container */}
        <div className="admin-card bookings-table-card">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>CLIENT DETAILS</th>
                <th>EVENT TIER</th>
                <th>EVENT DATE</th>
                <th>BOOKING STATUS</th>
                <th>VALUATION</th>
                <th></th> 
              </tr>
            </thead>
            <tbody>
              {bookingsData.map((row) => (
                <tr key={row.id}>
                  
                  {/* Client Info */}
                  <td>
                    <div className="client-cell">
                      <img src={row.clientImg} alt={row.clientName} className="client-avatar" />
                      <div className="client-info">
                        <strong>{row.clientName}</strong>
                        <span>{row.clientEmail}</span>
                      </div>
                    </div>
                  </td>

                  {/* Event Tier */}
                  <td>
                    <span className={`tier-badge border-${row.tierColor} text-${row.tierColor}`}>
                      {row.tier}
                    </span>
                  </td>

                  {/* Event Date */}
                  <td>
                    <div className="date-cell">
                      <strong>{row.date}</strong>
                      <span>{row.time}</span>
                    </div>
                  </td>

                  {/* Booking Status */}
                  <td>
                    <div className="status-cell">
                       <span className={`status-dot bg-${row.statusColor}`}></span>
                       <span className={`text-${row.statusColor} font-semibold`}>{row.status}</span>
                    </div>
                  </td>

                  {/* Valuation */}
                  <td>
                    <strong className="valuation-text">{row.valuation}</strong>
                  </td>

                  {/* Actions */}
                  <td className="actions-cell">
                    <button className="more-btn"><MoreVertical size={16} /></button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

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
