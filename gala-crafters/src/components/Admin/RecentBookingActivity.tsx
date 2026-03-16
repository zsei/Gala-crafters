import React from 'react';
import { Search, Filter, MoreHorizontal } from 'lucide-react';

const bookings = [];

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
