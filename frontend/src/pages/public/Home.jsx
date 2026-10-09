import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../nursery/NurseryPages.css';

const Home = () => {
  const { isAuthenticated, isNurseryOwner, isCustomer, isAdmin, getDashboardPath } = useAuth();

  return (
    <div>
      <section style={{ 
        padding: '6rem 2rem', 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #f4f7f6 100%)',
        borderRadius: '24px',
        margin: '2rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 10px 30px rgba(46, 125, 50, 0.05)'
      }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', color: '#1a4331' }}>
          🌿 GoGreen <span className="highlight">AI</span>
        </h1>
        <p style={{ fontSize: '1.4rem', color: '#4a5568', marginBottom: '2.5rem', maxWidth: '700px', lineHeight: '1.6' }}>
          Your intelligent ecosystem for buying, selling, and caring for plants. Empowered by AI to help you cultivate the perfect green space.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {isAuthenticated ? (
            <>
              {isNurseryOwner && (
                <Link to="/nursery/dashboard" className="btn-register-main" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '1.1rem' }}>
                  🏡 Manage My Nursery
                </Link>
              )}
              {isCustomer && (
                <Link to="/customer/plants" className="btn-register-main" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '1.1rem' }}>
                  🪴 Start Shopping Plants
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin/dashboard" className="btn-register-main" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '1.1rem' }}>
                  📊 Admin Dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/register/customer" className="btn-register-main" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '1.1rem' }}>
                🪴 Explore Plants
              </Link>
              <Link to="/register/nursery" className="btn-login" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '1.1rem' }}>
                🌱 Register Your Nursery
              </Link>
            </>
          )}

          <Link to="/about" className="btn-login" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '1.1rem', background: '#fff' }}>
            Learn More
          </Link>
        </div>
      </section>

      <section style={{ padding: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#1a4331' }}>Why Choose GoGreen AI?</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪴</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Curated Plant Selection</h3>
            <p style={{ color: '#666' }}>Browse thousands of healthy, beautiful plants directly from verified top-tier nurseries across the country.</p>
          </div>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>AI Plant Diagnosis</h3>
            <p style={{ color: '#666' }}>Not sure what's wrong with your plant? Upload a photo and our advanced AI will instantly diagnose diseases and suggest remedies.</p>
          </div>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚚</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Direct from Nurseries</h3>
            <p style={{ color: '#666' }}>We connect you directly with nursery owners. Better prices for you, better margins for them, and fresher plants all around.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
