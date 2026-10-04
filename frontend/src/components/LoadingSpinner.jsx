import React from 'react';

const LoadingSpinner = ({ text = "Loading GoGreen AI..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '1.25rem',
      color: '#1b4332',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div className="spinner" style={{
        width: '48px',
        height: '48px',
        border: '4px solid #d8f3dc',
        borderTop: '4px solid #2d6a4f',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{text}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
