import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Bell, X } from 'lucide-react';
import { authService } from '../api/auth';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check login state and notifications
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        const user = authService.getStoredUser();
        setUserData(user);
        
        // Load notification settings
        const savedSettings = localStorage.getItem('notificationSettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setNotificationsEnabled(settings.bookingUpdates);
        }

        // Mock some real-time notifications if enabled
        const settings = savedSettings ? JSON.parse(savedSettings) : { bookingUpdates: true };
        if (settings.bookingUpdates) {
          setNotifications([
            { id: 1, text: "Your booking BK-001 has been confirmed!", time: "2 mins ago", unread: true },
            { id: 2, text: "New message from Gala Crafters admin.", time: "1 hour ago", unread: true }
          ]);
        } else {
          setNotifications([]);
        }
      }
    };
    checkAuth();
    
    // Listen for custom events from SettingsPage
    const handleSettingsUpdate = (e: any) => {
      setNotificationsEnabled(e.detail.bookingUpdates);
      if (e.detail.bookingUpdates) {
        // Add a mock notification when enabled
        setNotifications(prev => [
          { id: Date.now(), text: "Booking updates enabled! You'll receive real-time alerts.", time: "Just now", unread: true },
          ...prev
        ]);
      } else {
        setNotifications([]);
      }
    };

    window.addEventListener('notification_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('notification_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', checkAuth);
    };
  }, [location]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showNotifications && !(e.target as Element).closest('.nav-notification-container')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserData(null);
    setShowLogoutModal(false);
    setUserMenuOpen(false);
    navigate('/');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const navClass = `navbar ${scrolled ? 'scrolled' : ''}`;

  return (
    <nav className={navClass}>
      <div className="nav-wrapper">
        <Link to="/" className="logo">
          <div className="diamond"></div>
          GALA CRAFTERS
        </Link>

        <ul className="menu">
          <li><Link to="/events" className="nav-link">EVENTS</Link></li>
          <li className="nav-dropdown">
            <Link to="/services" className="nav-link">SERVICES</Link>
            <div className="dropdown-mega-menu">

              {/* Column 1 */}
              <div className="dropdown-col">
                <Link to="/services/weddings">Weddings</Link>
                <Link to="/corporate" className="nav-link">Corporate</Link>
              </div>

              {/* Column 2 */}
              <div className="dropdown-col">
                <Link to="/debut">Debut</Link>
                <Link to="/services/childrens-party">Children's Party</Link>
              </div>

              {/* Column 3 */}
              <div className="dropdown-col">
                <Link to="/services/special-occasions">Special Occasions</Link>
                <Link to="/services/packages">All Packages</Link>
              </div>

            </div>
          </li>
          <li><Link to="/about" className="nav-link">ABOUT US</Link></li>
          {!isLoggedIn && <li><Link to="/contact" className="nav-link">CONTACT US</Link></li>}
        </ul>

        {!isAuthPage && (
          isLoggedIn ? (
            <div className="user-menu-container">
              <div className="nav-notification-container">
                <button 
                  className="nav-notification-btn" 
                  aria-label="Notifications"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} color="#ffffff" />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="nav-notification-badge">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h3>Notifications</h3>
                      <button onClick={() => setNotifications([])}>Clear all</button>
                    </div>
                    <div className="notification-list">
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                            <div className="notification-content">
                              <p>{notif.text}</p>
                              <span className="notification-time">{notif.time}</span>
                            </div>
                            {notif.unread && <span className="unread-dot"></span>}
                          </div>
                        ))
                      ) : (
                        <div className="empty-notifications">
                          <p>No new notifications</p>
                        </div>
                      )}
                    </div>
                    <div className="notification-footer">
                      <Link to="/settings?tab=notifications" onClick={() => setShowNotifications(false)}>Notification Settings</Link>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="user-icon-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User Menu"
              >
                <User size={20} color="#c49a2c" />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/settings" state={{ tab: 'profile' }} onClick={() => setUserMenuOpen(false)}>My Profile</Link>
                  <Link to="/settings" state={{ tab: 'transactions' }} onClick={() => setUserMenuOpen(false)}>Transaction List</Link>
                  <Link to="/settings" state={{ tab: 'security' }} onClick={() => {
                    setUserMenuOpen(false);
                  }}>Account Settings</Link>
                  <button className="logout-nav-btn" onClick={() => setShowLogoutModal(true)}>Log out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-login-btn sign-up">SIGN IN</Link>
          )
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-container logout-modal-container">
            <div className="logout-modal-content">
              <h2 className="logout-modal-title">Are you sure you want to sign out?</h2>
              
              <div className="logout-modal-actions">
                <button 
                  className="logout-modal-btn cancel" 
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="logout-modal-btn confirm" 
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;