import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import './Auth.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing verification token.');
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setSuccess('Your email address has been verified successfully!');
      } catch (err) {
        setError(err.message || 'Email verification failed or link has expired.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">✉️</span>
          <h1>Email Verification</h1>
          <p>Verifying your GoGreen AI account</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            <span style={{ fontSize: '1.5rem' }}>⏳</span>
            <p>Verifying your token...</p>
          </div>
        )}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        <div className="auth-footer" style={{ marginTop: '20px' }}>
          {!loading && (
            <Link to="/login" className="auth-btn" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
              Proceed to Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
