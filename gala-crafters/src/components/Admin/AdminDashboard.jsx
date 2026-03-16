import React, { useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminOverview from './AdminOverview';
import AdminChart from './AdminChart';
import PendingApprovals from './PendingApprovals';
import RecentBookingActivity from './RecentBookingActivity';
import './Admin.css';


const AdminDashboard = () => {
  // Theme state
  const [isDark, setIsDark] = useState(false);

  // Load theme from localStorage on initial render
  useEffect(() => {
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
        <header className="admin-header">
          <div className="admin-header-text">
            <h1>Admin Overview</h1>
            <p>Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="admin-header-actions">
            <button className="admin-icon-btn">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </button>
            <button className="admin-icon-btn">
              <User size={18} />
            </button>
          </div>
        </header>

        <AdminOverview />

        <div className="admin-grid-middle">
          <AdminChart />
          <PendingApprovals />
        </div>

        <RecentBookingActivity />

      </main>
    </div>
  );
};

export default AdminDashboard;
