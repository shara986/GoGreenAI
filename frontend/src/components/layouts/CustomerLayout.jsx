import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './CustomerLayout.css';

const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
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
          <button className="cart-btn" onClick={() => navigate('/customer/cart')}>
            🛒
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </button>
        </div>
      </header>

      <div className="customer-body">
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
                {item.path === '/customer/cart' && cartCount > 0 && (
                  <span className="sidebar-cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </aside>

        <main className="customer-main">
          <Outlet />
        </main>

        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
        )}
      </div>
    </div>
  );
};

export default CustomerLayout;
