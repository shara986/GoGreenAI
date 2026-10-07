import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../../services/orderService';
import './CustomerPages.css';
import './CartCheckoutOrders.css';

const STATUS_COLORS = {
  PENDING:    { bg: '#fef3c7', color: '#92400e' },
  CONFIRMED:  { bg: '#dbeafe', color: '#1e40af' },
  PROCESSING: { bg: '#e0e7ff', color: '#4338ca' },
  SHIPPED:    { bg: '#d1fae5', color: '#065f46' },
  DELIVERED:  { bg: '#dcfce7', color: '#166534' },
  CANCELLED:  { bg: '#fee2e2', color: '#991b1b' },
};

const PAYMENT_STATUS_COLORS = {
  SUCCESS: { bg: '#dcfce7', color: '#166534', label: '✓ SUCCESS' },
  PENDING: { bg: '#fef3c7', color: '#92400e', label: '⏳ PENDING' },
  FAILED:  { bg: '#fee2e2', color: '#991b1b', label: '✕ FAILED' },
};

const CANCELLABLE = ['PENDING', 'CONFIRMED'];

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res?.data);
      } catch (err) {
        if (err.message?.includes('404') || err.message?.includes('not found')) {
          setError('Order not found.');
        } else {
          setError(err.message || 'Failed to load order.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [orderId]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await cancelOrder(orderId);
      setOrder(res?.data);
    } catch (err) {
      alert(err.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return (
    <div className="page-container">
      <div className="cart-skeleton">{[1, 2].map(i => <div key={i} className="skeleton-card" />)}</div>
    </div>
  );

  if (error) return (
    <div className="page-container">
      <div className="error-container">
        <p className="error-msg">{error}</p>
        <button className="btn-primary" onClick={() => navigate('/customer/orders')}>Back to Orders</button>
      </div>
    </div>
  );

  if (!order) return null;

  const sc = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.PENDING;
  const psc = order.paymentStatus ? PAYMENT_STATUS_COLORS[order.paymentStatus] : null;
  const canCancel = CANCELLABLE.includes(order.orderStatus);
  const needsPayment = order.orderStatus === 'PENDING' && !order.paymentStatus;

  return (
    <div className="page-container">
      <button className="btn-link" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/customer/orders')}>
        ← Back to Orders
      </button>

      <div className="order-detail-header">
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <div className="order-date">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <span className="status-badge status-badge-lg" style={{ backgroundColor: sc.bg, color: sc.color }}>
            {order.orderStatus}
          </span>
          {psc && (
            <span className="status-badge" style={{ backgroundColor: psc.bg, color: psc.color }}>
              💳 {order.paymentMethod} · {psc.label}
            </span>
          )}
          {!psc && order.orderStatus === 'PENDING' && (
            <span className="status-badge" style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.78rem' }}>
              ⏳ Awaiting Payment
            </span>
          )}
        </div>
      </div>

      <div className="order-detail-layout">
        {/* Items */}
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
              <div className="order-item-subtotal">
                ₹{Number(item.subtotal).toFixed(2)}
              </div>
            </div>
          ))}

          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Order Total</span>
            <span>₹{Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="order-sidebar">
          {/* Payment Info */}
          {order.paymentMethod && (
            <div className="order-sidebar-box" style={{ marginBottom: '1rem' }}>
              <h3>Payment Info</h3>
              <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Method</span>
                  <strong>{order.paymentMethod}</strong>
                </div>
                {psc && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Status</span>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: psc.bg, color: psc.color, fontSize: '0.75rem' }}
                    >
                      {psc.label}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Shipping */}
          <div className="order-sidebar-box">
            <h3>Shipping Details</h3>
            <div className="shipping-info">
              <p><strong>{order.shippingName}</strong></p>
              {order.shippingPhone && <p>📞 {order.shippingPhone}</p>}
              <p>📍 {order.shippingAddress}</p>
              <p>{order.shippingCity}{order.shippingPostalCode ? ` — ${order.shippingPostalCode}` : ''}</p>
            </div>
          </div>

          {/* Pay Now button for unpaid PENDING orders */}
          {needsPayment && (
            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => navigate('/customer/payment', { state: { orderId: order.id } })}
            >
              💳 Pay Now
            </button>
          )}

          {canCancel && (
            <button
              className="btn-danger-outline"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : '✕ Cancel Order'}
            </button>
          )}

          <button
            className="btn-outline"
            style={{ width: '100%', marginTop: '0.75rem' }}
            onClick={() => navigate('/customer/plants')}
          >
            🌿 Shop More Plants
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
