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
  const location = useLocation();
  const navigate = useNavigate();

  // Check login state
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = authService.isLoggedIn();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        const user = authService.getStoredUser();
        setUserData(user);
      }
    };
    checkAuth();
    // Listen for storage changes in case login happens in another tab
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location]);

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
              <button className="nav-notification-btn" aria-label="Notifications">
                <Bell size={20} color="#ffffff" />
                <span className="nav-notification-badge"></span>
              </button>

              <button
                className="user-icon-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User Menu"
              >
                <User size={20} color="#ffffff" />
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