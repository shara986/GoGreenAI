import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../../services/orderService';
import './CustomerPages.css';
import './CartCheckoutOrders.css';

const ORDER_STATUS_COLORS = {
  PENDING:    { bg: '#fef3c7', color: '#92400e' },
  CONFIRMED:  { bg: '#dbeafe', color: '#1e40af' },
  PROCESSING: { bg: '#e0e7ff', color: '#4338ca' },
  SHIPPED:    { bg: '#d1fae5', color: '#065f46' },
  DELIVERED:  { bg: '#dcfce7', color: '#166534' },
  CANCELLED:  { bg: '#fee2e2', color: '#991b1b' },
};

const PAYMENT_STATUS_COLORS = {
  SUCCESS: { bg: '#dcfce7', color: '#166534' },
  PENDING: { bg: '#fef3c7', color: '#92400e' },
  FAILED:  { bg: '#fee2e2', color: '#991b1b' },
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getMyOrders({ page, size: 10 });
        const data = res?.data;
        setOrders(data?.content || []);
        setTotalPages(data?.totalPages || 0);
      } catch (err) {
        setError(err.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page]);

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

  if (orders.length === 0) return (
    <div className="page-container">
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <h2>No orders yet</h2>
        <p>Once you place your first order, it will appear here.</p>
        <button className="btn-primary" onClick={() => navigate('/customer/plants')}>Browse Plants</button>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <h1 className="page-title">📦 My Orders</h1>

      <div className="orders-list">
        {orders.map(order => {
          const osc = ORDER_STATUS_COLORS[order.orderStatus] || ORDER_STATUS_COLORS.PENDING;
          const psc = order.paymentStatus
            ? PAYMENT_STATUS_COLORS[order.paymentStatus]
            : null;

          // If order is PENDING and has no successful payment, show Pay Now button
          const needsPayment = order.orderStatus === 'PENDING' && !order.paymentStatus;

          return (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <div className="order-id">Order #{order.id.slice(0, 8).toUpperCase()}</div>
                  <div className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: osc.bg, color: osc.color }}
                  >
                    {order.orderStatus}
                  </span>
                  {psc && (
                    <span
                      className="status-badge"
                      style={{ backgroundColor: psc.bg, color: psc.color, fontSize: '0.75rem' }}
                    >
                      💳 {order.paymentMethod} · {order.paymentStatus}
                    </span>
                  )}
                  {!psc && order.orderStatus === 'PENDING' && (
                    <span
                      className="status-badge"
                      style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '0.75rem' }}
                    >
                      ⏳ Payment Pending
                    </span>
                  )}
                </div>
              </div>

              <div className="order-card-body">
                <div className="order-items-preview">
                  {(order.items || []).slice(0, 3).map(item => (
                    <span key={item.id} className="order-item-chip">
                      {item.plantName} × {item.quantity}
                    </span>
                  ))}
                  {(order.items || []).length > 3 && (
                    <span className="order-item-chip order-item-more">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>
                <div className="order-total-row">
                  <span>{(order.items || []).reduce((s, i) => s + i.quantity, 0)} item(s)</span>
                  <span className="order-amount">₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>

              <div className="order-card-footer">
                {needsPayment && (
                  <button
                    className="btn-primary"
                    style={{ width: 'auto', marginRight: '0.75rem', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
                    onClick={() => navigate('/customer/payment', { state: { orderId: order.id } })}
                  >
                    💳 Pay Now
                  </button>
                )}
                <button
                  className="btn-outline"
                  style={{ width: 'auto' }}
                  onClick={() => navigate(`/customer/orders/${order.id}`)}
                >
                  View Details →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: '2rem' }}>
          <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ padding: '0.5rem 1rem' }}>Page {page + 1} of {totalPages}</span>
          <button className="page-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
};

export default Orders;
