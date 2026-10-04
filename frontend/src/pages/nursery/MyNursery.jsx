import React, { useState, useEffect } from 'react';
import { getNurseryProfile } from '../../services/nurseryService';
import './NurseryPages.css';

const MyNursery = () => {
  const [nursery, setNursery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getNurseryProfile();
        setNursery(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching nursery profile:', err);
        setError('Failed to load nursery profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="nursery-page">Loading nursery profile...</div>;
  }

  if (error) {
    return (
      <div className="nursery-page">
        <div className="error-message">{error}</div>
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
