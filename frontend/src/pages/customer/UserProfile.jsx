import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './CustomerPages.css';

const UserProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: '123 Garden View St, Green City, 10001',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState('details');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Profile details updated successfully!' });
      setSaving(false);
    }, 600);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaving(false);
    }, 600);
  };

  return (
    <div className="customer-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>My Profile</h1>
          <p className="subtitle">Manage your personal information and security preferences</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px', alignItems: 'start' }}>
        {/* User Badge Card */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <div style={{ 
            width: '90px', 
            height: '90px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            margin: '0 auto 1rem auto'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : '🌿'}
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#1a4331', marginBottom: '4px' }}>{user?.name || user?.username}</h2>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>@{user?.username}</p>
          <span style={{ 
            background: '#e8f5e9', 
            color: '#2e7d32', 
            padding: '4px 14px', 
            borderRadius: '20px', 
            fontWeight: '600', 
            fontSize: '0.85rem' 
          }}>
            {user?.role === 'ROLE_CUSTOMER' ? '🪴 Customer' : user?.role}
          </span>

          <div style={{ marginTop: '2rem', textAlign: 'left', borderTop: '1px solid #f0f0f0', paddingTop: '1rem', fontSize: '0.9rem', color: '#555' }}>
            <p style={{ marginBottom: '8px' }}><strong>Email:</strong> {user?.email}</p>
            <p style={{ marginBottom: '8px' }}><strong>Phone:</strong> {user?.phoneNumber || 'N/A'}</p>
            <p><strong>Member Since:</strong> 2026</p>
          </div>
        </div>

        {/* Tabbed Profile Content */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', gap: '15px', borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => { setActiveTab('details'); setMessage({ type: '', text: '' }); }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                color: activeTab === 'details' ? '#2e7d32' : '#888',
                borderBottom: activeTab === 'details' ? '3px solid #2e7d32' : 'none',
                paddingBottom: '8px',
                cursor: 'pointer'
              }}
            >
              Account Details
            </button>
            <button
              onClick={() => { setActiveTab('security'); setMessage({ type: '', text: '' }); }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                color: activeTab === 'security' ? '#2e7d32' : '#888',
                borderBottom: activeTab === 'security' ? '3px solid #2e7d32' : 'none',
                paddingBottom: '8px',
                cursor: 'pointer'
              }}
            >
              Security & Password
            </button>
          </div>

          {message.text && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              backgroundColor: message.type === 'success' ? '#e8f5e9' : '#ffebee',
              color: message.type === 'success' ? '#2e7d32' : '#c62828',
              fontWeight: '500'
            }}>
              {message.text}
            </div>
          )}

          {activeTab === 'details' ? (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Phone Number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    placeholder="Enter phone number"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Username</label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    disabled
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #eee', background: '#f9f9f9', color: '#888' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Default Shipping Address</label>
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  rows="3"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  alignSelf: 'flex-start',
                  padding: '12px 28px',
                  backgroundColor: '#2e7d32',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '500px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', color: '#333' }}>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc' }}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  alignSelf: 'flex-start',
                  padding: '12px 28px',
                  backgroundColor: '#2e7d32',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                {saving ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
