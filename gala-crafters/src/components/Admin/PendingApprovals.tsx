import React, { useState, useEffect } from 'react';
import { X, Tag, CalendarClock, Bookmark } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';

const PendingApprovals = () => {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/admin/pending-approvals`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setApprovals(data);
        }
      } catch (error) {
        console.error('Error fetching pending approvals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovals();
  }, []);

  const getIcon = (type: string) => {
    const t = type?.toLowerCase();
    if (t === 'cancellation') return <X size={18} color="#fff" />;
    if (t === 'discount') return <Tag size={18} color="#fff" />;
    if (t === 'reschedule') return <CalendarClock size={18} color="#fff" />;
    if (t.includes('booking')) return <Bookmark size={18} color="#fff" />;
    return <Bookmark size={18} color="#fff" />;
  };

  const getBadgeType = (type: string) => {
    const t = type?.toLowerCase();
    if (t === 'cancellation') return 'danger';
    if (t === 'discount' || t.includes('booking')) return 'success';
    if (t === 'reschedule') return 'warning';
    return 'info';
  };

  return (
    <div className="admin-card pending-card">
      <div className="card-title">
        Pending Approvals
      </div>

      <div className="approvals-list">
        {loading ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text-sub)' }}>Loading...</div> : 
         approvals.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text-sub)' }}>No pending approvals</div> :
         approvals.slice(0, 3).map(approval => (
          <div key={approval.id} className="approval-item">
            <div className={`approval-icon-bg bg-${getBadgeType(approval.approval_type)}`}>
               {getIcon(approval.approval_type)}
            </div>
            <div className="approval-details">
              <h4>{approval.approval_type} Request</h4>
              <p>{approval.customer_name} • {approval.description}</p>
            </div>
          </div>
         ))}
      </div>
    </div>
  );
};

export default PendingApprovals;
