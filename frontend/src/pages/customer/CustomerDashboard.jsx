import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPlants } from '../../services/plantService';
import { getCategories } from '../../services/categoryService';
import { DashboardSkeleton } from '../../components/common/Skeletons';
import './CustomerPages.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ totalPlants: 'N/A', totalCategories: 'N/A' });
  const [recentPlants, setRecentPlants] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [plantsRes, categoriesRes] = await Promise.all([
          getPlants({ size: 4 }), // Fetch first 4 plants
          getCategories()
        ]);
        
        setRecentPlants(plantsRes.data?.content || []);
        setCategories(categoriesRes.data?.slice(0, 4) || []); // First 4 categories
        setStats({
          totalPlants: plantsRes.data?.totalElements ?? 'N/A',
          totalCategories: categoriesRes.data?.length ?? 'N/A'
        });
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Your session has expired. Please login again.");
        } else if (err.response?.status === 403) {
          setError("You do not have permission to access this section.");
        } else {
          setError("Unable to load dashboard data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="error-container">
        <p className="error-msg">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="welcome-banner">
        <h1>Welcome to GoGreen AI 🌿</h1>
        <p>Explore a variety of plants to bring nature into your life.</p>
        <div className="search-quick-action">
          <input 
            type="text" 
            placeholder="Search for a plant..." 
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                navigate(`/customer/plants?search=${e.target.value}`);
              }
            }}
          />
          <button className="btn-primary" onClick={() => navigate('/customer/plants')}>Browse All Plants</button>
          <button className="btn-nearby-nurseries" style={{ marginLeft: '10px', backgroundColor: '#1b4d24', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }} onClick={() => navigate('/customer/nearby-nurseries')}>📍 Nearby Nurseries</button>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Plants Available</h3>
          <p className="stat-value">{stats.totalPlants}</p>
        </div>
        <div className="stat-card">
          <h3>Plant Categories</h3>
          <p className="stat-value">{stats.totalCategories}</p>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Popular Categories</h2>
          <button className="btn-link" onClick={() => navigate('/customer/categories')}>View All</button>
        </div>
        {categories.length === 0 ? (
          <p>No categories are currently available.</p>
        ) : (
          <div className="category-grid">
            {categories.map(category => (
              <div 
                key={category.id} 
                className="category-card"
                onClick={() => navigate(`/customer/plants?categoryId=${category.id}`)}
              >
                <div className="category-img-container">
                   {category.imageUrl ? (
                     <img src={category.imageUrl} alt={category.name} className="category-img" />
                   ) : (
                     <div className="category-placeholder">📁</div>
                   )}
                </div>
                <h4>{category.name}</h4>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recently Added Plants</h2>
          <button className="btn-link" onClick={() => navigate('/customer/plants')}>View All</button>
        </div>
        {recentPlants.length === 0 ? (
          <p>No plants are currently available.</p>
        ) : (
          <div className="plant-grid">
            {recentPlants.map(plant => (
              <div key={plant.id} className="plant-card">
                <div className="plant-img-container">
                  {plant.imageUrl ? (
                    <img src={plant.imageUrl} alt={plant.name} className="plant-img" />
                  ) : (
                    <div className="plant-placeholder">🌿</div>
                  )}
                </div>
                <div className="plant-info">
                  <span className="plant-category">{plant.categoryName}</span>
                  <h3>{plant.name}</h3>
                  <p className="plant-price">₹{plant.price}</p>
                  <button 
                    className="btn-outline"
                    onClick={() => navigate(`/customer/plants/${plant.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerDashboard;
