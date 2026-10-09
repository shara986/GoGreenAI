import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './NurseryOwnerLayout.css';

const NurseryOwnerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="nursery-layout">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'show' : ''}`} 
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside className={`nursery-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span>GoGreen AI</span>
          <button className="close-sidebar-btn" onClick={closeSidebar}>×</button>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/nursery/dashboard" className="sidebar-nav-link" onClick={closeSidebar}>
            Dashboard
          </NavLink>
          <NavLink to="/nursery/profile" className="sidebar-nav-link" onClick={closeSidebar}>
            My Nursery Profile
          </NavLink>
          <NavLink to="/nursery/plants" className="sidebar-nav-link" onClick={closeSidebar}>
            Plants
          </NavLink>
          <NavLink to="/nursery/inventory" className="sidebar-nav-link" onClick={closeSidebar}>
            Inventory
          </NavLink>
          <NavLink to="/nursery/orders" className="sidebar-nav-link" onClick={closeSidebar}>
            Orders
          </NavLink>
          <NavLink to="/nursery/sales" className="sidebar-nav-link" onClick={closeSidebar}>
            Sales
          </NavLink>
          <button 
            onClick={handleLogout} 
            className="sidebar-nav-link" 
            style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer', color: '#ffb7b7' }}
          >
            Logout
          </button>
        </nav>

        <div className="sidebar-footer">
          <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>Nursery Management</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="nursery-main-content">
        {/* Top Navbar */}
        <header className="nursery-topbar">
          <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button className="mobile-toggle-btn" onClick={toggleSidebar}>
              ☰
            </button>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a4331' }}>GoGreen AI</span>
          </div>
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span className="owner-name" style={{ fontWeight: 600, color: '#1a4331', background: '#e8f5e9', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem' }}>
              🌱 {user?.name || user?.username || 'Owner'}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="nursery-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default NurseryOwnerLayout;
