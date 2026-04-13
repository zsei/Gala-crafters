import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Bell, X } from 'lucide-react';
import { authService } from '../api/auth';
import { formatRelativeTime } from '../utils/time';

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
    const fetchNotifications = async () => {
      const data = await authService.getNotifications();
      setNotifications(data);
    };

    const checkAuth = async () => {
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

        // Fetch real notifications from API
        await fetchNotifications();
      } else {
        setNotifications([]);
        setUserData(null);
      }
    };
    checkAuth();
    
    // Poll for notifications every 30 seconds if logged in
    const interval = setInterval(() => {
      if (authService.isLoggedIn()) {
        fetchNotifications();
      }
    }, 30000);

    // Listen for custom events from SettingsPage
    const handleSettingsUpdate = (e: any) => {
      setNotificationsEnabled(e.detail.bookingUpdates);
      if (e.detail.bookingUpdates) {
        fetchNotifications();
      } else {
        setNotifications([]);
      }
    };

    window.addEventListener('notification_settings_updated', handleSettingsUpdate);
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('notification_settings_updated', handleSettingsUpdate);
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
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
    setNotifications([]);
    setShowLogoutModal(false);
    setUserMenuOpen(false);
    navigate('/');
  };

  const toggleNotifications = async () => {
    const isOpening = !showNotifications;
    setShowNotifications(isOpening);
    
    // If opening, mark all as read
    if (isOpening && notifications.some(n => n.unread)) {
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      await authService.markAllNotificationsRead();
    }
  };

  const handleClearNotifications = async () => {
    setNotifications([]);
    await authService.clearNotifications();
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
          <li><Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>HOME</Link></li>
          <li><Link to="/events" className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}>EVENTS</Link></li>
          <li className="nav-dropdown">
            <Link to="/services" className={`nav-link ${(location.pathname.startsWith('/services') || location.pathname === '/corporate' || location.pathname === '/debut') ? 'active' : ''}`}>SERVICES</Link>
            <div className="dropdown-mega-menu">

              {/* Column 1 */}
              <div className="dropdown-col">
                <Link to="/services/weddings" className={location.pathname === '/services/weddings' ? 'active' : ''}>Weddings</Link>
                <Link to="/corporate" className={location.pathname === '/corporate' ? 'active' : ''}>Corporate</Link>
              </div>

              {/* Column 2 */}
              <div className="dropdown-col">
                <Link to="/debut" className={location.pathname === '/debut' ? 'active' : ''}>Debut</Link>
                <Link to="/services/childrens-party" className={location.pathname === '/services/childrens-party' ? 'active' : ''}>Children's Party</Link>
              </div>

              {/* Column 3 */}
              <div className="dropdown-col">
                <Link to="/services/special-occasions" className={location.pathname === '/services/special-occasions' ? 'active' : ''}>Special Occasions</Link>
                <Link to="/services/packages" className={location.pathname === '/services/packages' ? 'active' : ''}>All Packages</Link>
              </div>

            </div>
          </li>
          <li><Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>ABOUT US</Link></li>
          {!isLoggedIn && <li><Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>CONTACT US</Link></li>}
        </ul>

        {!isAuthPage && (
          isLoggedIn ? (
            <div className="user-menu-container">
              <div className="nav-notification-container">
                <button 
                  className="nav-notification-btn" 
                  aria-label="Notifications"
                  onClick={toggleNotifications}
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
                      <button onClick={handleClearNotifications}>Clear all</button>
                    </div>
                    <div className="notification-list">
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                            <div className="notification-content">
                              <p>{notif.text}</p>
                              <span className="notification-time">{formatRelativeTime(notif.time)}</span>
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
                  <Link 
                    to="/settings" 
                    state={{ tab: 'profile' }} 
                    onClick={() => setUserMenuOpen(false)}
                    className={location.pathname === '/settings' && (!new URLSearchParams(location.search).get('tab') || new URLSearchParams(location.search).get('tab') === 'profile') ? 'active' : ''}
                  >
                    My Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    state={{ tab: 'transactions' }} 
                    onClick={() => setUserMenuOpen(false)}
                    className={location.pathname === '/settings' && new URLSearchParams(location.search).get('tab') === 'transactions' ? 'active' : ''}
                  >
                    Transaction List
                  </Link>
                  <Link 
                    to="/settings" 
                    state={{ tab: 'security' }} 
                    onClick={() => setUserMenuOpen(false)}
                    className={location.pathname === '/settings' && new URLSearchParams(location.search).get('tab') === 'security' ? 'active' : ''}
                  >
                    Account Settings
                  </Link>
                  <button className="logout-nav-btn" onClick={() => setShowLogoutModal(true)}>Log out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={`nav-login-btn sign-up ${location.pathname === '/login' ? 'active' : ''}`}>SIGN IN</Link>
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