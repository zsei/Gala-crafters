import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Package, Plus, Search, Edit2, Trash2, Filter, ChevronRight, LayoutGrid, List, X } from 'lucide-react';
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
  image_url?: string;
  status: string;
}

const AdminPackages = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [packages, setPackages] = useState<EventPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filtering State
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const urlType = queryParams.get('type') || 'All';
    
    // We map urlType 'wedding' to 'Wedding', 'birthday' to 'Birthday', etc.
    const getInitialCategory = (type: string) => {
        if (!type || type.toLowerCase() === 'all') return 'All';
        return type.charAt(0).toUpperCase() + type.slice(1);
    }

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(getInitialCategory(urlType));
    const [statusFilter, setStatusFilter] = useState('Active');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<EventPackage | null>(null);
    const [formData, setFormData] = useState({
        package_name: '',
        event_type: 'Wedding',
        description: '',
        base_price: 0,
        max_guests: 0,
        features: '', // We'll split this by comma on submit
        image_url: '',
        status: 'Active'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync category filter if URL changes via Sidebar
    useEffect(() => {
        const type = new URLSearchParams(location.search).get('type') || 'All';
        setCategoryFilter(getInitialCategory(type));
    }, [location.search]);

    const fetchPackages = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.PACKAGES}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch packages');
            
            const data = await response.json();
            setPackages(data);
        } catch (err: any) {
            setError(err.message);
            console.error('Error fetching packages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const toggleSidebar = () => setIsCollapsed(prev => !prev);

    // Handle Form Inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'base_price' || name === 'max_guests' ? Number(value) : value
        }));
    };

    // Open Modal for New Package
    const handleOpenNew = () => {
        setEditingPackage(null);
        setFormData({
            package_name: '',
            event_type: 'Wedding',
            description: '',
            base_price: 0,
            max_guests: 50,
            features: '',
            image_url: '',
            status: 'Active'
        });
        setIsModalOpen(true);
    };

    // Open Modal for Edit
    const handleOpenEdit = (pkg: EventPackage) => {
        setEditingPackage(pkg);
        setFormData({
            package_name: pkg.package_name,
            event_type: pkg.event_type,
            description: pkg.description || '',
            base_price: pkg.base_price,
            max_guests: pkg.max_guests || 0,
            features: pkg.features ? pkg.features.join(', ') : '',
            image_url: pkg.image_url || '',
            status: pkg.status || 'Active'
        });
        setIsModalOpen(true);
    };

    // Submit Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            
            // Format data
            const payload = {
                ...formData,
                features: formData.features.split(',').map(f => f.trim()).filter(f => f.length > 0)
            };

            const url = editingPackage 
                ? `${API_BASE_URL}${API_ENDPOINTS.ADMIN.PACKAGES}/${editingPackage.id}`
                : `${API_BASE_URL}${API_ENDPOINTS.ADMIN.PACKAGES}`;
                
            const method = editingPackage ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to save package');

            // Refresh list & close modal
            await fetchPackages();
            setIsModalOpen(false);
        } catch (err: any) {
            setError(err.message);
            alert("Error: " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Soft Delete Package
    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to completely archive this package? It will no longer be available for customers.")) {
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.PACKAGES}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete package');
            await fetchPackages();
        } catch (err: any) {
            alert("Error deleting package: " + err.message);
        }
    };

    // Filter Logic
    const filteredPackages = packages.filter(pkg => {
        // Search
        const matchesSearch = pkg.package_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (pkg.description && pkg.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Category
        const matchesCategory = categoryFilter === 'All' || pkg.event_type.toLowerCase() === categoryFilter.toLowerCase();
        
        // Status
        const matchesStatus = statusFilter === 'All' || pkg.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <div className={`admin-layout ${isModalOpen ? 'modal-open' : ''}`}>
            <AdminSidebar 
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
                            <input 
                                type="text" 
                                placeholder="Search packages..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="export-btn" onClick={handleOpenNew} style={{ backgroundColor: 'var(--admin-accent)', color: 'white', border: 'none' }}>
                            <Plus size={16} />
                            New Package
                        </button>
                    </div>
                </header>

                <div className="bookings-toolbar">
                    <div className="filters-group">
                        <select 
                            className="filter-dropdown" 
                            value={categoryFilter} 
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{ paddingLeft: '10px' }}
                        >
                            <option value="All">All Categories</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Children">Children's Party</option>
                            <option value="Debut">Debut</option>
                            <option value="Corporate">Corporate</option>
                            <option value="Special">Special Occasion</option>
                        </select>

                        <select 
                            className="filter-dropdown" 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ paddingLeft: '10px' }}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Archived">Archived</option>
                        </select>
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
                ) : filteredPackages.length === 0 ? (
                    <div className="empty-state" style={{ padding: '40px', textAlign: 'center', color: 'var(--admin-text-sub)' }}>
                        No packages found matching your criteria.
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "packages-grid" : "packages-list"}>
                        {filteredPackages.map((pkg) => (
                            <div key={pkg.id} className="admin-card package-card" style={pkg.status === 'Archived' ? { opacity: 0.6 } : {}}>
                                <div className="package-card-header" style={pkg.image_url ? { padding: 0, height: '180px', position: 'relative' } : {}}>
                                    {pkg.image_url ? (
                                        <img src={pkg.image_url} alt={pkg.package_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div className="package-icon-wrapper">
                                            <Package size={24} color="#c49a2c" />
                                        </div>
                                    )}
                                    <div className="package-status" style={pkg.image_url ? { position: 'absolute', top: '16px', right: '16px' } : {}}>
                                        <span className={`status-badge ${pkg.status === 'Archived' ? 'cancelled' : 'success'}`}>{pkg.status}</span>
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
                                    <button className="package-action-btn edit" onClick={() => handleOpenEdit(pkg)}>
                                        <Edit2 size={16} />
                                        <span>Edit</span>
                                    </button>
                                    <button 
                                        className="package-action-btn delete" 
                                        onClick={() => handleDelete(pkg.id)}
                                        title={pkg.status === 'Archived' ? 'Already Archived' : 'Archive Package'}
                                        disabled={pkg.status === 'Archived'}
                                        style={pkg.status === 'Archived' ? { cursor: 'not-allowed', color: 'gray' } : {}}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* PACKAGE CRUD MODAL */}
            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '600px', width: '100%' }}>
                        <div className="admin-modal-header">
                            <h2>{editingPackage ? 'Edit Package' : 'Create New Package'}</h2>
                            <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="admin-modal-body">
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="admin-form-group">
                                    <label>Package Name</label>
                                    <div className="input-with-icon">
                                        <Package size={16} />
                                        <input
                                            type="text"
                                            name="package_name"
                                            value={formData.package_name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g. Platinum Wedding Package"
                                        />
                                    </div>
                                </div>
                                <div className="admin-form-group">
                                    <label>Event Type</label>
                                    <select
                                        name="event_type"
                                        value={formData.event_type}
                                        onChange={handleInputChange}
                                        required
                                        className="admin-select"
                                    >
                                        <option value="Wedding">Wedding</option>
                                        <option value="Birthday">Birthday</option>
                                        <option value="Children">Children's Party</option>
                                        <option value="Debut">Debut</option>
                                        <option value="Corporate">Corporate</option>
                                        <option value="Special">Special Occasion</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>Description</label>
                                <div className="input-with-icon" style={{ alignItems: 'flex-start' }}>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Brief overview of what this package includes..."
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--admin-border)', borderRadius: '8px', background: 'var(--admin-bg)', color: 'var(--admin-text-main)', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }}
                                    />
                                </div>
                            </div>

                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="admin-form-group">
                                    <label>Base Price ($)</label>
                                    <div className="input-with-icon">
                                        <span style={{ position: 'absolute', left: '12px', color: 'var(--admin-text-sub)', fontWeight: 600, fontSize: '14px' }}>$</span>
                                        <input
                                            type="number"
                                            name="base_price"
                                            value={formData.base_price}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="admin-form-group">
                                    <label>Max Capacity (Pax)</label>
                                    <div className="input-with-icon">
                                        <span style={{ position: 'absolute', left: '12px', color: 'var(--admin-text-sub)', fontWeight: 600, fontSize: '14px' }}>#</span>
                                        <input
                                            type="number"
                                            name="max_guests"
                                            value={formData.max_guests}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            placeholder="50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>Package Cover Image (URL)</label>
                                <div className="input-with-icon">
                                    <Plus size={16} />
                                    <input 
                                        type="text" 
                                        name="image_url"
                                        value={formData.image_url}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                {formData.image_url && (
                                    <div className="image-preview" style={{ marginTop: '12px', borderRadius: '8px', overflow: 'hidden', height: '150px', border: '1px solid var(--admin-border)' }}>
                                        <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                            </div>

                            <div className="admin-form-group">
                                <label>Features (Comma separated)</label>
                                <div className="input-with-icon" style={{ alignItems: 'flex-start' }}>
                                    <textarea
                                        name="features"
                                        value={formData.features}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="e.g. 5-Course Meal, Live Band, Premium Decor"
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--admin-border)', borderRadius: '8px', background: 'var(--admin-bg)', color: 'var(--admin-text-main)', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }}
                                    />
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                    className="admin-select"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : (editingPackage ? 'Update Package' : 'Create Package')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .packages-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 24px;
                }
                .packages-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .package-card {
                    display: flex;
                    flex-direction: column;
                    padding: 0;
                    overflow: hidden;
                    transition: transform 0.2s ease;
                }
                .packages-list .package-card {
                    flex-direction: row;
                    align-items: stretch;
                }
                .packages-list .package-card-header {
                    border-bottom: none;
                    border-right: 1px solid var(--admin-border);
                    justify-content: center;
                    width: 150px;
                }
                .packages-list .package-card-body {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 24px;
                }
                .packages-list .package-card-footer {
                    flex-direction: column;
                    justify-content: center;
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
                    background-color: var(--admin-hover);
                }
                .package-action-btn.delete {
                    background-color: #fef2f2;
                    color: #ef4444;
                    border: 1px solid #fecaca;
                }
                .package-action-btn.delete:hover {
                    background-color: #fee2e2;
                }

                /* Admin Forms (Reusable) */
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                .admin-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 16px;
                }
                .admin-form-group label {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--admin-text-sub);
                }
                .admin-form-group input, 
                .admin-form-group select, 
                .admin-form-group textarea {
                    padding: 12px;
                    border: 1px solid var(--admin-border);
                    border-radius: 8px;
                    background-color: white;
                    color: var(--admin-text-main);
                    font-family: inherit;
                    transition: all 0.2s ease;
                }
                .admin-form-group input:focus, 
                .admin-form-group select:focus, 
                .admin-form-group textarea:focus {
                    outline: none;
                    border-color: var(--admin-accent);
                    box-shadow: 0 0 0 3px rgba(196, 154, 44, 0.1);
                }

            `}</style>
        </div>
    );
};

export default AdminPackages;
