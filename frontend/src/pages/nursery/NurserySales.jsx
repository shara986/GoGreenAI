import React, { useState } from 'react';
import './NurseryPages.css';

const NurserySales = () => {
  const [timeframe, setTimeframe] = useState('month');

  const stats = {
    totalRevenue: '$3,840.50',
    ordersCompleted: 42,
    plantsSold: 128,
    avgOrderValue: '$91.44'
  };

  const recentTransactions = [
    { id: 'ORD-9821', customer: 'Alice Johnson', items: 'Monstera Deliciosa, Snake Plant', amount: '$48.49', status: 'COMPLETED', date: '2026-10-08' },
    { id: 'ORD-9820', customer: 'Bob Smith', items: 'Peace Lily x 2', amount: '$44.00', status: 'COMPLETED', date: '2026-10-07' },
    { id: 'ORD-9818', customer: 'Charlie Brown', items: 'Red Rose Bush', amount: '$19.75', status: 'DELIVERED', date: '2026-10-06' },
    { id: 'ORD-9815', customer: 'Diana Prince', items: 'Aloe Vera, Golden Pothos', amount: '$30.49', status: 'COMPLETED', date: '2026-10-05' },
    { id: 'ORD-9812', customer: 'Evan Wright', items: 'Jade Plant Tree x 3', amount: '$50.97', status: 'COMPLETED', date: '2026-10-04' },
  ];

  return (
    <div className="nursery-page">
      <div className="page-header">
        <div>
          <h1>📈 Sales & Revenue Analytics</h1>
          <p className="subtitle">Monitor sales performance, earnings, and order statistics for your nursery.</p>
        </div>
        <div>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ccc', fontWeight: '600' }}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderTop: '4px solid #2e7d32' }}>
          <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Total Revenue</span>
          <h2 style={{ fontSize: '2rem', color: '#1a4331', marginTop: '6px' }}>{stats.totalRevenue}</h2>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderTop: '4px solid #1565c0' }}>
          <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Orders Fulfilled</span>
          <h2 style={{ fontSize: '2rem', color: '#1a4331', marginTop: '6px' }}>{stats.ordersCompleted}</h2>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderTop: '4px solid #ef6c00' }}>
          <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Plants Sold</span>
          <h2 style={{ fontSize: '2rem', color: '#1a4331', marginTop: '6px' }}>{stats.plantsSold}</h2>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderTop: '4px solid #8e24aa' }}>
          <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600', textTransform: 'uppercase' }}>Avg. Order Value</span>
          <h2 style={{ fontSize: '2rem', color: '#1a4331', marginTop: '6px' }}>{stats.avgOrderValue}</h2>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: '1.3rem', color: '#1a4331', marginBottom: '1.5rem' }}>🧾 Recent Sales Transactions</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0', color: '#666', fontSize: '0.9rem' }}>
              <th style={{ padding: '12px' }}>Order ID</th>
              <th style={{ padding: '12px' }}>Customer</th>
              <th style={{ padding: '12px' }}>Items</th>
              <th style={{ padding: '12px' }}>Amount</th>
              <th style={{ padding: '12px' }}>Date</th>
              <th style={{ padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((tx) => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                <td style={{ padding: '14px 12px', fontWeight: '600', color: '#2e7d32' }}>{tx.id}</td>
                <td style={{ padding: '14px 12px', color: '#333' }}>{tx.customer}</td>
                <td style={{ padding: '14px 12px', color: '#666' }}>{tx.items}</td>
                <td style={{ padding: '14px 12px', fontWeight: '600', color: '#1a4331' }}>{tx.amount}</td>
                <td style={{ padding: '14px 12px', color: '#888' }}>{tx.date}</td>
                <td style={{ padding: '14px 12px' }}>
                  <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NurserySales;
