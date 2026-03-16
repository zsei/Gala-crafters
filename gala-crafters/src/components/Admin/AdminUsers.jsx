import React from 'react';
import { Search, Bell, Plus, MoreVertical, Filter, Download } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';

const usersData = [
  {
    id: 1,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    name: 'Alexander Sterling',
    lastActive: '12m ago',
    role: 'Executive Admin',
    roleColor: 'warning',
    email: 'a.sterling@gala.com',
    phone: '+1 (555) 902-1244',
    status: 'Active',
    statusColor: 'success'
  },
  {
    id: 2,
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    name: 'Eleanor Rhodes',
    lastActive: '2h ago',
    role: 'Compliance Officer',
    roleColor: 'sub',
    email: 'e.rhodes@gala.com',
    phone: '+1 (555) 438-9901',
    status: 'Active',
    statusColor: 'success'
  },
  {
    id: 3,
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026708c',
    name: 'Julian Thorne',
    lastActive: '1 day ago',
    role: 'Security Lead',
    roleColor: 'sub',
    email: 'j.thorne@gala.com',
    phone: '+1 (555) 212-0092',
    status: 'Offline',
    statusColor: 'sub'
  },
  {
    id: 4,
    avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
    name: 'Beatrice Vance',
    lastActive: '4 days ago',
    role: 'Support Manager',
    roleColor: 'sub',
    email: 'b.vance@gala.com',
    phone: '+1 (555) 771-3342',
    status: 'Away',
    statusColor: 'warning'
  }
];

const stats = [
  { label: 'TOTAL USERS', value: '1,248' },
  { label: 'ACTIVE NOW', value: '142', indicator: 'success' },
  { label: 'NEW REGISTRATIONS', value: '+12%', borderLeft: 'accent' },
  { label: 'PENDING ACCESS', value: '7' }
];

const AdminUsers = () => {
  const [isDark, setIsDark] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('staff');

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

  return (
    <div className={`admin-layout ${isDark ? 'admin-dark-theme' : ''}`}>
      <AdminSidebar isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="admin-main">
        
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
