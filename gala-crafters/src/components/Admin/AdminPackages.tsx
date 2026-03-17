import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Filter, ChevronRight, LayoutGrid, List } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';
import { API_BASE_URL, API_ENDPOINTS } from '../../api/config';

interface EventPackage {
  id: number;
  package_name: string;
  event_type: string;
  description: string;
  base_price: number;
  max_guests: number;
  features: string[];
  status: string;
}

const AdminPackages = () => {
    const [isDark, setIsDark] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [packages, setPackages] = useState<EventPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const savedTheme = localStorage.getItem('galaAdminTheme');
        if (savedTheme === 'dark') setIsDark(true);
        
        const fetchPackages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.PACKAGES}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch packages');
                }
                
                const data = await response.json();
                setPackages(data);
            } catch (err: any) {
                setError(err.message);
                console.error('Error fetching packages:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchPackages();
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
                <header className="bookings-header">
                    <div className="bookings-header-title">
                        <h1>Packages & Categories</h1>
                        <p>Manage your curated event tiers and service offerings.</p>
                    </div>
                    
                    <div className="bookings-header-actions">
                        <div className="search-input-wrapper">
                            <Search size={16} className="search-icon" />
                            <input type="text" placeholder="Search packages..." />
                        </div>
                        <button className="export-btn" style={{ backgroundColor: 'var(--admin-accent)', color: 'white', border: 'none' }}>
                            <Plus size={16} />
                            New Package
                        </button>
                    </div>
                </header>

                <div className="bookings-toolbar">
                    <div className="filters-group">
                        <button className="filter-dropdown">
                            <Filter size={16} className="text-accent" />
                            Category: All
                        </button>
                        <button className="filter-dropdown">
                            Status: Active
                        </button>
                    </div>
                    <div className="view-toggle-group" style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            className={`filter-btn ${viewMode === 'grid' ? 'active-page' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button 
                            className={`filter-btn ${viewMode === 'list' ? 'active-page' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">Loading packages...</div>
                ) : (
                    <div className={viewMode === 'grid' ? "packages-grid" : "packages-list"}>
                        {packages.map((pkg) => (
                            <div key={pkg.id} className="admin-card package-card">
                                <div className="package-card-header">
                                    <div className="package-icon-wrapper">
                                        <Package size={24} color="#c49a2c" />
                                    </div>
                                    <div className="package-status">
                                        <span className="status-badge success">{pkg.status}</span>
                                    </div>
                                </div>
                                <div className="package-card-body">
                                    <span className="package-category">{pkg.event_type}</span>
                                    <h3>{pkg.package_name}</h3>
                                    <p>{pkg.description}</p>
                                    <div className="package-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Starting Price</span>
                                            <span className="meta-value">${pkg.base_price.toLocaleString()}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Capacity</span>
                                            <span className="meta-value">{pkg.max_guests} Pax</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="package-card-footer">
                                    <button className="package-action-btn edit">
                                        <Edit2 size={16} />
                                        <span>Edit</span>
                                    </button>
                                    <button className="package-action-btn delete">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <style>{`
                .packages-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                }
                .package-card {
                    display: flex;
                    flex-direction: column;
                    padding: 0;
                    overflow: hidden;
                    transition: transform 0.2s ease;
                }
                .package-card:hover {
                    transform: translateY(-4px);
                }
                .package-card-header {
                    padding: 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 1px solid var(--admin-border);
                }
                .package-icon-wrapper {
                    width: 48px;
                    height: 48px;
                    background-color: var(--admin-hover);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .package-card-body {
                    padding: 24px;
                    flex: 1;
                }
                .package-category {
                    font-size: 11px;
                    font-weight: 700;
                    color: var(--admin-accent);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                    display: block;
                }
                .package-card-body h3 {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    color: var(--admin-text-main);
                }
                .package-card-body p {
                    font-size: 14px;
                    color: var(--admin-text-sub);
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .package-meta {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                .meta-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .meta-label {
                    font-size: 12px;
                    color: var(--admin-text-sub);
                }
                .meta-value {
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--admin-text-main);
                }
                .package-card-footer {
                    padding: 16px 24px;
                    background-color: var(--admin-hover);
                    display: flex;
                    gap: 12px;
                }
                .package-action-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .package-action-btn.edit {
                    flex: 1;
                    background-color: white;
                    border: 1px solid var(--admin-border);
                    color: var(--admin-text-main);
                }
                .package-action-btn.edit:hover {
                    border-color: var(--admin-accent);
                    color: var(--admin-accent);
                }
                .package-action-btn.delete {
                    background-color: rgba(239, 68, 68, 0.1);
                    border: 1px solid transparent;
                    color: #ef4444;
                }
                .package-action-btn.delete:hover {
                    background-color: #ef4444;
                    color: white;
                }
                .loading-state {
                    padding: 100px;
                    text-align: center;
                    color: var(--admin-text-sub);
                }
            `}</style>
        </div>
    );
};

export default AdminPackages;
