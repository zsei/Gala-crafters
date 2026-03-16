import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [];

const AdminChart = () => {
  return (
    <div className="admin-card admin-chart-card">
      <div className="card-title">
        Monthly Transaction Statistics
        <button className="admin-filter-btn">Last 6 Months</button>
      </div>
      
      <div className="chart-container" style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            {/* The background bar to mimic the "filled" effect */}
            <Bar dataKey="value" fill="var(--admin-hover)" radius={[4, 4, 4, 4]} barSize={80} background={{ fill: 'var(--admin-hover)', radius: 4 }}>
               {
                 data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill="var(--admin-accent)" />
                 ))
               }
            </Bar>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--admin-text-sub)', fontSize: 12 }} 
              dy={10} 
            />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ backgroundColor: 'var(--admin-card-bg)', borderColor: 'var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text-main)' }}
              itemStyle={{ color: 'var(--admin-accent)', fontWeight: 'bold' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminChart;
