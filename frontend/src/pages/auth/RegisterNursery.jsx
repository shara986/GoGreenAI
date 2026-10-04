import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const RegisterNursery = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    nurseryName: '',
    address: '',
    city: '',
    postalCode: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerNursery, isAuthenticated, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate(getDashboardPath(), { replace: true });
  }, [isAuthenticated, navigate, getDashboardPath]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsSubmitting(true);
    try {
      await registerNursery(formData);
      setSuccess('Nursery Owner registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <span className="auth-icon">🌱</span>
          <h1>Nursery Owner Registration</h1>
          <p>Set up your nursery and start selling plants</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <h3 className="section-title">👤 Account Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Jane Smith" required />
            </div>
            <div className="form-group">
              <label>Username *</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="nurseryowner" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="owner@example.com" required />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="9876543210" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 8 characters" required />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required />
            </div>
          </div>

          <h3 className="section-title" style={{ marginTop: '20px' }}>🌿 Nursery Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Nursery Name *</label>
              <input type="text" name="nurseryName" value={formData.nurseryName} onChange={handleChange} placeholder="Green Valley Nursery" required />
            </div>
            <div className="form-group">
              <label>City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Bangalore" required />
            </div>
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Green Street" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Postal Code</label>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="560001" />
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="nursery@example.com" />
            </div>
          </div>

          <div className="form-group">
            <label>Nursery Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Tell customers about your nursery..."></textarea>
          </div>

          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Registering nursery...' : 'Register as Nursery Owner'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
          <p>Are you a customer? <Link to="/register/customer">Customer Registration</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterNursery;
