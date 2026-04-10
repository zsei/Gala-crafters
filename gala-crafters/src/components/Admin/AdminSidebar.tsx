import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  Users, 
  MessageSquare,
  ChevronDown,
  HelpCircle,
  Tag,
  Star,
  FileText,
  LogOut
} from 'lucide-react';
import { authService } from '../../api/auth';
import { API_BASE_URL, API_ENDPOINTS } from '../../api/config';

const AdminSidebar = ({ isCollapsed: propIsCollapsed, toggleSidebar: propToggleSidebar }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [localIsCollapsed, setLocalIsCollapsed] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const location = useLocation();
  
  // RBAC Role Extraction
  const storedAdmin = localStorage.getItem('admin');
  const adminRole = storedAdmin ? JSON.parse(storedAdmin).role : 'superadmin';

  const isSuperAdmin = adminRole === 'superadmin';
  const isBookingsStaff = adminRole === 'staff_bookings';
  const isPackagesStaff = adminRole === 'staff_packages';
  
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

  // Fetch unread count for badge
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.MESSAGES}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.length);
        }
      } catch (err) {
        console.error('Error fetching unread messages for sidebar:', err);
      }
    };

    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

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
        
        
        {(isSuperAdmin || isBookingsStaff) && (
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
              <NavLink to="/admin/bookings?status=all" className="admin-subnav-item">All Bookings</NavLink>
              <NavLink to="/admin/bookings?status=pending" className="admin-subnav-item">Pending Requests</NavLink>
              <NavLink to="/admin/bookings?status=confirmed" className="admin-subnav-item">Confirmed Bookings</NavLink>
              <NavLink to="/admin/bookings?status=ongoing" className="admin-subnav-item">On-going Events</NavLink>
              <NavLink to="/admin/bookings?status=completed" className="admin-subnav-item">Completed Event</NavLink>
              <NavLink to="/admin/bookings?status=cancelled" className="admin-subnav-item">Cancelled/Postponed</NavLink>
            </div>
          </div>
        )}

        {(isSuperAdmin || isPackagesStaff) && (
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
              <NavLink to="/admin/packages" className="admin-subnav-item">All Packages</NavLink>
              <NavLink to="/admin/packages?type=wedding" className="admin-subnav-item">Wedding Package</NavLink>
              <NavLink to="/admin/packages?type=birthday" className="admin-subnav-item">Birthday Package</NavLink>
              <NavLink to="/admin/packages?type=children" className="admin-subnav-item">Children's Party</NavLink>
              <NavLink to="/admin/packages?type=debut" className="admin-subnav-item">Debut Package</NavLink>
              <NavLink to="/admin/packages?type=corporate" className="admin-subnav-item">Corporate Event</NavLink>
              <NavLink to="/admin/packages?type=special" className="admin-subnav-item">Special Occasion</NavLink>
            </div>
          </div>
        )}

        {isSuperAdmin && (
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            title={isCollapsed ? "Users" : ""}
          >
            <Users className="admin-nav-icon" />
            {!isCollapsed && <span>Users</span>}
          </NavLink>
        )}

        {(isSuperAdmin || isBookingsStaff) && (
          <>
            <NavLink 
              to="/admin/messages" 
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? "Messages" : ""}
            >
              <MessageSquare className="admin-nav-icon" />
              {!isCollapsed && <span>Messages</span>}
            </NavLink>

            <NavLink 
              to="/admin/inquiries" 
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? "Inquiries" : ""}
            >
              <HelpCircle className="admin-nav-icon" />
              {!isCollapsed && <span>Inquiries</span>}
              {!isCollapsed && unreadCount > 0 && <span className="admin-badge">{unreadCount}</span>}
            </NavLink>
          </>
        )}

        {(isSuperAdmin || isPackagesStaff) && (
          <NavLink 
            to="/admin/discounts" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            title={isCollapsed ? "Discounts" : ""}
          >
            <Tag className="admin-nav-icon" />
            {!isCollapsed && <span>Discounts</span>}
          </NavLink>
        )}

        {isSuperAdmin && (
          <>
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
          </>
        )}
      </nav>

      <div className="admin-sidebar-footer">
        <button 
          onClick={() => {
            authService.logout();
            window.location.href = '/admin/login';
          }} 
          className="admin-theme-toggle" 
          style={{ marginTop: '12px', color: '#ef4444' }}
          title={isCollapsed ? "Log Out" : ""}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
