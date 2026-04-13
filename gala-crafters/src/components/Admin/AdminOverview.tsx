import React from 'react';
import { DollarSign, BookmarkCheck, ClipboardCheck, Users } from 'lucide-react';
import { API_BASE_URL, API_ENDPOINTS } from '../../api/config';

const AdminOverview = () => {
  const [metricsData, setMetricsData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADMIN.METRICS}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setMetricsData(data);
        }
      } catch (err) {
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const metrics = metricsData ? [
    {
      title: "Active Bookings",
      value: metricsData.active_bookings || 0,
      icon: <BookmarkCheck size={20} color="#c49a2c" />,
      change: "Current",
      positive: true
    },
    {
      title: "Pending Approvals",
      value: metricsData.pending_approvals || 0,
      icon: <ClipboardCheck size={20} color="#c49a2c" />,
      change: metricsData.pending_approvals > 0 ? "Action Required" : "All Clear",
      warning: metricsData.pending_approvals > 0
    },
    {
      title: "Total Customers",
      value: metricsData.total_customers || 0,
      icon: <Users size={20} color="#c49a2c" />,
      change: "Total",
      positive: true
    },
    {
      title: "Total Revenue",
      value: `₱${(metricsData.total_revenue || 0).toLocaleString()}`,
      icon: <DollarSign size={20} color="#c49a2c" />,
      change: "Gross",
      positive: true
    }
  ] : [];

  if (loading) return <div className="admin-grid-top">Loading analytics...</div>;

  return (
    <div className="admin-grid-top">
      {metrics.map((metric, index) => (
        <div key={index} className="admin-card metric-card">
          <div className="metric-header">
            <div className="metric-icon-wrapper">
              {metric.icon}
            </div>
            <span className={`metric-badge ${metric.positive && !metric.warning ? 'positive' : ''} ${metric.warning ? 'warning' : ''}`}>
              {metric.change}
            </span>
          </div>
          <div className="metric-info">
            <p className="metric-title">{metric.title}</p>
            <h2 className="metric-value">{metric.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOverview;
