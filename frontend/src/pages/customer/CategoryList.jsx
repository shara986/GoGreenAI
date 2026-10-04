import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../services/categoryService';
import { CategoryCardSkeleton } from '../../components/common/Skeletons';
import './CustomerPages.css';

const CategoryList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await getCategories();
        setCategories(res.data || []);
      } catch (err) {
        setError("Unable to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (error) {
    return (
      <div className="page-container" style={{ padding: '2rem' }}>
        <div className="error-container">
          <p className="error-msg">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-header" style={{ marginTop: '1rem' }}>
        <h2>Plant Categories</h2>
        <p style={{ color: '#64748b' }}>Browse our plants by category</p>
      </div>

      {loading ? (
        <div className="category-grid">
          {[1, 2, 3, 4, 5, 6].map(i => <CategoryCardSkeleton key={i} />)}
        </div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', backgroundColor: 'white', borderRadius: '12px' }}>
          <p style={{ fontSize: '1.2rem' }}>No categories are currently available.</p>
        </div>
      ) : (
        <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {categories.map(category => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => navigate(`/customer/plants?categoryId=${category.id}`)}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div className="category-img-container" style={{ width: '120px', height: '120px' }}>
                 {category.imageUrl ? (
                   <img src={category.imageUrl} alt={category.name} className="category-img" />
                 ) : (
                   <div className="category-placeholder">📁</div>
                 )}
              </div>
              <h4>{category.name}</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', flex: 1 }}>
                {category.description || 'No description available.'}
              </p>
              <button 
                className="btn-outline" 
                style={{ marginTop: '1rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/customer/plants?categoryId=${category.id}`);
                }}
              >
                Browse Plants
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
