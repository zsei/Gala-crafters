import React, { useState, useEffect } from 'react';
import { Edit2, X, Tag, CalendarClock } from 'lucide-react';
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
    switch (type?.toLowerCase()) {
      case 'cancellation': return <X size={18} color="#fff" />;
      case 'discount': return <Tag size={18} color="#fff" />;
      case 'reschedule': return <CalendarClock size={18} color="#fff" />;
      default: return <Edit2 size={18} color="#fff" />;
    }
  };

  const getBadgeType = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'cancellation': return 'danger';
      case 'discount': return 'success';
      case 'reschedule': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div className="admin-card pending-card">
      <div className="card-title">
        Pending Approvals
        <span className="view-all-link">View All</span>
      </div>

      <div className="approvals-list">
        {loading ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text-sub)' }}>Loading...</div> : 
         approvals.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text-sub)' }}>No pending approvals</div> :
         approvals.map(approval => (
          <div key={approval.id} className="approval-item">
            <div className={`approval-icon-bg bg-${getBadgeType(approval.approval_type)}`}>
               {getIcon(approval.approval_type)}
            </div>
            <div className="approval-details">
              <h4>{approval.approval_type} Request</h4>
              <p>{approval.customer_name} • {approval.description}</p>
            </div>
            <div className="approval-actions">
               <button className="approval-action-btn accept">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
               </button>
               <button className="approval-action-btn reject">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
               </button>
            </div>
          </div>
         ))}
      </div>
    </div>
  );
};

export default PendingApprovals;
