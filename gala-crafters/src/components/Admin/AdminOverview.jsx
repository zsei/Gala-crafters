import React from 'react';
import { DollarSign, BookmarkCheck, ClipboardCheck, Users } from 'lucide-react';

const AdminOverview = () => {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$42,850.00",
      change: "+12.5%",
      icon: <DollarSign size={20} className="text-accent" />,
      positive: true
    },
    {
      title: "Active Bookings",
      value: "156",
      change: "+8.2%",
      icon: <BookmarkCheck size={20} className="text-accent" />,
      positive: true
    },
    {
      title: "Approval Requests",
      value: "12",
      change: "4 Pending",
      icon: <ClipboardCheck size={20} className="text-accent" />,
      positive: false,
      warning: true
    },
    {
      title: "Registered Users",
      value: "1,204",
      change: "+15 new",
      icon: <Users size={20} className="text-accent" />,
      positive: true
    }
  ];

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
