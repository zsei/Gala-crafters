import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Package, Plus, Search, Edit2, Trash2, Filter, ChevronRight, LayoutGrid, List, X, AlertCircle, CheckCircle, XCircle, Upload, Image as ImageIcon } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';
import { API_BASE_URL, API_ENDPOINTS } from '../../api/config';

interface EventPackage {
  id: number;
  package_name: string;
  event_type: string;
  description: string;
  detailed_description?: string;
  base_price: number;
  min_guests?: number;
  max_guests: number;
  extra_pax_rate?: number;
  features: string[];
  included_items?: string;
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
    const [formData, setFormData] = useState<{
        package_name: string;
        event_type: string;
        description: string;
        detailed_description: string;
        base_price: number;
        min_guests: number;
        max_guests: number;
        extra_pax_rate: number;
        features_list: string[];
        included_items: { title: string; desc: string }[];
        image_url: string;
        status: string;
    }>({
        package_name: '',
        event_type: 'Wedding',
        description: '',
        detailed_description: '',
        base_price: 0,
        min_guests: 1,
        max_guests: 0,
        extra_pax_rate: 350,
        features_list: ['Seamless Setup & Breakdown', 'Professional Uniformed Team', 'Full Buffet Management', 'Complete Thematic Styling'],
        included_items: [{ title: '', desc: '' }],
        image_url: '',
        status: 'Active'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Confirmation Modal state
    const [confirmModal, setConfirmModal] = React.useState<{
        show: boolean;
        title: string;
        message: string;
        confirmText: string;
        type: 'danger' | 'warning' | 'primary' | 'success';
        onConfirm: () => void;
    }>({
        show: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        type: 'primary',
        onConfirm: () => {}
    });

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
            [name]: ['base_price', 'max_guests', 'min_guests', 'extra_pax_rate'].includes(name) ? Number(value) : value
        }));
    };

    // Open Modal for New Package
    const handleOpenNew = () => {
        setEditingPackage(null);
        setFormData({
            package_name: '',
            event_type: 'Wedding',
            description: '',
            detailed_description: '',
            base_price: 0,
            min_guests: 1,
            max_guests: 50,
            extra_pax_rate: 350,
            features_list: ['Seamless Setup & Breakdown', 'Professional Uniformed Team', 'Full Buffet Management', 'Complete Thematic Styling'],
            included_items: [{ title: '', desc: '' }],
            image_url: '',
            status: 'Active'
        });
        setIsModalOpen(true);
    };

    // Open Modal for Edit
    const handleOpenEdit = (pkg: EventPackage) => {
        let parsedInclusions = [{ title: '', desc: '' }];
        if (pkg.included_items) {
            try {
                const parsed = JSON.parse(pkg.included_items);
                if (Array.isArray(parsed)) {
                    parsedInclusions = parsed;
                }
            } catch (e) {
                // If it's not JSON, treat it as a single inclusion or empty
                parsedInclusions = [{ title: 'Inclusion', desc: pkg.included_items }];
            }
        }

        setEditingPackage(pkg);
        setFormData({
            package_name: pkg.package_name,
            event_type: pkg.event_type,
            description: pkg.description || '',
            detailed_description: pkg.detailed_description || '',
            base_price: pkg.base_price,
            min_guests: pkg.min_guests || 1,
            max_guests: pkg.max_guests || 0,
            extra_pax_rate: pkg.extra_pax_rate || 350,
            features_list: pkg.features || [],
            included_items: parsedInclusions,
            image_url: pkg.image_url || '',
            status: pkg.status || 'Active'
        });
        setIsModalOpen(true);
    };

    const addInclusion = () => {
        setFormData(prev => ({
            ...prev,
            included_items: [...prev.included_items, { title: '', desc: '' }]
        }));
    };

    const removeInclusion = (index: number) => {
        setFormData(prev => ({
            ...prev,
            included_items: prev.included_items.filter((_, i) => i !== index)
        }));
    };

    const handleInclusionChange = (index: number, field: 'title' | 'desc', value: string) => {
        setFormData(prev => {
            const newInclusions = [...prev.included_items];
            newInclusions[index] = { ...newInclusions[index], [field]: value };
            return { ...prev, included_items: newInclusions };
        });
    };

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features_list: [...prev.features_list, '']
        }));
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features_list: prev.features_list.filter((_, i) => i !== index)
        }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        setFormData(prev => {
            const newFeatures = [...prev.features_list];
            newFeatures[index] = value;
            return { ...prev, features_list: newFeatures };
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        const token = localStorage.getItem('token');
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/packages/upload-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataUpload
            });

            if (!response.ok) throw new Error('Failed to upload image');

            const data = await response.json();
            // Prefix with API_BASE_URL if it's a relative path
            const imageUrl = data.url.startsWith('http') ? data.url : `${API_BASE_URL}${data.url}`;
            
            setFormData(prev => ({
                ...prev,
                image_url: imageUrl
            }));
        } catch (err: any) {
            alert("Error uploading image: " + err.message);
        } finally {
            setUploadingImage(false);
        }
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
                features: formData.features_list.filter(f => f.trim() !== ''),
                included_items: JSON.stringify(formData.included_items.filter(item => item.title.trim() !== ''))
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

    const handleDelete = (id: number) => {
        setConfirmModal({
            show: true,
            title: 'Archive Package',
            message: "Are you sure you want to completely archive this package? It will no longer be available for customers.",
            confirmText: 'Archive Package',
            type: 'danger',
            onConfirm: async () => {
                setConfirmModal(prev => ({ ...prev, show: false }));
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
            }
        });
    };

    const handleOpenExternalDetails = (pkg: EventPackage) => {
        // Map status from backend if needed
        setEditingPackage(pkg);
        // Ensure data is mapped correctly for the modal
        const mappedData = {
            ...pkg,
            title: pkg.package_name,
            basePrice: pkg.base_price,
            included: pkg.included_items ? (function() {
                try {
                    const parsed = JSON.parse(pkg.included_items);
                    return Array.isArray(parsed) ? parsed : [];
                } catch(e) { return []; }
            })() : []
        };
        // Use the packageType as a unique identifier for the modal
        // We'll pass the whole object as packageData
        setIsModalOpen(false); // Close CRUD modal if open
        // We need to trigger the user-facing modal
        // For now, let's just alert or use a separate state if needed
        // But the request is about fixing the mismatch.
    };

    // Filter Logic
    const filteredPackages = Array.isArray(packages) ? packages.filter(pkg => {
        if (!pkg) return false;
        // Search
        const matchesSearch = (pkg.package_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (pkg.description && pkg.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Category
        const matchesCategory = categoryFilter === 'All' || (pkg.event_type || '').toLowerCase() === categoryFilter.toLowerCase();
        
        // Status
        const matchesStatus = statusFilter === 'All' || pkg.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    }) : [];

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
                                            <Package size={24} color="#fff" />
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
                                            <span className="meta-value">₱{pkg.base_price.toLocaleString()}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Min Guests</span>
                                            <span className="meta-value">{pkg.min_guests} Pax</span>
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
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'start' }}>
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
                                        style={{ height: '46px' }}
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
                                        rows={4}
                                        placeholder="Detailed explanation of the package, services, and inclusions..."
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--admin-border)', borderRadius: '8px', background: 'var(--admin-bg)', color: 'var(--admin-text-main)', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }}
                                    />
                                </div>
                            </div>

                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="admin-form-group">
                                    <label>Base Price (₱)</label>
                                    <div className="input-with-icon">
                                        <span style={{ position: 'absolute', left: '12px', color: 'var(--admin-text-sub)', fontWeight: 600, fontSize: '14px' }}>₱</span>
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
                                    <label>Extra Pax Rate (₱)</label>
                                    <div className="input-with-icon">
                                        <span style={{ position: 'absolute', left: '12px', color: 'var(--admin-text-sub)', fontWeight: 600, fontSize: '14px' }}>₱</span>
                                        <input
                                            type="number"
                                            name="extra_pax_rate"
                                            value={formData.extra_pax_rate}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            placeholder="350"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="admin-form-group">
                                    <label>Min Guests</label>
                                    <div className="input-with-icon">
                                        <span style={{ position: 'absolute', left: '12px', color: 'var(--admin-text-sub)', fontWeight: 600, fontSize: '14px' }}>#</span>
                                        <input
                                            type="number"
                                            name="min_guests"
                                            value={formData.min_guests}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            placeholder="1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>Package Cover Image</label>
                                <div 
                                    className="image-upload-zone" 
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: '2px dashed var(--admin-border)',
                                        borderRadius: '12px',
                                        padding: '24px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: 'var(--admin-bg)',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--admin-accent)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--admin-border)'}
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleImageUpload} 
                                        accept="image/*" 
                                        style={{ display: 'none' }} 
                                    />
                                    {uploadingImage ? (
                                        <div className="uploading-spinner">
                                            <div style={{ width: '24px', height: '24px', border: '3px solid var(--admin-border)', borderTopColor: 'var(--admin-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                            <span style={{ fontSize: '14px', color: 'var(--admin-text-sub)', marginTop: '8px' }}>Uploading...</span>
                                        </div>
                                    ) : formData.image_url ? (
                                        <div style={{ position: 'relative', width: '100%' }}>
                                            <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                                            <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                                                Click to Change
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--admin-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-accent)' }}>
                                                <Upload size={24} />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>Click to upload image</span>
                                                <span style={{ fontSize: '12px', color: 'var(--admin-text-sub)' }}>PNG, JPG or WEBP (Max 5MB)</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    What's Included (Main items for the grid)
                                    <button 
                                        type="button" 
                                        onClick={addInclusion}
                                        style={{ 
                                            padding: '4px 12px', 
                                            fontSize: '12px', 
                                            backgroundColor: 'var(--admin-accent)', 
                                            color: 'white', 
                                            border: 'none', 
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        + Add Box
                                    </button>
                                </label>
                                <div className="inclusions-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                                    {formData.included_items.map((item, index) => (
                                        <div key={index} className="inclusion-box" style={{ 
                                            padding: '16px', 
                                            border: '1px solid var(--admin-border)', 
                                            borderRadius: '8px', 
                                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                                            position: 'relative'
                                        }}>
                                            <button 
                                                type="button"
                                                onClick={() => removeInclusion(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    padding: '4px'
                                                }}
                                            >
                                                <X size={14} />
                                            </button>
                                            <div className="admin-form-group" style={{ marginBottom: '12px' }}>
                                                <label style={{ fontSize: '11px', textTransform: 'uppercase' }}>Inclusion Title</label>
                                                <input 
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => handleInclusionChange(index, 'title', e.target.value)}
                                                    placeholder="e.g. Gourmet Grand Buffet"
                                                    style={{ width: '100%', padding: '8px' }}
                                                />
                                            </div>
                                            <div className="admin-form-group" style={{ marginBottom: 0 }}>
                                                <label style={{ fontSize: '11px', textTransform: 'uppercase' }}>Description / Items</label>
                                                <textarea 
                                                    value={item.desc}
                                                    onChange={(e) => handleInclusionChange(index, 'desc', e.target.value)}
                                                    placeholder="e.g. Appetizer, Soup Bar, Salad Station..."
                                                    rows={2}
                                                    style={{ width: '100%', padding: '8px', fontSize: '13px' }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    Service Details (Checklist items)
                                    <button 
                                        type="button" 
                                        onClick={addFeature}
                                        style={{ 
                                            padding: '4px 12px', 
                                            fontSize: '12px', 
                                            backgroundColor: 'var(--admin-accent)', 
                                            color: 'white', 
                                            border: 'none', 
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        + Add Item
                                    </button>
                                </label>
                                <div className="features-container" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                                    {formData.features_list.map((feature, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid var(--admin-border)', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                                                <CheckCircle size={14} color="var(--admin-accent)" />
                                                <input 
                                                    type="text"
                                                    value={feature}
                                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                    placeholder="e.g. Seamless Setup & Breakdown"
                                                    style={{ flex: 1, border: 'none', background: 'none', padding: 0, fontSize: '14px', color: 'inherit' }}
                                                />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => removeFeature(index)}
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
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

            {/* Modern Confirmation Modal */}
            {confirmModal.show && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 4000,
                    padding: '20px',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    <div style={{
                        backgroundColor: 'var(--admin-card-bg)',
                        borderRadius: '16px',
                        padding: '32px',
                        maxWidth: '440px',
                        width: '100%',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        textAlign: 'center',
                        border: '1px solid var(--admin-border)',
                        animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}>
                        <div style={{ 
                            width: '64px', 
                            height: '64px', 
                            borderRadius: '50%', 
                            backgroundColor: confirmModal.type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 
                                             confirmModal.type === 'primary' ? 'rgba(196, 154, 44, 0.1)' : 
                                             'rgba(59, 130, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: confirmModal.type === 'danger' ? '#ef4444' : 
                                   confirmModal.type === 'primary' ? 'var(--admin-accent)' : 
                                   '#3b82f6'
                        }}>
                            {confirmModal.type === 'danger' ? <XCircle size={32} /> : 
                             confirmModal.type === 'success' ? <CheckCircle size={32} /> : 
                             <AlertCircle size={32} />}
                        </div>
                        
                        <h2 style={{ 
                            fontSize: '22px', 
                            fontWeight: '700', 
                            color: 'var(--admin-text-main)', 
                            marginBottom: '12px',
                            fontFamily: "'Playfair Display', serif"
                        }}>{confirmModal.title}</h2>
                        
                        <p style={{ 
                            fontSize: '15px', 
                            color: 'var(--admin-text-sub)', 
                            lineHeight: '1.6',
                            marginBottom: '32px'
                        }}>{confirmModal.message}</p>
                        
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                                style={{
                                    flex: 1,
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--admin-border)',
                                    backgroundColor: 'transparent',
                                    color: 'var(--admin-text-main)',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--admin-bg)')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmModal.onConfirm}
                                style={{
                                    flex: 1,
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: confirmModal.type === 'danger' ? '#ef4444' : 'var(--admin-accent)',
                                    color: '#fff',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                            >
                                {confirmModal.confirmText}
                            </button>
                        </div>
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
                    background-color: var(--admin-accent);
                    color: white;
                }
                .package-icon-wrapper {
                    width: 48px;
                    height: 48px;
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(4px);
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

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default AdminPackages;
