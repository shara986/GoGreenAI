import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlantStatistics } from '../../services/plantService';
import { DashboardSkeleton } from '../../components/common/Skeletons';
import './NurseryPages.css';

const NurseryDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const data = await getPlantStatistics();
      setStatistics(data.data || data);
      setError('');
    } catch (err) {
      console.error('Error fetching statistics:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to access this section.');
      } else if (!err.response) {
        setError('Unable to connect to the server. Please try again.');
      } else {
        setError('Failed to load dashboard statistics.');
      }
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="nursery-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {error && (
        <div className="error-message" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button onClick={fetchStatistics} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>
            Retry
          </button>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-title">Total Plants</h3>
          <p className="stat-value">{statistics?.totalPlants ?? 'N/A'}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Active Plants</h3>
          <p className="stat-value">{statistics?.activePlants ?? 'N/A'}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Inactive Plants</h3>
          <p className="stat-value">{statistics?.inactivePlants ?? 'N/A'}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Low Stock Plants</h3>
          <p className="stat-value">{statistics?.lowStockPlants ?? 'N/A'}</p>
        </div>
      </div>

      <div className="page-header" style={{ marginTop: '40px' }}>
        <h2 className="page-title" style={{ fontSize: '1.4rem' }}>Quick Actions</h2>
      </div>
      
      <div className="quick-actions">
        <Link to="/nursery/plants/add" className="btn-primary">
          + Add Plant
        </Link>
        <Link to="/nursery/plants" className="btn-secondary">
          Manage Plants
        </Link>
        <Link to="/nursery/inventory" className="btn-secondary">
          Inventory
        </Link>
        <Link to="/nursery/profile" className="btn-secondary">
          View Nursery
        </Link>
      </div>
    </div>
  );
};

export default NurseryDashboard;
