import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOrderById } from '../../services/orderService';
import { createPayment } from '../../services/paymentService';
import './CustomerPages.css';
import './CartCheckoutOrders.css';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // orderId is passed via navigation state from Checkout
  const orderId = location.state?.orderId;

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [step, setStep] = useState('select'); // 'select' | 'upi_screen' | 'processing' | 'success' | 'failed'
  const [error, setError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  // If no orderId in navigation state, redirect to orders
  useEffect(() => {
    if (!orderId) {
      navigate('/customer/orders');
      return;
    }
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);
        const orderData = res?.data;
        if (!orderData) throw new Error('Order not found');
        // If order already confirmed/cancelled, redirect away
        if (orderData.orderStatus === 'CONFIRMED' || orderData.orderStatus === 'CANCELLED') {
          navigate(`/customer/order-success/${orderId}`);
          return;
        }
        setOrder(orderData);
      } catch (err) {
        setError(err.message || 'Failed to load order.');
      } finally {
        setLoadingOrder(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  const handleProceedToUPI = () => {
    setStep('upi_screen');
  };

  const handlePay = async () => {
    setStep('processing');
    setError(null);
    try {
      const res = await createPayment({ orderId, paymentMethod });
      const payment = res?.data;
      setPaymentResult(payment);
      if (payment?.paymentStatus === 'SUCCESS' || payment?.paymentStatus === 'PENDING') {
        setStep('success');
        // Navigate to order success page after short delay
        setTimeout(() => {
          navigate(`/customer/order-success/${orderId}`, { replace: true });
        }, 2000);
      } else {
        setStep('failed');
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      setStep('failed');
    }
  };

  const handleCODPlace = async () => {
    setStep('processing');
    setError(null);
    try {
      const res = await createPayment({ orderId, paymentMethod: 'COD' });
      const payment = res?.data;
      setPaymentResult(payment);
      setStep('success');
      setTimeout(() => {
        navigate(`/customer/order-success/${orderId}`, { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to place COD order. Please try again.');
      setStep('failed');
    }
  };

  const handleRetry = () => {
    setStep('select');
    setError(null);
  };

  if (loadingOrder) {
    return (
      <div className="page-container">
        <div className="cart-skeleton">
          {[1, 2].map(i => <div key={i} className="skeleton-card" />)}
        </div>
      </div>
    );
  }

  if (error && step === 'select') {
    return (
      <div className="page-container">
        <div className="error-container">
          <p className="error-msg">{error}</p>
          <button className="btn-primary" onClick={() => navigate('/customer/orders')}>My Orders</button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const total = Number(order.totalAmount).toFixed(2);

  // ─── Processing overlay ──────────────────────────────────────────────
  if (step === 'processing') {
    return (
      <div className="page-container">
        <div className="payment-processing-screen">
          <div className="payment-spinner" />
          <h2>Processing Payment…</h2>
          <p style={{ color: '#64748b' }}>Please wait, do not close this page.</p>
        </div>
      </div>
    );
  }

  // ─── Success flash (before redirect) ────────────────────────────────
  if (step === 'success') {
    const isUPI = paymentResult?.paymentMethod === 'UPI';
    return (
      <div className="page-container">
        <div className="payment-result-screen payment-success-screen">
          <div className="payment-result-icon">✓</div>
          <h2>{isUPI ? 'Demo payment successful!' : 'Order confirmed!'}</h2>
          {isUPI && (
            <p className="demo-label">
              This is a simulated demo payment — no real money was charged.
            </p>
          )}
          {!isUPI && <p>Your Cash on Delivery order has been placed.</p>}
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Redirecting to order details…</p>
        </div>
      </div>
    );
  }

  // ─── Failed state ────────────────────────────────────────────────────
  if (step === 'failed') {
    return (
      <div className="page-container">
        <div className="payment-result-screen payment-failed-screen">
          <div className="payment-result-icon failed-icon">✕</div>
          <h2>Payment Failed</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            {error || 'Something went wrong. Please try again.'}
          </p>
          <div className="payment-action-btns">
            <button className="btn-primary" onClick={handleRetry}>Retry Payment</button>
            <button className="btn-outline" onClick={() => navigate('/customer/orders')}>
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── UPI Demo screen ─────────────────────────────────────────────────
  if (step === 'upi_screen') {
    return (
      <div className="page-container">
        <div className="payment-upi-screen">
          <div className="upi-demo-header">
            <span className="demo-badge">DEMO PAYMENT</span>
            <h2>UPI Payment</h2>
            <p className="demo-info-text">
              This is a simulated payment for project demonstration only.<br />
              No real banking credentials are required or stored.
            </p>
          </div>

          <div className="upi-amount-display">
            <div className="upi-amount-label">Total Amount</div>
            <div className="upi-amount-value">₹{total}</div>
          </div>

          <div className="upi-demo-note">
            <span>🔒</span>
            <span>Demo mode — click Pay to simulate a successful UPI transaction</span>
          </div>

          <div className="payment-action-btns">
            <button
              id="upi-pay-btn"
              className="btn-primary payment-pay-btn"
              onClick={handlePay}
            >
              Pay ₹{total}
            </button>
            <button className="btn-link" onClick={() => setStep('select')}>
              ← Change Method
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Method selection (default) ───────────────────────────────────────
  return (
    <div className="page-container">
      <button className="btn-link" style={{ marginBottom: '1.5rem' }}
        onClick={() => navigate('/customer/orders')}>
        ← Back to Orders
      </button>
      <h1 className="page-title">💳 Payment</h1>

      {error && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      <div className="checkout-layout">
        {/* Payment Method Selection */}
        <div className="checkout-form-section">
          <h2 className="checkout-section-title">Select Payment Method</h2>

          <div className="payment-methods">
            <label
              className={`payment-method-card ${paymentMethod === 'UPI' ? 'selected' : ''}`}
              htmlFor="method-upi"
            >
              <input
                type="radio"
                id="method-upi"
                name="paymentMethod"
                value="UPI"
                checked={paymentMethod === 'UPI'}
                onChange={() => setPaymentMethod('UPI')}
              />
              <div className="payment-method-icon">📱</div>
              <div className="payment-method-details">
                <div className="payment-method-name">UPI</div>
                <div className="payment-method-desc">Simulated UPI payment (demo)</div>
              </div>
              {paymentMethod === 'UPI' && <span className="payment-selected-check">✓</span>}
            </label>

            <label
              className={`payment-method-card ${paymentMethod === 'COD' ? 'selected' : ''}`}
              htmlFor="method-cod"
            >
              <input
                type="radio"
                id="method-cod"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
              />
              <div className="payment-method-icon">💵</div>
              <div className="payment-method-details">
                <div className="payment-method-name">Cash on Delivery</div>
                <div className="payment-method-desc">Pay when your plants arrive</div>
              </div>
              {paymentMethod === 'COD' && <span className="payment-selected-check">✓</span>}
            </label>
          </div>

          <div style={{ marginTop: '2rem' }}>
            {paymentMethod === 'UPI' ? (
              <button
                id="proceed-to-upi-btn"
                className="btn-primary checkout-btn"
                onClick={handleProceedToUPI}
              >
                Proceed to Pay ₹{total}
              </button>
            ) : (
              <button
                id="place-cod-btn"
                className="btn-primary checkout-btn"
                onClick={handleCODPlace}
              >
                ✓ Confirm COD Order
              </button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="cart-summary-box">
          <h3>Order Summary</h3>
          <div className="checkout-items-list">
            {(order.items || []).map(item => (
              <div key={item.id} className="checkout-item-row">
                <div className="checkout-item-name">
                  <span>{item.plantName}</span>
                  <span className="checkout-qty">× {item.quantity}</span>
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
            <span>₹{total}</span>
          </div>
          <div className="summary-divider" />
          <div className="payment-shipping-summary">
            <h4>Shipping To</h4>
            <div className="shipping-info">
              <p><strong>{order.shippingName}</strong></p>
              {order.shippingPhone && <p>📞 {order.shippingPhone}</p>}
              <p>📍 {order.shippingAddress}</p>
              <p>{order.shippingCity}{order.shippingPostalCode ? ` — ${order.shippingPostalCode}` : ''}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
