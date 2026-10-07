import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlantById } from '../../services/plantService';
import { addToCart } from '../../services/cartService';
import { useCart } from '../../context/CartContext';
import { DashboardSkeleton } from '../../components/common/Skeletons';
import './CustomerPages.css';

const PlantDetails = () => {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plant, setPlant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(null); // { type: 'success'|'error', msg }

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        setLoading(true);
        const res = await getPlantById(plantId);
        setPlant(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Plant not found.');
        } else {
          setError('Unable to load plant details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPlant();
  }, [plantId]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setCartFeedback(null);
    try {
      await addToCart(plantId, quantity);
      refreshCart();
      setCartFeedback({ type: 'success', msg: `${plant.name} added to cart!` });
      setTimeout(() => setCartFeedback(null), 3000);
    } catch (err) {
      setCartFeedback({ type: 'error', msg: err.message || 'Failed to add to cart.' });
    } finally {
      setAddingToCart(false);
    }
  };

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

  const outOfStock = plant.stock === 0 || !plant.active;

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

          <div className="details-price">₹{Number(plant.price).toFixed(2)}</div>

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

          {/* Quantity selector */}
          {!outOfStock && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 600, color: '#4a5568' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  style={{ width: 36, height: 36, borderRadius: 6, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '1.1rem' }}
                >−</button>
                <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(q => Math.min(plant.stock, q + 1))}
                  disabled={quantity >= plant.stock}
                  style={{ width: 36, height: 36, borderRadius: 6, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '1.1rem' }}
                >+</button>
              </div>
              {plant.stock <= 5 && (
                <span style={{ fontSize: '0.85rem', color: '#b45309' }}>Only {plant.stock} available</span>
              )}
            </div>
          )}

          {/* Feedback message */}
          {cartFeedback && (
            <div
              className={cartFeedback.type === 'success' ? 'stock-badge stock-in' : 'stock-badge stock-out'}
              style={{ marginBottom: '1rem', display: 'block', textAlign: 'center' }}
            >
              {cartFeedback.msg}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className="btn-primary add-to-cart-btn"
              disabled={outOfStock || addingToCart}
              onClick={handleAddToCart}
              style={{ flex: 1 }}
            >
              {addingToCart ? 'Adding...' : outOfStock ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>
            {!outOfStock && (
              <button
                className="btn-outline"
                style={{ flex: 1 }}
                onClick={() => {
                  handleAddToCart().then(() => navigate('/customer/cart'));
                }}
                disabled={outOfStock || addingToCart}
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
