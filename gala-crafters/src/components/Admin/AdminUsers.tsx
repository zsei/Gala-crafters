import React from 'react';
import { Search, Bell, Plus, MoreVertical, Filter, Download } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';

const usersData = [];

const stats = [];

const AdminUsers = () => {
  const [isDark, setIsDark] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('staff');
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
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

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  return (
    <div className={`admin-layout ${isDark ? 'admin-dark-theme' : ''}`}>
      <AdminSidebar 
        isDark={isDark} 
        toggleTheme={toggleTheme}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />
      
      <main className={`admin-main ${isCollapsed ? 'collapsed-main' : ''}`}>
        
        {/* Top Actions Bar */}
        <div className="users-top-bar">
          <div className="search-input-wrapper users-search">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search accounts, transactions, or logs..." />
          </div>
          <div className="users-top-actions">
            <button className="admin-icon-btn users-bell-btn">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </button>
            <button className="create-user-btn">
              <Plus size={16} />
              Create User
            </button>
          </div>
        </div>

        {/* Page Header */}
        <header className="users-header">
          <h1>User Directory</h1>
          <p>Refined management of your distinguished clientele and professional staff.</p>
        </header>

        {/* Stats Row */}
        <div className="users-stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className={`admin-card user-stat-card ${stat.borderLeft ? 'border-left-accent' : ''}`}>
               <span className="stat-label">{stat.label}</span>
               <div className="stat-value-row">
                 {stat.indicator && <span className={`status-dot bg-${stat.indicator}`}></span>}
                 <h2>{stat.value}</h2>
               </div>
            </div>
          ))}
        </div>

        {/* Tabs and Content Area */}
        <div className="admin-card users-content-card">
          
          <div className="users-tabs-header">
            <div className="users-tabs">
              <button 
                className={`user-tab ${activeTab === 'staff' ? 'active' : ''}`}
                onClick={() => setActiveTab('staff')}
              >
                Staff Members
              </button>
              <button 
                className={`user-tab ${activeTab === 'clients' ? 'active' : ''}`}
                onClick={() => setActiveTab('clients')}
              >
                Registered Clients
              </button>
              <button 
                className={`user-tab ${activeTab === 'archive' ? 'active' : ''}`}
                onClick={() => setActiveTab('archive')}
              >
                Archive
              </button>
            </div>
            <div className="users-tab-actions">
              <button className="tab-action-btn">
                <Filter size={14} /> FILTER
              </button>
              <button className="tab-action-btn text-accent">
                <Download size={14} /> EXPORT CSV
              </button>
            </div>
          </div>

          <table className="users-table">
            <thead>
              <tr>
                <th>USER DETAILS</th>
                <th>ROLE / LEVEL</th>
                <th>CONTACT INFORMATION</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-detail-cell">
                      <img src={user.avatar} alt={user.name} className="user-avatar" />
                      <div className="user-info">
                        <strong>{user.name}</strong>
                        <span>Last active: {user.lastActive}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge bg-${user.roleColor}-light text-${user.roleColor}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="contact-info">
                      <span className="contact-email">{user.email}</span>
                      <span className="contact-phone">{user.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="status-cell">
                      <span className={`status-dot bg-${user.statusColor}`}></span>
                      <span className={`text-${user.statusColor === 'sub' ? 'sub' : 'main'} font-medium`}>{user.status}</span>
                    </div>
                  </td>
                  <td className="actions-cell">
                    <button className="more-btn"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-footer-alt">
             <span className="text-sub" style={{ fontSize: '13px' }}>Showing 1-4 of 28 staff members</span>
             <div className="pagination-compact">
               <button className="page-nav-btn" disabled>Previous</button>
               <button className="page-num active">1</button>
               <button className="page-num">2</button>
               <button className="page-num">3</button>
               <button className="page-nav-btn">Next</button>
             </div>
          </div>

        </div>

        {/* Bottom Cards (Placeholders for Quick Permissions / Audit Insights) */}
        <div className="users-bottom-grid">
           <div className="admin-card bottom-card">
              <h3>Quick Permissions</h3>
              {/* Shield Icon placeholder */}
              <div className="bottom-card-icon text-warning">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
           </div>
           <div className="admin-card bottom-card">
              <h3>Audit Insights</h3>
              {/* Clock/History Icon placeholder */}
              <div className="bottom-card-icon text-accent">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
};

export default AdminUsers;
