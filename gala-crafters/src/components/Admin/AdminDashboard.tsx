import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, Settings, LogOut, CheckCircle, XCircle, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminOverview from './AdminOverview';
import AdminChart from './AdminChart';
import PendingApprovals from './PendingApprovals';
import RecentBookingActivity from './RecentBookingActivity';
import { authService } from '../../api/auth';
import { formatRelativeTime } from '../../utils/time';
import './Admin.css';

const AdminDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  // Fetch real notifications for admin
  const fetchNotifications = async () => {
    try {
      const data = await authService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await authService.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    } catch (error) {
      console.error('Error marking all read:', error);
    }
  };

  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdminData(JSON.parse(storedAdmin));
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_confirmed': return <CheckCircle size={16} className="text-success" />;
      case 'booking_cancelled': return <XCircle size={16} className="text-danger" />;
      case 'booking_pending': return <Info size={16} className="text-info" />;
      default: return <Bell size={16} className="text-accent" />;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <main className={`admin-main ${isCollapsed ? 'collapsed-main' : ''}`}>
        <header className="admin-header">
          <div className="admin-header-text">
            <h1>Admin Overview</h1>
            <p>Welcome back, Admin. Here's what's happening today.</p>
          </div>
          <div className="admin-header-actions">
            <div className="admin-notification-wrapper" ref={notificationRef}>
              <button 
                className="admin-icon-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={18} />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="notification-dot"></span>
                )}
              </button>

              {showNotifications && (
                <div className="admin-dropdown notification-dropdown">
                  <div className="dropdown-header">
                    <h3>Notifications</h3>
                    {notifications.filter(n => n.unread).length > 0 && (
                      <button onClick={handleMarkAllRead}>Mark all read</button>
                    )}
                  </div>
                  <div className="dropdown-content">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div key={notif.id} className={`dropdown-item ${notif.unread ? 'unread' : ''}`}>
                          <div className="item-icon">
                            {getNotificationIcon(notif.type)}
                          </div>
                          <div className="item-text">
                            <p>{notif.text}</p>
                            <span>{formatRelativeTime(notif.time)}</span>
                          </div>
                          {notif.unread && <div className="unread-indicator"></div>}
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-user-menu-wrapper" ref={userMenuRef}>
              <button 
                className="admin-user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="admin-user-info-brief">
                  <span className="admin-user-name">{adminData?.name || 'Admin'}</span>
                  <span className="admin-user-role">{adminData?.role?.replace('_', ' ').toUpperCase() || 'STAFF'}</span>
                </div>
                <div className="admin-user-avatar">
                  {adminData?.image_url ? (
                    <img src={adminData.image_url} alt="Avatar" />
                  ) : (
                    <User size={18} />
                  )}
                </div>
              </button>

              {showUserMenu && (
                <div className="admin-dropdown user-menu-dropdown">
                  <div className="dropdown-header">
                    <h3>Account Settings</h3>
                  </div>
                  <Link to="/admin/profile" className="dropdown-item">
                    <Settings size={16} />
                    <span>Profile Settings</span>
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item text-danger">
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
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
