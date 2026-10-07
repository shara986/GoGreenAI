import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../../services/cartService';
import { placeOrder } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './CustomerPages.css';
import './CartCheckoutOrders.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshCart } = useCart();

  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    shippingName: '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
  });

  useEffect(() => {
    // Pre-fill from user profile
    setForm(prev => ({
      ...prev,
      shippingName: user?.name || '',
      shippingPhone: user?.phoneNumber || '',
    }));
  }, [user]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCart();
        const cartData = res?.data;
        if (!cartData || !cartData.items || cartData.items.length === 0) {
          navigate('/customer/cart');
          return;
        }
        setCart(cartData);
      } catch {
        navigate('/customer/cart');
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, [navigate]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await placeOrder(form);
      const order = res?.data;
      refreshCart();
      // Navigate to payment page — cart cleared, order created with PENDING status
      navigate('/customer/payment', { state: { orderId: order.id } });
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCart) return (
    <div className="page-container">
      <div className="cart-skeleton">
        {[1, 2].map(i => <div key={i} className="skeleton-card" />)}
      </div>
    </div>
  );

  if (!cart) return null;

  return (
    <div className="page-container">
      <button className="btn-link" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/customer/cart')}>
        ← Back to Cart
      </button>
      <h1 className="page-title">Checkout</h1>

      {error && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <div className="checkout-layout">
        {/* Shipping Form */}
        <div className="checkout-form-section">
          <h2 className="checkout-section-title">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="shippingName"
                  value={form.shippingName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="shippingPhone"
                  value={form.shippingPhone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Address *</label>
              <input
                type="text"
                name="shippingAddress"
                value={form.shippingAddress}
                onChange={handleChange}
                placeholder="Street address, building, flat number"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="shippingCity"
                  value={form.shippingCity}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="shippingPostalCode"
                  value={form.shippingPostalCode}
                  onChange={handleChange}
                  placeholder="PIN code"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary checkout-btn"
              disabled={submitting}
            >
              {submitting ? 'Processing...' : '→ Proceed to Payment'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="cart-summary-box">
          <h3>Order Summary</h3>
          <div className="checkout-items-list">
            {cart.items.map(item => (
              <div key={item.id} className="checkout-item-row">
                <div className="checkout-item-name">
                  <span>{item.plantName}</span>
                  <span className="checkout-qty"> × {item.quantity}</span>
                </div>
                <span>₹{Number(item.subtotal).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-row">
            <span>Delivery</span>
            <span className="free-tag">FREE</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{Number(cart.totalAmount).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
