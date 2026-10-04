import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlantById } from '../../services/plantService';
import { DashboardSkeleton } from '../../components/common/Skeletons';
import './CustomerPages.css';

const PlantDetails = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        setLoading(true);
        const res = await getPlantById(plantId);
        setPlant(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Plant not found.");
        } else {
          setError("Unable to load plant details. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPlant();
  }, [plantId]);

  if (loading) return <div className="page-container"><DashboardSkeleton /></div>;

  if (error) {
    return (
      <div className="page-container" style={{ padding: '2rem' }}>
        <div className="error-container">
          <p className="error-msg">{error}</p>
          <button onClick={() => navigate('/customer/plants')} className="btn-primary">Back to Plants</button>
        </div>
      </div>
    );
  }

  if (!plant) return null;

  const stockStatus = 
    plant.stock > 5 ? { text: 'In Stock', class: 'stock-in' } :
    plant.stock > 0 ? { text: `Only ${plant.stock} left`, class: 'stock-low' } :
    { text: 'Out of Stock', class: 'stock-out' };

  return (
    <div className="page-container">
      <button 
        className="btn-link" 
        style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      
      <div className="plant-details-container">
        <div className="details-image-section">
          {plant.imageUrl ? (
            <img src={plant.imageUrl} alt={plant.name} className="details-image" />
          ) : (
            <div className="details-image" style={{ backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>
              🌿
            </div>
          )}
        </div>
        
        <div className="details-info-section">
          <div className="details-category">{plant.categoryName} • {plant.plantType}</div>
          <h1 className="details-title">{plant.name}</h1>
          <h3 className="details-scientific">{plant.scientificName}</h3>
          
          <div className="details-price">₹{plant.price}</div>
          
          <div className={`stock-badge ${stockStatus.class}`}>
            {stockStatus.text}
          </div>
          
          <div className="details-description">
            <p><strong>Description:</strong></p>
            <p>{plant.description || 'No description available for this plant.'}</p>
            <p><strong>Care Instructions:</strong></p>
            <p>{plant.careInstructions || 'No specific care instructions provided.'}</p>
          </div>
          
          <div className="details-meta">
            <div className="meta-item">
              <span className="meta-label">Nursery</span>
              <span className="meta-value">{plant.nurseryName || 'GoGreen AI Main Nursery'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Stock</span>
              <span className="meta-value">{plant.stock} units</span>
            </div>
          </div>
          
          <button 
            className="btn-primary add-to-cart-btn"
            disabled={plant.stock === 0}
            onClick={() => alert("Cart functionality will be available soon!")}
          >
            {plant.stock === 0 ? 'Out of Stock' : 'Add to Cart (Coming Soon)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
