import React from 'react';
import { Edit2, X, Tag } from 'lucide-react';

const PendingApprovals = () => {
  const approvals = [
    {
      id: 1,
      title: "Wedding Package Mod",
      subtitle: "Sarah Jenkins • #BK-782",
      icon: <Edit2 size={16} />,
      type: "edit"
    },
    {
      id: 2,
      title: "Booking Cancellation",
      subtitle: "Mark Thompson • #BK-901",
      icon: <X size={16} />,
      type: "danger"
    },
    {
      id: 3,
      title: "Promo Code Extension",
      subtitle: "System Task • #PR-33",
      icon: <Tag size={16} />,
      type: "info"
    }
  ];

  return (
    <div className="admin-card pending-card">
      <div className="card-title">
        Pending Approvals
        <span className="view-all-link">View All</span>
      </div>

      <div className="approvals-list">
        {approvals.map(approval => (
          <div key={approval.id} className="approval-item">
            <div className={`approval-icon-bg bg-${approval.type}`}>
               {approval.icon}
            </div>
            <div className="approval-details">
              <h4>{approval.title}</h4>
              <p>{approval.subtitle}</p>
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
