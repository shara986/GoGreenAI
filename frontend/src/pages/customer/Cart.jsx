import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../../services/cartService';
import { useCart } from '../../context/CartContext';
import './CustomerPages.css';
import './CartCheckoutOrders.css';

const Cart = () => {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCart();
      setCart(res?.data || { items: [], totalItems: 0, totalAmount: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load cart.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    setUpdatingId(itemId);
    try {
      const res = await updateCartItem(itemId, newQty);
      setCart(res?.data);
      refreshCart();
    } catch (err) {
      alert(err.message || 'Failed to update quantity.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setUpdatingId(itemId);
    try {
      const res = await removeCartItem(itemId);
      setCart(res?.data);
      refreshCart();
    } catch (err) {
      alert(err.message || 'Failed to remove item.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Clear all items from your cart?')) return;
    try {
      await clearCart();
      setCart({ items: [], totalItems: 0, totalAmount: 0 });
      refreshCart();
    } catch (err) {
      alert(err.message || 'Failed to clear cart.');
    }
  };

  if (loading) return (
    <div className="page-container">
      <div className="cart-skeleton">
        {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="page-container">
      <div className="error-container"><p className="error-msg">{error}</p></div>
    </div>
  );

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Explore our plants and find something green for your space.</p>
          <button className="btn-primary" onClick={() => navigate('/customer/plants')}>
            Browse Plants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="section-header">
        <h1 className="page-title">🛒 My Cart</h1>
        <button className="btn-danger-outline" onClick={handleClearCart}>Clear Cart</button>
      </div>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items-section">
          {items.map(item => (
            <div key={item.id} className={`cart-card ${updatingId === item.id ? 'cart-card-updating' : ''}`}>
              <div className="cart-item-image">
                {item.imageUrl
                  ? <img src={item.imageUrl} alt={item.plantName} />
                  : <div className="cart-img-placeholder">🌿</div>
                }
              </div>
              <div className="cart-item-info">
                <h3 className="cart-item-name">{item.plantName}</h3>
                <div className="cart-item-price">₹{Number(item.price).toFixed(2)}</div>
                {item.stock <= 5 && item.stock > 0 && (
                  <div className="stock-warning">⚠ Only {item.stock} available</div>
                )}
                {!item.active && (
                  <div className="stock-warning" style={{ color: '#991b1b' }}>⚠ This item is no longer available</div>
                )}
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || updatingId === item.id}
                  >−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock || updatingId === item.id}
                  >+</button>
                </div>
                <div className="cart-item-subtotal">₹{Number(item.subtotal).toFixed(2)}</div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item.id)}
                  disabled={updatingId === item.id}
                  title="Remove item"
                >✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="cart-summary-box">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items ({cart.totalItems})</span>
            <span>₹{Number(cart.totalAmount).toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className="free-tag">FREE</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{Number(cart.totalAmount).toFixed(2)}</span>
          </div>
          <button
            className="btn-primary checkout-btn"
            onClick={() => navigate('/customer/checkout')}
          >
            Proceed to Checkout →
          </button>
          <button
            className="btn-link"
            style={{ display: 'block', marginTop: '1rem', textAlign: 'center', width: '100%' }}
            onClick={() => navigate('/customer/plants')}
          >
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
