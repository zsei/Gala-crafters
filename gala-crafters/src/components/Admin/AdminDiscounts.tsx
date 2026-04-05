import React, { useState, useEffect } from 'react';
import { Tag, Plus, Search, Edit2, Trash2, Filter, X, Calendar as CalendarIcon, Hash, Percent, ToggleLeft, ToggleRight } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';
import { API_BASE_URL, API_ENDPOINTS } from '../../api/config';

interface PromoCode {
  id: number;
  code: string;
  discount_percentage: number | null;
  discount_amount: number | null;
  expiry_date: string | null;
  max_uses: number | null;
  current_uses: number;
  status: string;
  created_at: string;
}

const AdminDiscounts = () => {
    const [isDark, setIsDark] = useState(false);
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
        status: 'Active'
    });

    useEffect(() => {
        const savedTheme = localStorage.getItem('galaAdminTheme');
        if (savedTheme === 'dark') setIsDark(true);
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admin/promo-codes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch promo codes');
            const data = await response.json();
            setPromoCodes(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem('galaAdminTheme', newTheme ? 'dark' : 'light');
    };

    const toggleSidebar = () => setIsCollapsed(prev => !prev);

    const handleOpenModal = (code: PromoCode | null = null) => {
        if (code) {
            setEditingCode(code);
            setFormData({
                code: code.code,
                discount_percentage: code.discount_percentage?.toString() || '',
                discount_amount: code.discount_amount?.toString() || '',
                expiry_date: code.expiry_date || '',
                max_uses: code.max_uses?.toString() || '',
                status: code.status
            });
        } else {
            setEditingCode(null);
            setFormData({
                code: '',
                discount_percentage: '',
                discount_amount: '',
                expiry_date: '',
                max_uses: '',
                status: 'Active'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCode(null);
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
            expiry_date: formData.expiry_date || null
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
                handleCloseModal();
            } else {
                const errData = await response.json();
                alert(errData.detail || 'Failed to save promo code');
            }
        } catch (err) {
            console.error('Error saving promo code:', err);
        }
    };

    const handleToggleStatus = async (code: PromoCode) => {
        const token = localStorage.getItem('token');
        const newStatus = code.status === 'Active' ? 'Inactive' : 'Active';
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/promo-codes/${code.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...code,
                    status: newStatus,
                    expiry_date: code.expiry_date || null
                })
            });

            if (response.ok) {
                fetchPromoCodes();
            }
        } catch (err) {
            console.error('Error toggling status:', err);
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
                        <h1>Promo Codes & Discounts</h1>
                        <p>Manage promotional codes, usage limits, and seasonal offers.</p>
                    </div>
                    
                    <div className="bookings-header-actions">
                        <div className="search-input-wrapper">
                            <Search size={16} className="search-icon" />
                            <input type="text" placeholder="Search codes..." />
                        </div>
                        <button className="export-btn" onClick={() => handleOpenModal()} style={{ backgroundColor: 'var(--admin-accent)', color: 'white', border: 'none' }}>
                            <Plus size={16} />
                            New Code
                        </button>
                    </div>
                </header>

                <div className="bookings-toolbar">
                    <div className="filters-group">
                        <button className="filter-dropdown">
                            <Filter size={16} className="text-accent" />
                            Status: All
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-state">Loading promo codes...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Promo Code</th>
                                    <th>Discount</th>
                                    <th>Expiry Date</th>
                                    <th>Usage</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {promoCodes.map((code) => (
                                    <tr key={code.id}>
                                        <td>
                                            <div className="promo-code-pill">
                                                <Tag size={14} className="mr-2" />
                                                {code.code}
                                            </div>
                                        </td>
                                        <td>
                                            {code.discount_percentage 
                                                ? `${code.discount_percentage}% Off` 
                                                : `$${code.discount_amount?.toLocaleString()} Off`}
                                        </td>
                                        <td>{code.expiry_date || 'No Expiry'}</td>
                                        <td>
                                            <div className="usage-stats">
                                                <span className="current">{code.current_uses}</span>
                                                <span className="separator">/</span>
                                                <span className="total">{code.max_uses || '∞'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="status-toggle-wrapper">
                                                <span className={`status-badge ${code.status === 'Active' ? 'success' : 'neutral'}`}>
                                                    {code.status}
                                                </span>
                                                <button 
                                                    onClick={() => handleToggleStatus(code)}
                                                    className="status-toggle-btn"
                                                >
                                                    {code.status === 'Active' ? <ToggleRight size={20} className="text-accent" /> : <ToggleLeft size={20} className="text-sub" />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="table-actions">
                                                <button onClick={() => handleOpenModal(code)} className="action-icon-btn edit" title="Edit">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(code.id)} className="action-icon-btn delete" title="Delete">
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
                            <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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

                            <div className="form-group">
                                <label>Initial Status</label>
                                <select name="status" value={formData.status} onChange={handleInputChange} className="admin-select">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
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
