import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminAvailabilityCalendar from './AdminAvailabilityCalendar';
import './Admin.css';

const AdminCalendarPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="admin-layout">
      <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      <main className={`admin-main ${isCollapsed ? 'collapsed-main' : ''}`}>
        <header className="bookings-header">
          <div className="bookings-header-title">
            <h1>Booking calendar</h1>
            <p>
              Days with an active reservation appear in rose as <strong>Booked</strong> (not clickable). Gold
              strikethrough days are <strong>Day off</strong> — click to toggle. Customers cannot pick booked or
              day-off dates.
            </p>
          </div>
        </header>

        <div className="admin-calendar-page-card">
          <AdminAvailabilityCalendar />
        </div>
      </main>
    </div>
  );
};

export default AdminCalendarPage;
