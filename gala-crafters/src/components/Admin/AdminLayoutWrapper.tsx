import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import './Admin.css';

const AdminLayoutWrapper = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);





  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar 
        isCollapsed={isCollapsed} 
        toggleSidebar={toggleSidebar} 
      />
      
      {/* Outlet renders the matched child route (Dashboard, Bookings, etc.) */}
      <div className={`admin-main-wrapper ${isCollapsed ? 'collapsed-main' : ''}`}>
         <Outlet />
      </div>
    </div>
  );
};

export default AdminLayoutWrapper;
