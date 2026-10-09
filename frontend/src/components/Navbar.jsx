import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'Admin';
      case 'ROLE_NURSERY_OWNER': return 'Nursery Owner';
      case 'ROLE_CUSTOMER': return 'Customer';
      default: return '';
    }
  };

  return (
    <nav className="gogreen-navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">🌿</span>
          <span className="brand-text">GoGreen <span className="highlight">AI</span></span>
        </Link>

        {/* Mobile menu toggle button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'nav-links-mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/catalog" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Explore Plants</Link>
          <Link to="/nearby-nurseries" className="nav-link" onClick={() => setMobileMenuOpen(false)}>📍 Nearby Nurseries</Link>
          <Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>

          {isAuthenticated ? (
            <>
              <Link to={getDashboardPath()} className="nav-link dashboard-link">
                📊 Dashboard
              </Link>
              <div className="user-profile-badge">
                <span className="user-name">{user?.name || user?.username}</span>
                <span className={`role-badge ${user?.role?.toLowerCase()}`}>
                  {getRoleLabel(user?.role)}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>

              {/* Click-based dropdown */}
              <div className="register-dropdown" ref={dropdownRef}>
                <button
                  className="btn-register-main"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  Register {dropdownOpen ? '▲' : '▼'}
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu dropdown-menu-open">
                    <Link
                      to="/register/customer"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      🪴 Customer Registration
                    </Link>
                    <Link
                      to="/register/nursery"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      🌱 Nursery Owner Registration
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
