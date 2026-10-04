import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPlants } from '../../services/plantService';
import { getCategories } from '../../services/categoryService';
import { PlantCardSkeleton } from '../../components/common/Skeletons';
import './CustomerPages.css';

// Plant Types enum matches backend
const PLANT_TYPES = [
  'INDOOR', 'OUTDOOR', 'SUCCULENT', 'FLOWERING', 'TREE', 
  'SHRUB', 'HERB', 'AQUATIC', 'CLIMBER', 'OTHER'
];

const PlantListing = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  
  // Read from URL parameters
  const searchQuery = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const plantType = searchParams.get('plantType') || '';
  const currentPage = parseInt(searchParams.get('page') || '0', 10);
  
  useEffect(() => {
    // Fetch categories only once
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = {
          page: currentPage,
          size: 12,
        };
        
        if (searchQuery) params.search = searchQuery;
        if (categoryId) params.categoryId = categoryId;
        if (plantType) params.plantType = plantType;
        
        const res = await getPlants(params);
        setPlants(res.data?.content || []);
        setTotalPages(res.data?.totalPages || 0);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Your session has expired. Please login again.");
        } else if (err.response?.status === 403) {
          setError("You do not have permission to access this section.");
        } else {
          setError("Unable to load plants. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    // Simple debounce for search typing
    const timerId = setTimeout(() => {
      fetchPlants();
    }, 300);
    
    return () => clearTimeout(timerId);
  }, [searchQuery, categoryId, plantType, currentPage]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 0 when filters change
    if (key !== 'page') newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => updateParam('search', e.target.value);
  const handleCategoryChange = (e) => updateParam('categoryId', e.target.value);
  const handleTypeChange = (e) => updateParam('plantType', e.target.value);
  
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      updateParam('page', newPage.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
        <h2>All Plants</h2>
      </div>
      
      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search plants..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <select 
          className="filter-select" 
          value={categoryId} 
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        
        <select 
          className="filter-select" 
          value={plantType} 
          onChange={handleTypeChange}
        >
          <option value="">All Plant Types</option>
          {PLANT_TYPES.map(type => (
            <option key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
          ))}
        </select>
        
        {(searchQuery || categoryId || plantType) && (
          <button 
            className="btn-link"
            style={{ color: '#64748b' }}
            onClick={() => setSearchParams(new URLSearchParams())}
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="plant-grid">
          {[1,2,3,4,5,6,7,8].map(i => <PlantCardSkeleton key={i} />)}
        </div>
      ) : plants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', backgroundColor: 'white', borderRadius: '12px' }}>
          <p style={{ fontSize: '1.2rem' }}>No plants found matching your criteria.</p>
          <button className="btn-outline" style={{ width: 'auto', marginTop: '1rem' }} onClick={() => setSearchParams(new URLSearchParams())}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="plant-grid">
            {plants.map(plant => (
              <div key={plant.id} className="plant-card">
                <div className="plant-img-container">
                  {plant.imageUrl ? (
                    <img src={plant.imageUrl} alt={plant.name} className="plant-img" />
                  ) : (
                    <div className="plant-placeholder">🌿</div>
                  )}
                </div>
                <div className="plant-info">
                  <span className="plant-category">{plant.categoryName || plant.plantType}</span>
                  <h3>{plant.name}</h3>
                  <p className="details-scientific" style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                    {plant.scientificName}
                  </p>
                  <p className="plant-price">₹{plant.price}</p>
                  
                  <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {plant.stock > 5 ? (
                      <span style={{ color: '#166534' }}>In Stock ({plant.stock})</span>
                    ) : plant.stock > 0 ? (
                      <span style={{ color: '#854d0e' }}>Only {plant.stock} left</span>
                    ) : (
                      <span style={{ color: '#991b1b' }}>Out of Stock</span>
                    )}
                  </div>
                  
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
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn" 
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  className={`page-btn ${currentPage === i ? 'active' : ''}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                className="page-btn" 
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlantListing;
