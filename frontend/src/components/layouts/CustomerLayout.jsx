import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CustomerLayout.css';

const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: '🏠' },
    { name: 'Plants', path: '/customer/plants', icon: '🌿' },
    { name: 'Categories', path: '/customer/categories', icon: '📁' },
    { name: 'Orders', path: '/customer/orders', icon: '📦' },
    { name: 'Cart', path: '/customer/cart', icon: '🛒' },
    { name: 'Profile', path: '/customer/profile', icon: '👤' },
    { name: 'AI Diagnosis', path: '/customer/ai-diagnosis', icon: '🤖' }
  ];

  return (
    <div className="customer-layout">
      {/* Top Navigation */}
      <header className="customer-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            ☰
          </button>
          <div className="logo" onClick={() => navigate('/customer/dashboard')}>
            🌿 GoGreen AI
          </div>
        </div>
        <div className="header-right">
          <div className="user-profile">
            <span className="user-name">Hi, {user?.name || user?.username}</span>
          </div>
          <button className="cart-btn" onClick={() => navigate('/customer/cart')}>🛒</button>
        </div>
      </header>

      <div className="customer-body">
        {/* Sidebar */}
        <aside className={`customer-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="icon">{item.icon}</span>
                <span className="text">{item.name}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="customer-main">
          <Outlet />
        </main>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
        )}
      </div>
    </div>
  );
};

export default CustomerLayout;
