import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../../services/orderService';
import './CustomerPages.css';
import './CartCheckoutOrders.css';
import './Payment.css';

const PAYMENT_STATUS_CONFIG = {
  SUCCESS:  { bg: '#dcfce7', color: '#166534', label: '✓ SUCCESS' },
  PENDING:  { bg: '#fef3c7', color: '#92400e', label: '⏳ PENDING' },
  FAILED:   { bg: '#fee2e2', color: '#991b1b', label: '✕ FAILED' },
};

const ORDER_STATUS_CONFIG = {
  PENDING:    { bg: '#fef3c7', color: '#92400e' },
  CONFIRMED:  { bg: '#dbeafe', color: '#1e40af' },
  PROCESSING: { bg: '#e0e7ff', color: '#4338ca' },
  SHIPPED:    { bg: '#d1fae5', color: '#065f46' },
  DELIVERED:  { bg: '#dcfce7', color: '#166534' },
  CANCELLED:  { bg: '#fee2e2', color: '#991b1b' },
};

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res?.data);
      } catch (err) {
        setError(err.message || 'Failed to load order.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [orderId]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="cart-skeleton">
          {[1, 2, 3].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="page-container">
        <div className="error-container">
          <p className="error-msg">{error || 'Order not found.'}</p>
          <button className="btn-primary" onClick={() => navigate('/customer/orders')}>
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  const osc = ORDER_STATUS_CONFIG[order.orderStatus] || ORDER_STATUS_CONFIG.PENDING;
  const psc = order.paymentStatus
    ? PAYMENT_STATUS_CONFIG[order.paymentStatus]
    : null;
  const isCOD = order.paymentMethod === 'COD';

  return (
    <div className="page-container">
      {/* ── Success Header ── */}
      <div className="order-success-hero">
        <div className="order-success-checkmark">✓</div>
        <h1 className="order-success-title">Order Placed Successfully!</h1>
        <p className="order-success-subtitle">
          {isCOD
            ? 'Your Cash on Delivery order is confirmed. Pay when your plants arrive!'
            : 'Thank you for your purchase! Your plants are on their way.'}
        </p>
      </div>

      <div className="checkout-layout" style={{ marginTop: '2rem' }}>
        {/* ── Items & Summary ── */}
        <div className="order-items-section">
          <h2 className="checkout-section-title">Items Ordered</h2>
          {(order.items || []).map(item => (
            <div key={item.id} className="order-item-row">
              <div className="cart-item-image">
                {item.plantImageUrl
                  ? <img src={item.plantImageUrl} alt={item.plantName} />
                  : <div className="cart-img-placeholder">🌿</div>
                }
              </div>
              <div className="order-item-info">
                <div className="cart-item-name">{item.plantName}</div>
                <div className="order-price-line">
                  ₹{Number(item.priceAtPurchase).toFixed(2)} × {item.quantity}
                </div>
              </div>
              <div className="order-item-subtotal">₹{Number(item.subtotal).toFixed(2)}</div>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row">
            <span>Delivery</span>
            <span className="free-tag">FREE</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total Amount</span>
            <span>₹{Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        {/* ── Order Info Sidebar ── */}
        <div className="order-sidebar">
          {/* Order Details Box */}
          <div className="order-sidebar-box" style={{ marginBottom: '1rem' }}>
            <h3>Order Details</h3>
            <div className="success-detail-row">
              <span className="success-detail-label">Order ID</span>
              <span className="success-detail-value">#{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">Date</span>
              <span className="success-detail-value">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
            </div>
            <div className="success-detail-row">
              <span className="success-detail-label">Order Status</span>
              <span
                className="status-badge"
                style={{ backgroundColor: osc.bg, color: osc.color, fontSize: '0.78rem' }}
              >
                {order.orderStatus}
              </span>
            </div>
            {order.paymentMethod && (
              <div className="success-detail-row">
                <span className="success-detail-label">Payment Method</span>
                <span className="success-detail-value">{order.paymentMethod}</span>
              </div>
            )}
            {psc && (
              <div className="success-detail-row">
                <span className="success-detail-label">Payment Status</span>
                <span
                  className="status-badge"
                  style={{ backgroundColor: psc.bg, color: psc.color, fontSize: '0.78rem' }}
                >
                  {psc.label}
                </span>
              </div>
            )}
          </div>

          {/* Shipping Box */}
          <div className="order-sidebar-box" style={{ marginBottom: '1rem' }}>
            <h3>Shipping Address</h3>
            <div className="shipping-info">
              <p><strong>{order.shippingName}</strong></p>
              {order.shippingPhone && <p>📞 {order.shippingPhone}</p>}
              <p>📍 {order.shippingAddress}</p>
              <p>{order.shippingCity}{order.shippingPostalCode ? ` — ${order.shippingPostalCode}` : ''}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            id="view-orders-btn"
            className="btn-primary"
            style={{ width: '100%', marginBottom: '0.75rem' }}
            onClick={() => navigate('/customer/orders')}
          >
            📦 View My Orders
          </button>
          <button
            id="continue-shopping-btn"
            className="btn-outline"
            style={{ width: '100%' }}
            onClick={() => navigate('/customer/plants')}
          >
            🌿 Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
