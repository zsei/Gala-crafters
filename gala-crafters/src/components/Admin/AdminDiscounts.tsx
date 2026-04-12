import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Edit2, Trash2, Filter, X, Calendar as CalendarIcon, Hash, Percent, ToggleLeft, ToggleRight, ChevronDown } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';
import { API_BASE_URL } from '../../api/config';

type PromoAudience = 'verified' | 'unverified';

function normalizeAudience(a: string | undefined | null): PromoAudience {
  if (a === 'unverified') return 'unverified';
  return 'verified';
}

function audienceLabel(a: string | undefined | null): string {
  return normalizeAudience(a) === 'unverified' ? 'Unverified members' : 'Verified members';
}

function audienceFormLabel(a: PromoAudience): string {
  return a === 'unverified' ? 'Unverified members (email not verified)' : 'Verified members (email verified)';
}

interface PromoCode {
  id: number;
  code: string;
  discount_percentage: number | null;
  discount_amount: number | null;
  expiry_date: string | null;
  max_uses: number | null;
  current_uses: number;
  status: string;
  audience?: string | null;
  applicable_event?: string | null;
  applicable_package?: string | null;
  created_at: string;
}

const AdminDiscounts = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
    const [formData, setFormData] = useState({
        code: '',
        discount_percentage: '',
        discount_amount: '',
        expiry_date: '',
        max_uses: '',
        status: 'Active',
        audience: 'verified' as PromoAudience,
        applicable_event: 'all',
        applicable_package: 'all',
    });

    const [memberAudienceFilter, setMemberAudienceFilter] = useState<'All' | 'Verified' | 'Unverified'>('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalDropdown, setModalDropdown] = useState<'status' | 'audience' | 'applicable_event' | 'applicable_package' | null>(null);

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    // Close dropdowns when filter changes
    useEffect(() => {
        setIsFilterOpen(false);
    }, [memberAudienceFilter]);

    const fetchPromoCodes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admin/promo-codes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch promo codes');
            const data = await response.json();
            setPromoCodes(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const eventOptions = [
        { id: 'all', label: 'All Event Categories' },
        { id: 'Wedding', label: 'Wedding' },
        { id: 'Debut', label: 'Debut' },
        { id: 'Corporate', label: 'Corporate' },
        { id: "Children's Party", label: "Children's Party" },
        { id: 'Special Occasion', label: 'Special Occasion' }
    ];

    const packageOptions: { [key: string]: { id: string, label: string }[] } = {
        'all': [{ id: 'all', label: 'Apply to all packages' }],
        'Wedding': [
            { id: 'all', label: 'All Wedding Packages' },
            { id: 'Intimate Wedding', label: 'Intimate Wedding' },
            { id: 'Utopian Wedding', label: 'Utopian Wedding' },
            { id: 'Elite Wedding', label: 'Elite Wedding' }
        ],
        'Debut': [
            { id: 'all', label: 'All Debut Packages' },
            { id: 'Debut Intimate', label: 'Debut Intimate' },
            { id: 'Debut Classy', label: 'Debut Classy' },
            { id: 'Debut Vogue', label: 'Debut Vogue' }
        ],
        'Corporate': [
            { id: 'all', label: 'All Corporate Packages' },
            { id: 'Corporate Event', label: 'Standard Corporate' }
        ],
        "Children's Party": [
            { id: 'all', label: "All Children's Party Packages" },
            { id: 'Kiddie Playful', label: 'Kiddie Playful' },
            { id: 'Kiddie Adventure', label: 'Kiddie Adventure' },
            { id: 'Kiddie Carnival', label: 'Kiddie Carnival' }
        ],
        'Special Occasion': [
            { id: 'all', label: 'All Special Occasion Packages' },
            { id: 'Special Intimate', label: 'Special Intimate' },
            { id: 'Special Grand', label: 'Special Grand' },
            { id: 'Special Legacy', label: 'Special Legacy' }
        ]
    };

    const toggleSidebar = () => setIsCollapsed(prev => !prev);

    const handleOpenModal = (code: PromoCode | null = null) => {
        setModalDropdown(null);
        if (code) {
            setEditingCode(code);
            setFormData({
                code: code.code,
                discount_percentage: code.discount_percentage?.toString() || '',
                discount_amount: code.discount_amount?.toString() || '',
                expiry_date: code.expiry_date || '',
                max_uses: code.max_uses?.toString() || '',
                status: code.status,
                audience: normalizeAudience(code.audience),
                applicable_event: code.applicable_event || 'all',
                applicable_package: code.applicable_package || 'all',
            });
        } else {
            setEditingCode(null);
            setFormData({
                code: '',
                discount_percentage: '',
                discount_amount: '',
                expiry_date: '',
                max_uses: '',
                status: 'Active',
                audience: 'verified',
                applicable_event: 'all',
                applicable_package: 'all',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCode(null);
        setModalDropdown(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const method = editingCode ? 'PUT' : 'POST';
        const url = editingCode 
            ? `${API_BASE_URL}/api/admin/promo-codes/${editingCode.id}`
            : `${API_BASE_URL}/api/admin/promo-codes`;

        const payload = {
            ...formData,
            discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
            discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : null,
            max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
            expiry_date: formData.expiry_date || null,
            audience: formData.audience,
        };

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                fetchPromoCodes();
                
                // Notify users about the new promo code
                if (!editingCode) {
                    const discountText = payload.discount_percentage 
                        ? `${payload.discount_percentage}% OFF` 
                        : `₱${payload.discount_amount?.toLocaleString()} OFF`;
                    
                    const newNotification = {
                        id: Date.now(),
                        text: `New Promo Code Available: ${payload.code}! Get ${discountText} on your next booking.`,
                        time: "Just now",
                        unread: true,
                        type: 'promo'
                    };

                    // Add to global notifications in localStorage for users to see
                    const savedNotifications = JSON.parse(localStorage.getItem('user_notifications') || '[]');
                    localStorage.setItem('user_notifications', JSON.stringify([newNotification, ...savedNotifications]));
                    
                    // Dispatch event for any open tabs
                    window.dispatchEvent(new CustomEvent('storage'));
                }

                handleCloseModal();
            } else {
                const errData = await response.json();
                alert(errData.detail || 'Failed to save promo code');
            }
        } catch (err) {
            console.error('Error saving promo code:', err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this promo code?')) return;
        
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/promo-codes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) fetchPromoCodes();
        } catch (err) {
            console.error('Error deleting promo code:', err);
        }
    };

    const filteredPromoCodes = promoCodes.filter(code => {
        const raw = (code.audience || 'verified').toLowerCase();
        const matchesMember =
            memberAudienceFilter === 'All' ||
            (memberAudienceFilter === 'Verified' &&
                (raw === 'verified' || raw === 'fully_verified' || raw === 'all')) ||
            (memberAudienceFilter === 'Unverified' && raw === 'unverified');
        const matchesSearch = !searchTerm || code.code.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesMember && matchesSearch;
    });

    return (
        <div className="admin-layout">
            <AdminSidebar 
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
            />

            <main className={`admin-main ${isCollapsed ? 'collapsed-main' : ''}`}>
                <header className="bookings-header">
                    <div className="bookings-header-title">
                        <h1>Promo Codes & Discounts</h1>
                        <p>Manage promotional codes, usage limits, and seasonal offers.</p>
                    </div>
                    
                    <div className="bookings-header-actions">
                        <div className="search-input-wrapper">
                            <Search size={16} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search codes..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="export-btn" onClick={() => handleOpenModal()} style={{ backgroundColor: 'var(--admin-accent)', color: 'white', border: 'none' }}>
                            <Plus size={16} />
                            New Code
                        </button>
                    </div>
                </header>

                <div className="bookings-toolbar">
                    <div className="filters-group" style={{ position: 'relative' }}>
                        <button 
                            className={`filter-dropdown ${memberAudienceFilter !== 'All' ? 'active' : ''}`}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <Filter size={16} className="text-accent" />
                            Members: {memberAudienceFilter}
                            <ChevronDown size={14} className="text-sub" />
                        </button>

                        {isFilterOpen && (
                            <div className="admin-dropdown-menu" style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                marginTop: '8px',
                                zIndex: 100,
                                minWidth: '200px'
                            }}>
                                {(['All', 'Verified', 'Unverified'] as const).map((opt) => (
                                    <button
                                        key={opt}
                                        className={`dropdown-item ${memberAudienceFilter === opt ? 'active' : ''}`}
                                        onClick={() => setMemberAudienceFilter(opt)}
                                    >
                                        {opt === 'All' ? 'All codes' : opt === 'Verified' ? 'Verified members only' : 'Unverified members only'}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">Loading promo codes...</div>
                ) : (
                    <div className="admin-card bookings-table-card">
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>PROMO CODE</th>
                                    <th>DISCOUNT</th>
                                    <th>EXPIRY DATE</th>
                                    <th>USAGE</th>
                                    <th>ELIGIBILITY</th>
                                    <th>STATUS</th>
                                    <th className="text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPromoCodes.map((code) => (
                                    <tr key={code.id}>
                                        <td>
                                            <div className="promo-code-pill">
                                                <Tag size={14} style={{ marginRight: '8px' }} />
                                                {code.code}
                                            </div>
                                        </td>
                                        <td className="font-semibold text-accent">
                                            {code.discount_percentage 
                                                ? `${code.discount_percentage}% Off` 
                                                : `₱${code.discount_amount?.toLocaleString()} Off`}
                                        </td>
                                        <td>
                                            <div className="date-cell">
                                                <strong>{code.expiry_date ? new Date(code.expiry_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No Expiry'}</strong>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="usage-stats">
                                                <span className="current font-bold">{code.current_uses}</span>
                                                <span className="separator" style={{ margin: '0 4px', color: 'var(--admin-text-sub)' }}>/</span>
                                                <span className="total" style={{ color: 'var(--admin-text-sub)' }}>{code.max_uses || '∞'}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: 13, color: 'var(--admin-text-sub)', maxWidth: 200 }}>
                                            {audienceLabel(code.audience)}
                                        </td>
                                        <td>
                                            <div className="status-cell">
                                                <span className={`status-dot bg-${code.status === 'Active' ? 'success' : 'sub'}`}></span>
                                                <span className={`text-${code.status === 'Active' ? 'success' : 'sub'} font-semibold`}>{code.status}</span>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                <button onClick={() => handleOpenModal(code)} className="action-icon-btn edit" title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-sub)' }}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(code.id)} className="action-icon-btn delete" title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-danger-text)' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {isModalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal promo-modal">
                        <div className="admin-modal-header">
                            <h2>{editingCode ? 'Edit Promo Code' : 'Create New Promo Code'}</h2>
                            <button onClick={handleCloseModal} className="close-modal-btn">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-modal-body">
                            <div className="admin-form-group">
                                <label>Promo Code Name</label>
                                <div className="input-with-icon">
                                    <Tag size={16} />
                                    <input 
                                        type="text" 
                                        name="code" 
                                        value={formData.code} 
                                        onChange={handleInputChange} 
                                        placeholder="e.g. SUMMER25" 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="admin-form-group">
                                    <label>Discount Percentage (%)</label>
                                    <div className="input-with-icon">
                                        <Percent size={16} />
                                        <input 
                                            type="number" 
                                            name="discount_percentage" 
                                            value={formData.discount_percentage} 
                                            onChange={handleInputChange} 
                                            placeholder="0"
                                            disabled={!!formData.discount_amount}
                                        />
                                    </div>
                                </div>
                                <span className="form-or">OR</span>
                                <div className="admin-form-group">
                                    <label>Discount Amount ($)</label>
                                    <div className="input-with-icon">
                                        <Hash size={16} />
                                        <input 
                                            type="number" 
                                            name="discount_amount" 
                                            value={formData.discount_amount} 
                                            onChange={handleInputChange} 
                                            placeholder="0"
                                            disabled={!!formData.discount_percentage}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="admin-form-group">
                                    <label>Expiry Date</label>
                                    <div className="input-with-icon">
                                        <CalendarIcon size={16} />
                                        <input 
                                            type="date" 
                                            name="expiry_date" 
                                            value={formData.expiry_date} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                </div>
                                <div className="admin-form-group">
                                    <label>Usage Limit (Max Uses)</label>
                                    <div className="input-with-icon">
                                        <Hash size={16} />
                                        <input 
                                            type="number" 
                                            name="max_uses" 
                                            value={formData.max_uses} 
                                            onChange={handleInputChange} 
                                            placeholder="Leave empty for unlimited"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="admin-form-group promo-modal-field" style={{ position: 'relative' }}>
                                <label>Initial Status</label>
                                <button
                                    type="button"
                                    className={`filter-dropdown promo-modal-dropdown ${modalDropdown === 'status' ? 'active' : ''}`}
                                    onClick={() => setModalDropdown((d) => (d === 'status' ? null : 'status'))}
                                    aria-expanded={modalDropdown === 'status'}
                                    aria-haspopup="listbox"
                                >
                                    <span>{formData.status}</span>
                                    <ChevronDown size={14} className="text-sub" />
                                </button>
                                {modalDropdown === 'status' && (
                                    <div
                                        className="admin-dropdown-menu promo-modal-dropdown-menu"
                                        role="listbox"
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            top: '100%',
                                            marginTop: 8,
                                            zIndex: 300,
                                            minWidth: 'unset',
                                        }}
                                    >
                                        {(['Active', 'Inactive'] as const).map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                role="option"
                                                className={`dropdown-item ${formData.status === s ? 'active' : ''}`}
                                                onClick={() => {
                                                    setFormData((prev) => ({ ...prev, status: s }));
                                                    setModalDropdown(null);
                                                }}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="admin-form-group promo-modal-field" style={{ position: 'relative' }}>
                                <label>Event Category</label>
                                <button
                                    type="button"
                                    className={`filter-dropdown promo-modal-dropdown ${modalDropdown === 'applicable_event' ? 'active' : ''}`}
                                    onClick={() => setModalDropdown((d) => (d === 'applicable_event' ? null : 'applicable_event'))}
                                    aria-expanded={modalDropdown === 'applicable_event'}
                                    aria-haspopup="listbox"
                                >
                                    <span style={{ textAlign: 'left', flex: 1 }}>
                                        {eventOptions.find(opt => opt.id === formData.applicable_event)?.label || formData.applicable_event}
                                    </span>
                                    <ChevronDown size={14} className="text-sub" style={{ flexShrink: 0 }} />
                                </button>
                                {modalDropdown === 'applicable_event' && (
                                    <div
                                        className="admin-dropdown-menu promo-modal-dropdown-menu"
                                        role="listbox"
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            top: '100%',
                                            marginTop: 8,
                                            zIndex: 300,
                                            minWidth: 'unset',
                                        }}
                                    >
                                        {eventOptions.map(opt => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                role="option"
                                                className={`dropdown-item ${formData.applicable_event === opt.id ? 'active' : ''}`}
                                                onClick={() => {
                                                    setFormData(prev => ({ 
                                                        ...prev, 
                                                        applicable_event: opt.id,
                                                        applicable_package: 'all' // Reset package when category changes
                                                    }));
                                                    setModalDropdown(null);
                                                }}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="admin-form-group promo-modal-field" style={{ position: 'relative' }}>
                                <label>Specific Package</label>
                                <button
                                    type="button"
                                    className={`filter-dropdown promo-modal-dropdown ${modalDropdown === 'applicable_package' ? 'active' : ''}`}
                                    onClick={() => setModalDropdown((d) => (d === 'applicable_package' ? null : 'applicable_package'))}
                                    aria-expanded={modalDropdown === 'applicable_package'}
                                    aria-haspopup="listbox"
                                >
                                    <span style={{ textAlign: 'left', flex: 1 }}>
                                        {packageOptions[formData.applicable_event]?.find(opt => opt.id === formData.applicable_package)?.label || 
                                         packageOptions['all'][0].label}
                                    </span>
                                    <ChevronDown size={14} className="text-sub" style={{ flexShrink: 0 }} />
                                </button>
                                {modalDropdown === 'applicable_package' && (
                                    <div
                                        className="admin-dropdown-menu promo-modal-dropdown-menu"
                                        role="listbox"
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            top: '100%',
                                            marginTop: 8,
                                            zIndex: 300,
                                            minWidth: 'unset',
                                        }}
                                    >
                                        {(packageOptions[formData.applicable_event] || packageOptions['all']).map(opt => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                role="option"
                                                className={`dropdown-item ${formData.applicable_package === opt.id ? 'active' : ''}`}
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, applicable_package: opt.id }));
                                                    setModalDropdown(null);
                                                }}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="admin-form-group promo-modal-field" style={{ position: 'relative' }}>
                                <label>Who can use this code</label>
                                <button
                                    type="button"
                                    className={`filter-dropdown promo-modal-dropdown ${modalDropdown === 'audience' ? 'active' : ''}`}
                                    onClick={() => setModalDropdown((d) => (d === 'audience' ? null : 'audience'))}
                                    aria-expanded={modalDropdown === 'audience'}
                                    aria-haspopup="listbox"
                                >
                                    <span style={{ textAlign: 'left', flex: 1 }}>{audienceFormLabel(formData.audience)}</span>
                                    <ChevronDown size={14} className="text-sub" style={{ flexShrink: 0 }} />
                                </button>
                                {modalDropdown === 'audience' && (
                                    <div
                                        className="admin-dropdown-menu promo-modal-dropdown-menu"
                                        role="listbox"
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            top: '100%',
                                            marginTop: 8,
                                            zIndex: 300,
                                            minWidth: 'unset',
                                        }}
                                    >
                                        {(
                                            [
                                                { value: 'verified' as const, label: 'Verified members (email verified)' },
                                                { value: 'unverified' as const, label: 'Unverified members (email not verified)' },
                                            ]
                                        ).map((opt) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                role="option"
                                                className={`dropdown-item ${formData.audience === opt.value ? 'active' : ''}`}
                                                onClick={() => {
                                                    setFormData((prev) => ({ ...prev, audience: opt.value }));
                                                    setModalDropdown(null);
                                                }}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <p style={{ fontSize: 12, color: 'var(--admin-text-sub)', marginTop: 8, marginBottom: 0 }}>
                                    Restricted codes require the customer to be signed in with a valid session. Public pages only list codes the viewer is eligible to see.
                                </p>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" onClick={handleCloseModal} className="cancel-btn">Cancel</button>
                                <button type="submit" className="submit-btn">{editingCode ? 'Save Changes' : 'Create Promo Code'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .promo-code-pill {
                    display: inline-flex;
                    align-items: center;
                    background-color: var(--admin-hover);
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-weight: 700;
                    color: var(--admin-accent);
                    border: 1px solid var(--admin-border);
                    font-family: monospace;
                    letter-spacing: 0.5px;
                }
                .usage-stats {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .usage-stats .current {
                    font-weight: 700;
                    color: var(--admin-text-main);
                }
                .usage-stats .separator {
                    color: var(--admin-text-sub);
                }
                .usage-stats .total {
                    color: var(--admin-text-sub);
                    font-size: 13px;
                }
                .status-toggle-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .status-toggle-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    padding: 0;
                    transition: transform 0.2s ease;
                }
                .status-toggle-btn:hover {
                    transform: scale(1.1);
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: flex-end;
                    gap: 16px;
                }
                .form-or {
                    padding-bottom: 24px;
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--admin-text-sub);
                }
                .input-with-icon {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .input-with-icon svg {
                    position: absolute;
                    left: 12px;
                    color: var(--admin-text-sub);
                }
                .input-with-icon input {
                    width: 100%;
                    padding: 10px 12px 10px 40px;
                    background-color: var(--admin-bg);
                    border: 1px solid var(--admin-border);
                    border-radius: 8px;
                    color: var(--admin-text-main);
                    font-size: 14px;
                }
                .admin-select {
                    width: 100%;
                    padding: 10px 12px;
                    background-color: var(--admin-bg);
                    border: 1px solid var(--admin-border);
                    border-radius: 8px;
                    color: var(--admin-text-main);
                }
                .promo-modal {
                    max-width: 600px;
                }
            `}</style>
        </div>
    );
};

export default AdminDiscounts;
