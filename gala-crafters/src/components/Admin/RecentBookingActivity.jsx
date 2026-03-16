import React from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';

const bookings = [
  { id: '#GC-10254', initials: 'JS', name: 'Jane Smith', type: 'Wedding Premium', date: 'Oct 24, 2023', amount: '$2,400.00', status: 'Confirmed', statusColor: 'success' },
  { id: '#GC-10255', initials: 'RM', name: 'Robert Miller', type: 'Corporate Expo', date: 'Oct 25, 2023', amount: '$1,850.00', status: 'Pending Review', statusColor: 'warning' },
  { id: '#GC-10256', initials: 'AL', name: 'Alice Lee', type: 'Birthday Bash', date: 'Oct 26, 2023', amount: '$450.00', status: 'Processing', statusColor: 'info' },
  { id: '#GC-10257', initials: 'KW', name: 'Kevin White', type: 'Private Dinner', date: 'Oct 26, 2023', amount: '$320.00', status: 'Cancelled', statusColor: 'danger' },
];

const RecentBookingActivity = () => {
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
            {bookings.map((row, index) => (
              <tr key={index}>
                <td className="font-medium">{row.id}</td>
                <td>
                  <div className="customer-cell">
                    <span className={`customer-avatar bg-${row.statusColor}`}>{row.initials}</span>
                    {row.name}
                  </div>
                </td>
                <td>{row.type}</td>
                <td className="text-sub">{row.date}</td>
                <td className="font-semibold">{row.amount}</td>
                <td>
                  <span className={`status-badge ${row.statusColor}`}>
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
