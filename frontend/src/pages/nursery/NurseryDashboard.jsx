import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlantStatistics } from '../../services/plantService';
import { DashboardSkeleton } from '../../components/common/Skeletons';
import './NurseryPages.css';

const NurseryDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getPlantStatistics();
        // getPlantStatistics returns response.data which is { success, data: stats, message }
        setStatistics(data.data || data);
        setError('');
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to load dashboard statistics.');
        setStatistics({});
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="nursery-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

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
