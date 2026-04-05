import React, { useState, useEffect } from 'react';
import { FileText, Download, Calendar, TrendingUp, TrendingDown, DollarSign, Package, User, BarChart2, PieChart as PieChartIcon, CheckCircle } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import AdminSidebar from './AdminSidebar';
import './Admin.css';
import { API_BASE_URL } from '../../api/config';

interface SalesData {
  monthly: any[];
  yearly: any[];
}

const AdminReports = () => {
    const [isDark, setIsDark] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [salesData, setSalesData] = useState<SalesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        const savedTheme = localStorage.getItem('galaAdminTheme');
        if (savedTheme === 'dark') setIsDark(true);
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admin/reports/sales`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch reports');
            const data = await response.json();
            setSalesData(data);
        } catch (err: any) {
            console.error('Error fetching reports:', err);
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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value);
    };

    const currentData = viewMode === 'monthly' ? salesData?.monthly : salesData?.yearly;

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
                        <h1>Business Intelligence & Reports</h1>
                        <p>Detailed sales performance and booking analytics.</p>
                    </div>
                    
                    <div className="bookings-header-actions">
                        <button className="export-btn secondary">
                            <Download size={16} />
                            Export PDF
                        </button>
                        <button className="export-btn" style={{ backgroundColor: 'var(--admin-accent)', color: 'white', border: 'none' }}>
                            <Download size={16} />
                            CSV Full Report
                        </button>
                    </div>
                </header>

                <div className="reports-overview-row">
                    <div className="admin-card metric-card gold-border">
                        <div className="metric-content">
                            <span className="metric-label">Total Annual Revenue</span>
                            <div className="metric-value-row">
                                <DollarSign size={20} className="text-accent" />
                                <h3>{salesData ? formatCurrency(salesData.yearly.reduce((acc, curr) => acc + Number(curr.total_sales || 0), 0)) : '$0'}</h3>
                            </div>
                            <div className="metric-trend positive">
                                <TrendingUp size={14} />
                                <span>+12.5% from last year</span>
                            </div>
                        </div>
                        <div className="metric-icon-bg">
                            <TrendingUp size={64} />
                        </div>
                    </div>

                    <div className="admin-card metric-card">
                        <div className="metric-content">
                            <span className="metric-label">Total Bookings</span>
                            <div className="metric-value-row">
                                <Package size={20} className="text-accent" />
                                <h3>{salesData ? salesData.yearly.reduce((acc, curr) => acc + Number(curr.total_bookings || 0), 0) : '0'}</h3>
                            </div>
                            <div className="metric-trend positive">
                                <TrendingUp size={14} />
                                <span>+4.2% from last year</span>
                            </div>
                        </div>
                        <div className="metric-icon-bg">
                            <Package size={64} />
                        </div>
                    </div>

                    <div className="admin-card metric-card">
                        <div className="metric-content">
                            <span className="metric-label">Average Order Value</span>
                            <div className="metric-value-row">
                                <TrendingUp size={20} className="text-accent" />
                                <h3>{salesData && salesData.yearly.length > 0 ? formatCurrency(salesData.yearly.reduce((acc, curr) => acc + Number(curr.total_sales || 0), 0) / salesData.yearly.reduce((acc, curr) => acc + Number(curr.total_bookings || 0), 1)) : '$0'}</h3>
                            </div>
                            <div className="metric-trend positive">
                                <CheckCircle size={14} />
                                <span>Above target</span>
                            </div>
                        </div>
                        <div className="metric-icon-bg">
                            <BarChart2 size={64} />
                        </div>
                    </div>
                </div>

                <div className="reports-main-content">
                    <div className="admin-card chart-container-card">
                        <div className="card-header-with-tabs">
                            <div className="card-header-title">
                                <h3>Sales Performance</h3>
                                <p>Revenue distribution over time.</p>
                            </div>
                            <div className="view-toggle-tabs">
                                <button 
                                    className={viewMode === 'monthly' ? 'active' : ''} 
                                    onClick={() => setViewMode('monthly')}
                                >
                                    Monthly
                                </button>
                                <button 
                                    className={viewMode === 'yearly' ? 'active' : ''} 
                                    onClick={() => setViewMode('yearly')}
                                >
                                    Yearly
                                </button>
                            </div>
                        </div>
                        <div className="chart-wrapper">
                            {loading ? (
                                <div className="chart-loading">Loading chart data...</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={currentData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" />
                                        <XAxis 
                                            dataKey={viewMode === 'monthly' ? 'month' : 'year'} 
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'var(--admin-text-sub)', fontSize: 12 }}
                                        />
                                        <YAxis 
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'var(--admin-text-sub)', fontSize: 12 }}
                                            tickFormatter={(value) => `$${value / 1000}k`}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'var(--admin-card-bg)', 
                                                border: '1px solid var(--admin-border)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                            formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                                        />
                                        <Bar dataKey="total_sales" radius={[4, 4, 0, 0]} barSize={40}>
                                            {(currentData || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--admin-accent)' : 'var(--admin-accent-sub)'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    <div className="admin-card report-table-card">
                        <div className="card-header-title">
                            <h3>Detailed Statistics</h3>
                            <p>Breakdown by {viewMode} periods.</p>
                        </div>
                        <div className="admin-table-container mini-table">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Bookings</th>
                                        <th className="text-right">Total Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData?.map((row, i) => (
                                        <tr key={i}>
                                            <td className="font-bold">{viewMode === 'monthly' ? row.month : row.year}</td>
                                            <td>{row.total_bookings}</td>
                                            <td className="text-right text-accent font-bold">{formatCurrency(row.total_sales)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .reports-overview-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                    margin-bottom: 24px;
                }
                .metric-card {
                    position: relative;
                    overflow: hidden;
                    padding: 24px;
                }
                .gold-border {
                    border-left: 4px solid var(--admin-accent);
                }
                .metric-content {
                    position: relative;
                    z-index: 2;
                }
                .metric-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--admin-text-sub);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .metric-value-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 12px 0;
                }
                .metric-value-row h3 {
                    font-size: 28px;
                    font-weight: 800;
                    color: var(--admin-text-main);
                }
                .metric-trend {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    font-weight: 700;
                }
                .metric-trend.positive {
                    color: #10b981;
                }
                .metric-icon-bg {
                    position: absolute;
                    right: -10px;
                    bottom: -10px;
                    color: var(--admin-hover);
                    opacity: 0.4;
                    z-index: 1;
                }
                .reports-main-content {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 24px;
                }
                .chart-container-card {
                    padding: 24px;
                }
                .card-header-with-tabs {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }
                .view-toggle-tabs {
                    display: flex;
                    background-color: var(--admin-bg);
                    padding: 4px;
                    border-radius: 8px;
                    border: 1px solid var(--admin-border);
                }
                .view-toggle-tabs button {
                    padding: 6px 16px;
                    border-radius: 6px;
                    border: none;
                    background: none;
                    font-size: 12px;
                    font-weight: 700;
                    color: var(--admin-text-sub);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .view-toggle-tabs button.active {
                    background-color: var(--admin-white);
                    color: var(--admin-accent);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .chart-wrapper {
                    height: 350px;
                }
                .report-table-card {
                    padding: 24px;
                }
                .mini-table {
                    margin-top: 20px;
                }
                .mini-table table th {
                    font-size: 11px;
                }
                .mini-table table td {
                    padding: 12px 16px;
                    font-size: 13px;
                }
                .chart-loading {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--admin-text-sub);
                }
                .text-accent {
                    color: var(--admin-accent);
                }
                .font-bold {
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
};

export default AdminReports;
