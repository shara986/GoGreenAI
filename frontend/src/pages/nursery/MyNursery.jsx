import React, { useState, useEffect } from 'react';
import { getNurseryProfile, updateNurseryProfile } from '../../services/nurseryService';
import { useAuth } from '../../context/AuthContext';
import { ProfileSkeleton } from '../../components/common/Skeletons';
import './NurseryPages.css';

const MyNursery = () => {
  const { user } = useAuth();
  const [nursery, setNursery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    postalCode: '',
    contactEmail: '',
    contactPhone: '',
    logoUrl: '',
  });

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getNurseryProfile();
      const data = response.data;
      setNursery(data);
      if (data) {
        setFormData({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
          contactEmail: data.contactEmail || user?.email || '',
          contactPhone: data.contactPhone || user?.phoneNumber || '',
          logoUrl: data.logoUrl || '',
        });
      }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setError('');
    try {
      const res = await updateNurseryProfile(formData);
      setNursery(res.data);
      setSuccessMsg('Nursery profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="nursery-page">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="nursery-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">🏡 My Nursery Profile</h1>
          <p style={{ color: '#666', marginTop: '4px' }}>View and update your nursery business and owner contact details.</p>
        </div>
        {!isEditing && nursery && (
          <button
            className="btn-primary"
            onClick={() => setIsEditing(true)}
            style={{ width: 'auto', padding: '10px 20px' }}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {successMsg && (
        <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '600' }}>
          {successMsg}
        </div>
      )}

      {error && (
        <div className="error-message" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span>{error}</span>
          <button onClick={fetchProfile} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>
            Retry
          </button>
        </div>
      )}

      {!nursery && !loading && (
        <div className="error-message">No nursery profile found.</div>
      )}

      {nursery && !isEditing && (
        <div className="profile-card" style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', gap: '25px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {nursery.logoUrl ? (
              <img src={nursery.logoUrl} alt={nursery.name} className="nursery-logo" style={{ width: '110px', height: '110px', borderRadius: '16px', objectFit: 'cover' }} />
            ) : (
              <div className="nursery-logo" style={{ width: '110px', height: '110px', borderRadius: '16px', background: '#e8f5e9', color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
                🪴
              </div>
            )}

            <div className="nursery-info" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#1a4331', margin: 0 }}>{nursery.name}</h2>
                <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Verified Nursery</span>
              </div>
              
              <p style={{ color: '#555', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {nursery.description || 'No description provided.'}
              </p>

              <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div className="info-item" style={{ background: '#f9fbf9', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4f0' }}>
                  <span className="info-label" style={{ display: 'block', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Nursery Owner</span>
                  <span className="info-value" style={{ fontWeight: '700', color: '#1a4331', fontSize: '1.05rem' }}>{nursery.ownerName || user?.name || user?.username}</span>
                </div>

                <div className="info-item" style={{ background: '#f9fbf9', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4f0' }}>
                  <span className="info-label" style={{ display: 'block', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Contact Email</span>
                  <span className="info-value" style={{ fontWeight: '600', color: '#333' }}>{nursery.contactEmail || user?.email || 'N/A'}</span>
                </div>

                <div className="info-item" style={{ background: '#f9fbf9', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4f0' }}>
                  <span className="info-label" style={{ display: 'block', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Contact Phone</span>
                  <span className="info-value" style={{ fontWeight: '600', color: '#333' }}>{nursery.contactPhone || user?.phoneNumber || 'N/A'}</span>
                </div>

                <div className="info-item" style={{ background: '#f9fbf9', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4f0' }}>
                  <span className="info-label" style={{ display: 'block', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Address</span>
                  <span className="info-value" style={{ fontWeight: '600', color: '#333' }}>{nursery.address}</span>
                </div>

                <div className="info-item" style={{ background: '#f9fbf9', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4f0' }}>
                  <span className="info-label" style={{ display: 'block', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>City</span>
                  <span className="info-value" style={{ fontWeight: '600', color: '#333' }}>{nursery.city}</span>
                </div>

                <div className="info-item" style={{ background: '#f9fbf9', padding: '12px 16px', borderRadius: '10px', border: '1px solid #edf4f0' }}>
                  <span className="info-label" style={{ display: 'block', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: '600' }}>Postal Code</span>
                  <span className="info-value" style={{ fontWeight: '600', color: '#333' }}>{nursery.postalCode || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {nursery && isEditing && (
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#1a4331', marginBottom: '1.5rem' }}>Edit Nursery Details</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Nursery Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Owner Name</label>
                <input
                  type="text"
                  value={nursery.ownerName || user?.name || user?.username}
                  disabled
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #eee', background: '#f9f9f9', color: '#777' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="owner@example.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Contact Phone</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Street Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Logo Image URL</label>
              <input
                type="text"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.jpg"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Nursery Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '12px 28px',
                  backgroundColor: '#2e7d32',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyNursery;
