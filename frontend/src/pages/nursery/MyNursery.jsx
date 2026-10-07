import React, { useState, useEffect } from 'react';
import { getNurseryProfile } from '../../services/nurseryService';
import { ProfileSkeleton } from '../../components/common/Skeletons';
import './NurseryPages.css';

const MyNursery = () => {
  const [nursery, setNursery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getNurseryProfile();
      setNursery(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching nursery profile:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please login again.');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to access this section.');
      } else if (!err.response) {
        setError('Unable to connect to the server. Please try again.');
      } else {
        setError('Failed to load nursery profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="nursery-page">
        <ProfileSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="nursery-page">
        <div className="error-message" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button onClick={fetchProfile} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!nursery) {
    return (
      <div className="nursery-page">
        <div className="error-message">No nursery profile found.</div>
      </div>
    );
  }

  return (
    <div className="nursery-page">
      <div className="page-header">
        <h1 className="page-title">My Nursery Profile</h1>
      </div>

      <div className="profile-card">
        {nursery.logoUrl ? (
          <img src={nursery.logoUrl} alt={nursery.name} className="nursery-logo" />
        ) : (
          <div className="nursery-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            No Logo
          </div>
        )}
        
        <div className="nursery-info">
          <h2>{nursery.name}</h2>
          <p>{nursery.description || 'No description provided.'}</p>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Address</span>
              <span className="info-value">{nursery.address}</span>
            </div>
            <div className="info-item">
              <span className="info-label">City</span>
              <span className="info-value">{nursery.city}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Postal Code</span>
              <span className="info-value">{nursery.postalCode || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Contact Email</span>
              <span className="info-value">{nursery.contactEmail || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Contact Phone</span>
              <span className="info-value">{nursery.contactPhone || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyNursery;
