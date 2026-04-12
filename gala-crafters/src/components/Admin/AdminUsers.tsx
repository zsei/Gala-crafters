import React from 'react';
import { Search, Bell, Plus, MoreVertical, Filter, Download } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';
import { API_BASE_URL, API_ENDPOINTS } from '../../api/config';

const AdminUsers = () => {
  const [activeTab, setActiveTab] = React.useState('staff');
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);

  // Search state
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const endpoint = activeTab === 'staff' ? API_ENDPOINTS.ADMIN.USERS : API_ENDPOINTS.USERS.LIST;
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        
        // Extract the correct array depending on the endpoint response structure
        if (activeTab === 'staff') {
          setUsers(data.admins || []);
        } else {
          setUsers(data.users || []);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [activeTab]);

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  // Filter Logic
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return !searchTerm || 
      (user.first_name || '').toLowerCase().includes(searchLower) ||
      (user.last_name || '').toLowerCase().includes(searchLower) ||
      (user.email || '').toLowerCase().includes(searchLower) ||
      (user.phone || '').toLowerCase().includes(searchLower);
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  // Reset page when tab or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // Stats logic based on fetched users (placeholder but derived)
  const derivedStats = [
    { label: 'TOTAL ACCOUNTS', value: users.length, borderLeft: true },
    { label: 'NEW THIS MONTH', value: 0, indicator: 'success' },
    { label: 'STAFF MEMBERS', value: activeTab === 'staff' ? users.length : '...', indicator: 'warning' },
    { label: 'CLIENTS', value: activeTab === 'clients' ? users.length : '...' }
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar 
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
      />
      
      <main className={`admin-main ${isCollapsed ? 'collapsed-main' : ''}`}>
        
        {/* Top Actions Bar */}
        <div className="users-top-bar">
          <div className="search-input-wrapper users-search">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search accounts, transactions, or logs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          {derivedStats.map((stat, i) => (
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
              {loading ? (
                <tr>
                   <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Loading directory...</td>
                </tr>
              ) : error ? (
                <tr>
                   <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'red' }}>Error: {error}</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                   <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>No users found.</td>
                </tr>
              ) : (
                currentUsers.map((user: any, index: number) => (
                  <tr key={user.id || index}>
                    <td>
                      <div className="user-detail-cell">
                        <div className="user-avatar" style={{ backgroundColor: 'var(--admin-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                           {(user.name || user.first_name)?.charAt(0)}
                        </div>
                        <div className="user-info">
                          <strong>{user.name || `${user.first_name} ${user.last_name}`}</strong>
                          <span>Last active: Recently</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge bg-accent-light text-accent`}>
                        {user.role || user.user_role}
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
                        <span
                          className={`status-dot ${
                            activeTab === 'clients'
                              ? user.status === 'Verified'
                                ? 'bg-success'
                                : 'bg-sub'
                              : user.status === 'Active'
                                ? 'bg-success'
                                : 'bg-sub'
                          }`}
                        ></span>
                        <span className={`text-main font-medium`}>
                          {activeTab === 'clients'
                            ? user.status === 'Verified'
                              ? 'Verified'
                              : 'Unverified'
                            : user.status || 'Active'}
                        </span>
                      </div>
                    </td>
                    <td className="actions-cell">
                      <button className="more-btn"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {filteredUsers.length > 0 && (
            <div className="table-footer-alt">
               <span className="text-sub" style={{ fontSize: '13px' }}>
                 Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} {activeTab === 'staff' ? 'staff members' : 'clients'}
               </span>
               <div className="pagination-compact">
                 <button 
                   className={`page-nav-btn ${currentPage === 1 ? 'disabled' : ''}`}
                   onClick={handlePrevPage}
                   disabled={currentPage === 1}
                 >
                   Previous
                 </button>
                 
                 {[...Array(totalPages)].map((_, i) => (
                   <button 
                     key={i + 1}
                     className={`page-num ${currentPage === i + 1 ? 'active' : ''}`}
                     onClick={() => handlePageChange(i + 1)}
                   >
                     {i + 1}
                   </button>
                 ))}
                 
                 <button 
                   className={`page-nav-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                   onClick={handleNextPage}
                   disabled={currentPage === totalPages}
                 >
                   Next
                 </button>
               </div>
            </div>
          )}

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
