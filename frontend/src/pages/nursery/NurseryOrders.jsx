import React, { useState, useEffect } from 'react';
import { getNurseryOrders, updateOrderStatus } from '../../services/orderService';

const STATUS_COLORS = {
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

const NEXT_STATUS = {
  PENDING:    'CONFIRMED',
  CONFIRMED:  'PROCESSING',
  PROCESSING: 'SHIPPED',
  SHIPPED:    'DELIVERED',
};

const NurseryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async (p = 0) => {
    try {
      setLoading(true);
      const res = await getNurseryOrders({ page: p, size: 20, sort: 'createdAt,desc' });
      const data = res?.data;
      setOrders(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(page); }, [page]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      const updated = res?.data;
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div style={{ padding: '2rem' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: '#e2e8f0', borderRadius: 12, height: 80, marginBottom: '1rem', animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  );

  if (error) return (
    <div style={{ padding: '2rem' }}>
      <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: '2rem', color: '#991b1b' }}>
        {error}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#0f172a' }}>📦 Customer Orders</h1>
        <span style={{ background: '#f1f5f9', padding: '0.4rem 1rem', borderRadius: 8, color: '#64748b', fontSize: '0.9rem' }}>
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </span>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: 16, color: '#64748b' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <h3>No orders yet</h3>
          <p>Orders placed by customers will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => {
            const sc = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.PENDING;
            const psc = order.paymentStatus ? PAYMENT_STATUS_COLORS[order.paymentStatus] : null;
            const next = NEXT_STATUS[order.orderStatus];
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id} style={{
                background: 'white', borderRadius: 12, border: '1px solid #e2e8f0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden'
              }}>
                {/* Header Row */}
                <div
                  style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flexWrap: 'wrap' }}
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                      #{order.id.slice(0, 8).toUpperCase()} · {order.customerName}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      {' · '}{(order.items || []).reduce((s, i) => s + i.quantity, 0)} items
                    </div>
                  </div>

                  {/* Order Status Badge */}
                  <span style={{
                    padding: '0.3rem 0.9rem', borderRadius: 9999, fontSize: '0.8rem', fontWeight: 600,
                    backgroundColor: sc.bg, color: sc.color
                  }}>
                    {order.orderStatus}
                  </span>

                  {/* Payment Method + Status */}
                  {order.paymentMethod && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                        {order.paymentMethod}
                      </span>
                      {psc && (
                        <span style={{
                          padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 700,
                          backgroundColor: psc.bg, color: psc.color
                        }}>
                          {order.paymentStatus}
                        </span>
                      )}
                    </div>
                  )}
                  {!order.paymentMethod && (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                      No payment yet
                    </span>
                  )}

                  <div style={{ fontWeight: 700, color: '#2c7a3f', fontSize: '1rem' }}>
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </div>

                  {next && order.orderStatus !== 'CANCELLED' && (
                    <button
                      style={{
                        background: '#2c7a3f', color: 'white', border: 'none',
                        borderRadius: 8, padding: '0.4rem 0.9rem', fontSize: '0.8rem',
                        cursor: 'pointer', fontWeight: 600, transition: 'background 0.2s',
                        opacity: updatingId === order.id ? 0.6 : 1
                      }}
                      disabled={updatingId === order.id}
                      onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order.id, next); }}
                    >
                      {updatingId === order.id ? '...' : `→ Mark ${next}`}
                    </button>
                  )}

                  <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{isExpanded ? '▲' : '▼'}</span>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #f1f5f9', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                      {/* Items */}
                      <div style={{ flex: 2, minWidth: 280 }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', color: '#475569' }}>Items</h4>
                        {(order.items || []).map(item => (
                          <div key={item.id} style={{
                            display: 'flex', justifyContent: 'space-between',
                            padding: '0.5rem 0', borderBottom: '1px solid #f8fafc', fontSize: '0.9rem'
                          }}>
                            <span>{item.plantName} × {item.quantity}</span>
                            <span style={{ color: '#2c7a3f', fontWeight: 600 }}>₹{Number(item.subtotal).toFixed(2)}</span>
                          </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontWeight: 700 }}>
                          <span>Total</span>
                          <span style={{ color: '#2c7a3f' }}>₹{Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Shipping */}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', color: '#475569' }}>Shipping To</h4>
                        <div style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.6 }}>
                          <div><strong>{order.shippingName}</strong></div>
                          {order.shippingPhone && <div>📞 {order.shippingPhone}</div>}
                          <div>📍 {order.shippingAddress}</div>
                          <div>{order.shippingCity}{order.shippingPostalCode ? ` — ${order.shippingPostalCode}` : ''}</div>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div style={{ minWidth: 160 }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', color: '#475569' }}>Payment</h4>
                        {order.paymentMethod ? (
                          <div style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
                            <div>
                              <span style={{ color: '#64748b' }}>Method: </span>
                              <strong>{order.paymentMethod}</strong>
                            </div>
                            {psc && (
                              <div>
                                <span style={{ color: '#64748b' }}>Status: </span>
                                <span style={{
                                  padding: '0.2rem 0.6rem', borderRadius: 9999,
                                  fontSize: '0.75rem', fontWeight: 700,
                                  backgroundColor: psc.bg, color: psc.color
                                }}>
                                  {order.paymentStatus}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                            Awaiting payment
                          </p>
                        )}
                      </div>

                      {/* Status control */}
                      <div style={{ minWidth: 180 }}>
                        <h4 style={{ margin: '0 0 0.75rem 0', color: '#475569' }}>Update Status</h4>
                        <select
                          value=""
                          style={{
                            width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8,
                            border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer'
                          }}
                          disabled={order.orderStatus === 'CANCELLED' || order.orderStatus === 'DELIVERED'}
                          onChange={(e) => {
                            if (e.target.value) handleStatusUpdate(order.id, e.target.value);
                          }}
                        >
                          <option value="">— Set status —</option>
                          {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map(s => (
                            <option key={s} value={s} disabled={s === order.orderStatus}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          <button
            style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer', background: 'white' }}
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >← Prev</button>
          <span style={{ padding: '0.5rem 1rem', color: '#64748b' }}>Page {page + 1} of {totalPages}</span>
          <button
            style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer', background: 'white' }}
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >Next →</button>
        </div>
      )}
    </div>
  );
};

export default NurseryOrders;
