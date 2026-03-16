import React from 'react';
import { DollarSign, BookmarkCheck, ClipboardCheck, Users } from 'lucide-react';

const AdminOverview = () => {
  const metrics = [];

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
