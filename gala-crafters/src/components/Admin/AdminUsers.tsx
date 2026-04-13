import React from 'react';
import { Search, Bell, Plus, MoreVertical, Filter, Download, X, Shield, Clock } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';
import { API_BASE_URL, API_ENDPOINTS } from '../../api/config';

const AdminUsers = () => {
  const [activeTab, setActiveTab] = React.useState('staff');
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [auditLogs, setAuditLogs] = React.useState<any[]>([]);
  const [isUpdatingUser, setIsUpdatingUser] = React.useState(false);
  const [activeUserMenu, setActiveUserMenu] = React.useState<number | null>(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<any>(null);
  const [newUserData, setNewUserData] = React.useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'staff_bookings',
    phone: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);

  // Search state
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = React.useState(false);

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

  const fetchAuditLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/audit-logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    }
  };

  const handleQuickUpdate = async (userId: number, update: any, isAdmin: boolean = false) => {
    setIsUpdatingUser(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/users/quick-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: userId,
          is_admin: isAdmin,
          ...update
        })
      });

      if (response.ok) {
        fetchUsers();
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Error updating user:', err);
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleArchiveUser = async (userId: number, isAdmin: boolean = false) => {
    if (!window.confirm('Are you sure you want to archive this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}?is_admin=${isAdmin}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setActiveUserMenu(null);
        fetchUsers();
        fetchAuditLogs();
      }
    } catch (err) {
      console.error('Error archiving user:', err);
    }
  };

  React.useEffect(() => {
    fetchUsers();
    fetchAuditLogs();

    // Close dropdowns when clicking outside
    const handleClickOutside = () => {
      setActiveUserMenu(null);
      setIsFilterDropdownOpen(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeTab]);

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  // Filter Logic
  const filteredUsers = users.filter(user => {
    if (activeTab === 'archive') {
      if (user.status !== 'Deleted' && user.status !== 'Archived') return false;
    } else {
      if (user.status === 'Deleted' || user.status === 'Archived') return false;
    }

    // 3. Role filtering
    if (roleFilter !== 'all') {
      const userRole = (user.role || user.user_role || '').toLowerCase();
      if (userRole !== roleFilter.toLowerCase()) return false;
    }

    const searchLower = searchTerm.toLowerCase();
    return !searchTerm || 
      (user.first_name || '').toLowerCase().includes(searchLower) ||
      (user.last_name || '').toLowerCase().includes(searchLower) ||
      (user.name || '').toLowerCase().includes(searchLower) ||
      (user.email || '').toLowerCase().includes(searchLower) ||
      (user.phone || '').toLowerCase().includes(searchLower) ||
      (user.role || user.user_role || '').toLowerCase().includes(searchLower);
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUserData)
      });

      if (response.ok) {
        setIsCreateModalOpen(false);
        setNewUserData({ first_name: '', last_name: '', email: '', password: '', role: 'staff_bookings', phone: '' });
        fetchUsers();
        fetchAuditLogs();
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const handleEditClick = (user: any) => {
    setEditingUser({
      ...user,
      first_name: user.name?.split(' ')[0] || user.first_name || '',
      last_name: user.name?.split(' ').slice(1).join(' ') || user.last_name || '',
      role: user.role || user.user_role || 'staff_bookings'
    });
    setIsEditModalOpen(true);
    setActiveUserMenu(null);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: `${editingUser.first_name} ${editingUser.last_name}`,
          email: editingUser.email,
          role: editingUser.role,
          phone: editingUser.phone
        })
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        setEditingUser(null);
        fetchUsers();
        fetchAuditLogs();
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const derivedStats = [
    { label: 'TOTAL ACCOUNTS', value: users.length, borderLeft: true },
    { label: 'NEW THIS MONTH', value: users.filter(u => {
        const created = new Date(u.created_at);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length, indicator: 'success' },
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
            <button className="tab-action-btn" onClick={() => setIsPermissionsModalOpen(true)} style={{ marginRight: '12px' }}>
              <Shield size={16} />
              Manage Permissions
            </button>
            <button className="create-user-btn" onClick={() => setIsCreateModalOpen(true)}>
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
            <div className="users-tab-actions" style={{ position: 'relative' }}>
              <button 
                className={`tab-action-btn ${roleFilter !== 'all' ? 'text-accent' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFilterDropdownOpen(!isFilterDropdownOpen);
                }}
              >
                <Filter size={14} /> FILTER {roleFilter !== 'all' ? `(${roleFilter.replace('_', ' ')})` : ''}
              </button>

              {isFilterDropdownOpen && (
                <div className="admin-card filter-dropdown" style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '8px',
                  zIndex: 100,
                  width: '180px',
                  padding: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--admin-text-sub)', padding: '4px 8px' }}>FILTER BY ROLE</div>
                  <button 
                    className={`dropdown-action-item ${roleFilter === 'all' ? 'active' : ''}`}
                    style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '6px', border: 'none', background: roleFilter === 'all' ? 'var(--admin-hover)' : 'none', cursor: 'pointer', fontSize: '13px', color: roleFilter === 'all' ? 'var(--admin-accent)' : 'inherit' }}
                    onClick={() => { setRoleFilter('all'); setIsFilterDropdownOpen(false); }}
                  >
                    All Roles
                  </button>
                  {activeTab === 'staff' ? (
                    <>
                      <button 
                        className={`dropdown-action-item ${roleFilter === 'superadmin' ? 'active' : ''}`}
                        style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '6px', border: 'none', background: roleFilter === 'superadmin' ? 'var(--admin-hover)' : 'none', cursor: 'pointer', fontSize: '13px', color: roleFilter === 'superadmin' ? 'var(--admin-accent)' : 'inherit' }}
                        onClick={() => { setRoleFilter('superadmin'); setIsFilterDropdownOpen(false); }}
                      >
                        Superadmin
                      </button>
                      <button 
                        className={`dropdown-action-item ${roleFilter === 'staff_bookings' ? 'active' : ''}`}
                        style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '6px', border: 'none', background: roleFilter === 'staff_bookings' ? 'var(--admin-hover)' : 'none', cursor: 'pointer', fontSize: '13px', color: roleFilter === 'staff_bookings' ? 'var(--admin-accent)' : 'inherit' }}
                        onClick={() => { setRoleFilter('staff_bookings'); setIsFilterDropdownOpen(false); }}
                      >
                        Bookings Staff
                      </button>
                      <button 
                        className={`dropdown-action-item ${roleFilter === 'staff_packages' ? 'active' : ''}`}
                        style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '6px', border: 'none', background: roleFilter === 'staff_packages' ? 'var(--admin-hover)' : 'none', cursor: 'pointer', fontSize: '13px', color: roleFilter === 'staff_packages' ? 'var(--admin-accent)' : 'inherit' }}
                        onClick={() => { setRoleFilter('staff_packages'); setIsFilterDropdownOpen(false); }}
                      >
                        Packages Staff
                      </button>
                    </>
                  ) : (
                    <button 
                      className={`dropdown-action-item ${roleFilter === 'customer' ? 'active' : ''}`}
                      style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '6px', border: 'none', background: roleFilter === 'customer' ? 'var(--admin-hover)' : 'none', cursor: 'pointer', fontSize: '13px', color: roleFilter === 'customer' ? 'var(--admin-accent)' : 'inherit' }}
                      onClick={() => { setRoleFilter('customer'); setIsFilterDropdownOpen(false); }}
                    >
                      Customer
                    </button>
                  )}
                </div>
              )}
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
              ) : filteredUsers.length === 0 ? (
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
                    <td className="actions-cell" style={{ position: 'relative' }}>
                      <button 
                        className="more-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveUserMenu(activeUserMenu === user.id ? null : user.id);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeUserMenu === user.id && (
                        <div className="admin-card user-actions-dropdown" style={{
                          position: 'absolute',
                          right: '100%',
                          top: '0',
                          zIndex: 100,
                          width: '160px',
                          padding: '8px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}>
                          <button 
                            className="dropdown-action-item" 
                            style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '6px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={() => handleEditClick(user)}
                          >
                            Edit Details
                          </button>
                          <button 
                            className="dropdown-action-item text-danger" 
                            style={{ textAlign: 'left', padding: '8px 12px', borderRadius: '6px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444' }}
                            onClick={() => handleArchiveUser(user.id, activeTab === 'staff')}
                          >
                            Archive User
                          </button>
                        </div>
                      )}
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

        {/* Bottom Cards: Audit Insights (Quick Permissions moved to modal) */}
        <div className="users-bottom-grid">
           <div className="admin-card bottom-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '16px', gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <h3>Audit Insights</h3>
                  <p style={{ fontSize: '13px', color: 'var(--admin-text-sub)', marginTop: '4px' }}>Recent administrative activity log.</p>
                </div>
                <div className="bottom-card-icon text-accent">
                   <Clock size={24} />
                </div>
              </div>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {auditLogs.length > 0 ? auditLogs.map((log: any) => (
                  <div key={log.id} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ marginTop: '4px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--admin-accent)' }}></div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--admin-text-main)' }}>
                        {log.admin_name} <span style={{ fontWeight: '400', color: 'var(--admin-text-sub)' }}>{log.action.toLowerCase()}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--admin-text-sub)', marginTop: '2px' }}>
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.details}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={{ fontSize: '12px', color: 'var(--admin-text-sub)', fontStyle: 'italic', textAlign: 'center', width: '100%', padding: '10px' }}>
                    No recent activity found.
                  </div>
                )}
              </div>
           </div>
        </div>

      </main>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="admin-card modal-content" style={{ width: '450px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }}>Create New Staff Member</h2>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>FIRST NAME</label>
                  <input 
                    type="text" 
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-border)' }}
                    value={newUserData.first_name}
                    onChange={(e) => setNewUserData({...newUserData, first_name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>LAST NAME</label>
                  <input 
                    type="text" 
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-border)' }}
                    value={newUserData.last_name}
                    onChange={(e) => setNewUserData({...newUserData, last_name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-border)' }}
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>PASSWORD</label>
                <input 
                  type="password" 
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-border)' }}
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>ASSIGN ROLE</label>
                <select 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-border)', backgroundColor: 'white' }}
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({...newUserData, role: e.target.value})}
                >
                  <option value="superadmin">Superadmin</option>
                  <option value="staff_bookings">Bookings Staff</option>
                  <option value="staff_packages">Packages Staff</option>
                </select>
              </div>

              <button type="submit" className="create-user-btn" style={{ marginTop: '12px', justifyContent: 'center' }}>
                Confirm Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="admin-card modal-content" style={{ width: '450px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif" }}>Edit Staff Details</h2>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>FIRST NAME</label>
                  <input 
                    type="text" 
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-border)' }}
                    value={editingUser.first_name}
                    onChange={(e) => setEditingUser({...editingUser, first_name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>LAST NAME</label>
                  <input 
                    type="text" 
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-border)' }}
                    value={editingUser.last_name}
                    onChange={(e) => setEditingUser({...editingUser, last_name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-border)' }}
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>PHONE NUMBER</label>
                <input 
                  type="text" 
                  placeholder="+63 ..."
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-border)' }}
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>ASSIGN ROLE</label>
                <select 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--admin-border)', backgroundColor: 'white' }}
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="superadmin">Superadmin</option>
                  <option value="staff_bookings">Bookings Staff</option>
                  <option value="staff_packages">Packages Staff</option>
                </select>
              </div>

              <button type="submit" className="create-user-btn" style={{ marginTop: '12px', justifyContent: 'center' }}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {isPermissionsModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="admin-card modal-content" style={{ width: '500px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif" }}>Quick Permissions</h2>
                <p style={{ fontSize: '13px', color: 'var(--admin-text-sub)', marginTop: '4px' }}>Fast-track role assignments for active staff.</p>
              </div>
              <button onClick={() => setIsPermissionsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', height: 'fit-content' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {users.filter(u => (u.role || u.user_role) !== 'Customer').map((staff: any) => (
                <div key={staff.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--admin-bg-soft)', borderRadius: '10px', border: '1px solid var(--admin-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--admin-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                      {staff.name?.charAt(0)}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>{staff.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--admin-text-sub)' }}>{staff.email}</span>
                    </div>
                  </div>
                  <select 
                    style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--admin-border)', backgroundColor: 'white', cursor: 'pointer' }}
                    value={staff.role}
                    disabled={isUpdatingUser}
                    onChange={(e) => handleQuickUpdate(staff.id, { role: e.target.value }, true)}
                  >
                    <option value="superadmin">Superadmin</option>
                    <option value="staff_bookings">Bookings Staff</option>
                    <option value="staff_packages">Packages Staff</option>
                  </select>
                </div>
              ))}
            </div>

            <button 
              className="create-user-btn" 
              style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}
              onClick={() => setIsPermissionsModalOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
