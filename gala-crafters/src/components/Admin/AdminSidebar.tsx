import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  Users, 
  MessageSquare,
  Moon,
  Sun,
  ChevronDown,
  HelpCircle,
  Tag,
  Star,
  FileText
} from 'lucide-react';

const AdminSidebar = ({ isDark, toggleTheme, isCollapsed: propIsCollapsed, toggleSidebar: propToggleSidebar }) => {
  const [localIsCollapsed, setLocalIsCollapsed] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const location = useLocation();
  
  const isCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : localIsCollapsed;
  const toggleSidebar = propToggleSidebar || (() => setLocalIsCollapsed(!localIsCollapsed));

  useEffect(() => {
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
      setIsBookingsOpen(false); // Close dropdown when sidebar collapses
      setIsPackagesOpen(false);
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    return () => document.body.classList.remove('sidebar-collapsed');
  }, [isCollapsed]);

  // Keep dropdown open if we are on a bookings route
  useEffect(() => {
    if (location.pathname.startsWith('/admin/bookings') && !isCollapsed) {
      setIsBookingsOpen(true);
    }
  }, [location.pathname, isCollapsed]);

  // Keep dropdown open if we are on a packages route
  useEffect(() => {
    if (location.pathname.startsWith('/admin/packages') && !isCollapsed) {
      setIsPackagesOpen(true);
    }
  }, [location.pathname, isCollapsed]);

  const toggleBookings = (e) => {
    e.preventDefault();
    if (isCollapsed) {
      toggleSidebar(); // Automatically expand if collapsed
      setIsBookingsOpen(true);
    } else {
      setIsBookingsOpen(!isBookingsOpen);
    }
  };

  const togglePackages = (e) => {
    e.preventDefault();
    if (isCollapsed) {
      toggleSidebar();
      setIsPackagesOpen(true);
    } else {
      setIsPackagesOpen(!isPackagesOpen);
    }
  };

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="admin-logo" onClick={toggleSidebar} style={{ cursor: 'pointer' }}>
        <div className="diamond-icon">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="#fff" />
          </svg>
        </div>
        {!isCollapsed && <span>Gala Crafters</span>}
      </div>

      <nav className="admin-nav">
        <NavLink 
          to="/admin" 
          end
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={isCollapsed ? "Dashboard" : ""}
        >
          <LayoutDashboard className="admin-nav-icon" />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>
        
        <div className="admin-nav-group">
          <div 
            className={`admin-nav-item ${location.pathname.startsWith('/admin/bookings') ? 'active' : ''}`}
            onClick={toggleBookings}
            title={isCollapsed ? "Bookings" : ""}
          >
            <Calendar className="admin-nav-icon" />
            {!isCollapsed && (
              <>
                <span>Bookings</span>
                <ChevronDown 
                  size={16} 
                  className={`admin-nav-chevron ${isBookingsOpen ? 'open' : ''}`} 
                />
              </>
            )}
          </div>
          
          <div className={`admin-subnav ${isBookingsOpen && !isCollapsed ? 'open' : ''}`}>
            <NavLink to="/admin/bookings?status=pending" className="admin-subnav-item">Pending Requests</NavLink>
            <NavLink to="/admin/bookings?status=confirmed" className="admin-subnav-item">Confirmed Bookings</NavLink>
            <NavLink to="/admin/bookings?status=ongoing" className="admin-subnav-item">On-going Events</NavLink>
            <NavLink to="/admin/bookings?status=completed" className="admin-subnav-item">Completed Event</NavLink>
            <NavLink to="/admin/bookings?status=cancelled" className="admin-subnav-item">Cancelled/Postponed</NavLink>
          </div>
        </div>

        <div className="admin-nav-group">
          <div 
            className={`admin-nav-item ${location.pathname.startsWith('/admin/packages') ? 'active' : ''}`}
            onClick={togglePackages}
            title={isCollapsed ? "Packages" : ""}
          >
            <Package className="admin-nav-icon" />
            {!isCollapsed && (
              <>
                <span>Packages</span>
                <ChevronDown 
                  size={16} 
                  className={`admin-nav-chevron ${isPackagesOpen ? 'open' : ''}`} 
                />
              </>
            )}
          </div>
          
          <div className={`admin-subnav ${isPackagesOpen && !isCollapsed ? 'open' : ''}`}>
            <NavLink to="/admin/packages?type=wedding" className="admin-subnav-item">Wedding Package</NavLink>
            <NavLink to="/admin/packages?type=birthday" className="admin-subnav-item">Birthday Package</NavLink>
            <NavLink to="/admin/packages?type=children" className="admin-subnav-item">Children's Party</NavLink>
            <NavLink to="/admin/packages?type=debut" className="admin-subnav-item">Debut Package</NavLink>
            <NavLink to="/admin/packages?type=corporate" className="admin-subnav-item">Corporate Event</NavLink>
            <NavLink to="/admin/packages?type=special" className="admin-subnav-item">Special Occasion</NavLink>
          </div>
        </div>

        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={isCollapsed ? "Users" : ""}
        >
          <Users className="admin-nav-icon" />
          {!isCollapsed && <span>Users</span>}
        </NavLink>

        <NavLink 
          to="/admin/messages" 
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={isCollapsed ? "Messages" : ""}
        >
          <MessageSquare className="admin-nav-icon" />
          {!isCollapsed && <span>Messages</span>}
          {!isCollapsed && <span className="admin-badge">4</span>}
        </NavLink>

        <NavLink 
          to="/admin/inquiry" 
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={isCollapsed ? "Inquiry" : ""}
        >
          <HelpCircle className="admin-nav-icon" />
          {!isCollapsed && <span>Inquiry</span>}
        </NavLink>

        <NavLink 
          to="/admin/discounts" 
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={isCollapsed ? "Discounts" : ""}
        >
          <Tag className="admin-nav-icon" />
          {!isCollapsed && <span>Discounts</span>}
        </NavLink>

        <NavLink 
          to="/admin/reviews" 
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={isCollapsed ? "Reviews" : ""}
        >
          <Star className="admin-nav-icon" />
          {!isCollapsed && <span>Reviews</span>}
        </NavLink>

        <NavLink 
          to="/admin/reports" 
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={isCollapsed ? "Reports" : ""}
        >
          <FileText className="admin-nav-icon" />
          {!isCollapsed && <span>Reports</span>}
        </NavLink>
      </nav>

      <div className="admin-sidebar-footer">
        <button onClick={toggleTheme} className="admin-theme-toggle" title={isCollapsed ? "Toggle Theme" : ""}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {!isCollapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
