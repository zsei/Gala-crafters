import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  Users, 
  MessageSquare,
  Moon,
  Sun
} from 'lucide-react';

const AdminSidebar = ({ isDark, toggleTheme, isCollapsed }) => {
  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="admin-logo">
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
        
        <NavLink 
          to="/admin/bookings" 
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={isCollapsed ? "Bookings" : ""}
        >
          <Calendar className="admin-nav-icon" />
          {!isCollapsed && <span>Bookings</span>}
        </NavLink>

        <NavLink 
          to="/admin/packages" 
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          title={isCollapsed ? "Packages" : ""}
        >
          <Package className="admin-nav-icon" />
          {!isCollapsed && <span>Packages</span>}
        </NavLink>

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
