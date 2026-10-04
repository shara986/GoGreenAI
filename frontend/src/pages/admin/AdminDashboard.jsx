import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      <p>This is a placeholder for the Admin Dashboard. Here you will manage users, categories, and system settings.</p>
    </div>
  );
};

export default AdminDashboard;
