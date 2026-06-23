import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [payment, setPayment] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentVerifying, setPaymentVerifying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const delivery = totalPrice > 500 ? 0 : 49;
const tax = (totalPrice * 0.18).toFixed(2);
const grandTotal = (totalPrice + delivery + Number(tax)).toFixed(2);
  const handleAddressSubmit = e => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentVerify = () => {
    setPaymentVerifying(true);
    setTimeout(() => {
      setPaymentVerifying(false);
      setPaymentDone(true);
    }, 2500);
  };

  const handleOrder = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/orders', {
        items: cartItems.map(item => ({
          product: item._id, name: item.name,
          image: item.image, price: item.price, quantity: item.quantity,
        })),
        shippingAddress: address,
        totalPrice: Number(grandTotal),
      });
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.');
    }
    setLoading(false);
  };

  if (success) return (
    <div style={styles.successPage}>
      <div style={styles.successBox}>
        <div style={styles.successIcon}>✅</div>
        <h2 style={styles.successTitle}>Order Placed Successfully!</h2>
        <p style={styles.successText}>Thank you, <strong>{user.name}</strong>!</p>
        <p style={styles.successSub}>Confirmation sent to <strong>{user.email}</strong></p>
        <div style={styles.successActions}>
          <button onClick={() => navigate('/orders')} style={styles.ordersBtn}>📋 View My Orders</button>
          <button onClick={() => navigate('/')} style={styles.continueBtn}>🛒 Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Checkout</h2>

      {/* Steps */}
      <div style={styles.steps}>
        {['Shipping', 'Payment', 'Review'].map((s, i) => (
          <div key={s} style={styles.stepItem}>
            <div style={step > i ? styles.stepDone : step === i + 1 ? styles.stepActive : styles.stepInactive}>
              {step > i ? '✓' : i + 1}
            </div>
            <span style={styles.stepLabel}>{s}</span>
            {i < 2 && <div style={styles.stepLine} />}
          </div>
        ))}
      </div>

      <div style={styles.layout}>
        <div style={styles.formSection}>

          {/* STEP 1 - Shipping */}
          {step === 1 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📦 Shipping Address</h3>
              <form onSubmit={handleAddressSubmit}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Street Address</label>
                    <input placeholder="123 Main Street" value={address.address}
                      onChange={e => setAddress({ ...address, address: e.target.value })}
                      style={styles.input} required />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>City</label>
                    <input placeholder="Mumbai" value={address.city}
                      onChange={e => setAddress({ ...address, city: e.target.value })}
                      style={styles.input} required />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Postal Code</label>
                    <input placeholder="400001" value={address.postalCode}
                      onChange={e => setAddress({ ...address, postalCode: e.target.value })}
                      style={styles.input} required />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Country</label>
                    <input placeholder="India" value={address.country}
                      onChange={e => setAddress({ ...address, country: e.target.value })}
                      style={styles.input} required />
                  </div>
                </div>
                <button type="submit" style={styles.nextBtn}>Continue to Payment →</button>
              </form>
            </div>
          )}

          {/* STEP 2 - Payment */}
          {step === 2 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>💳 Payment Method</h3>

              {/* Payment Options */}
              <div style={styles.paymentOptions}>
                {[
                  { id: 'card', label: '💳 Credit / Debit Card', sub: 'Visa, Mastercard, Amex' },
                  { id: 'upi', label: '📱 UPI', sub: 'Google Pay, PhonePe, Paytm' },
                  { id: 'netbanking', label: '🏦 Net Banking', sub: 'All major banks supported' },
                  { id: 'cod', label: '💵 Cash on Delivery', sub: 'Pay when you receive' },
                ].map(p => (
                  <div key={p.id} onClick={() => { setPayment(p.id); setPaymentDone(false); }}
                    style={payment === p.id ? styles.payOptionActive : styles.payOption}>
                    <div style={styles.payRadio}>{payment === p.id ? '🔵' : '⚪'}</div>
                    <div>
                      <p style={styles.payLabel}>{p.label}</p>
                      <p style={styles.paySub}>{p.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CARD FORM */}
              {payment === 'card' && (
                <div style={styles.paymentForm}>
                  <h4 style={styles.payFormTitle}>Enter Card Details</h4>
                  <div style={styles.cardPreview}>
                    <div style={styles.cardChip}>💳</div>
                    <p style={styles.cardNumber}>{cardDetails.number || '•••• •••• •••• ••••'}</p>
                    <div style={styles.cardBottom}>
                      <span>{cardDetails.name || 'CARD HOLDER'}</span>
                      <span>{cardDetails.expiry || 'MM/YY'}</span>
                    </div>
                  </div>
                  <input placeholder="Card Number (1234 5678 9012 3456)"
                    value={cardDetails.number} maxLength={19}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '₹1 ').trim();
                      setCardDetails({ ...cardDetails, number: v });
                    }}
                    style={styles.input} />
                  <input placeholder="Card Holder Name"
                    value={cardDetails.name}
                    onChange={e => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })}
                    style={styles.input} />
                  <div style={styles.formGrid}>
                    <input placeholder="MM/YY" value={cardDetails.expiry} maxLength={5}
                      onChange={e => {
                        let v = e.target.value.replace(/\D/g, '');
                        if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
                        setCardDetails({ ...cardDetails, expiry: v });
                      }}
                      style={styles.input} />
                    <input placeholder="CVV" type="password" maxLength={3}
                      value={cardDetails.cvv}
                      onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                      style={styles.input} />
                  </div>
                  {!paymentDone ? (
                    <button onClick={handlePaymentVerify} disabled={paymentVerifying}
                      style={styles.verifyBtn}>
                      {paymentVerifying ? '🔄 Verifying...' : '🔒 Pay ₹' + grandTotal}
                    </button>
                  ) : (
                    <div style={styles.paySuccess}>✅ Payment Verified! Click "Review Order" to continue.</div>
                  )}
                </div>
              )}

              {/* UPI PAYMENT */}
              {payment === 'upi' && (
                <div style={styles.paymentForm}>
                  <h4 style={styles.payFormTitle}>Pay via UPI</h4>

                  {/* QR Code */}
                  <div style={styles.qrSection}>
                    <p style={styles.qrLabel}>Scan QR Code to Pay</p>
                    <div style={styles.qrBox}>
                      {/* QR Code using API */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=cartify@upi&pn=Cartify&am=₹{grandTotal}&cu=INR&tn=CartifyOrder`}
                        alt="UPI QR Code"
                        style={styles.qrImage}
                      />
                    </div>
                    <p style={styles.qrAmount}>Amount: <strong style={{ color: '#e94560' }}>₹{grandTotal}</strong></p>
                    <p style={styles.qrUpiId}>UPI ID: <strong>cartify@upi</strong></p>
                    <div style={styles.upiApps}>
                      <span style={styles.upiApp}>📱 GPay</span>
                      <span style={styles.upiApp}>📲 PhonePe</span>
                      <span style={styles.upiApp}>💰 Paytm</span>
                      <span style={styles.upiApp}>🏦 BHIM</span>
                    </div>
                  </div>

                  <p style={styles.orDivider}>— OR Enter UPI ID —</p>

                  <div style={styles.upiInputRow}>
                    <input placeholder="yourname@upi" value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      style={{ ...styles.input, flex: 1, margin: 0 }} />
                    <span style={styles.upiVerifyTag}>✓ VERIFY</span>
                  </div>

                  {!paymentDone ? (
                    <button onClick={handlePaymentVerify} disabled={paymentVerifying}
                      style={styles.verifyBtn}>
                      {paymentVerifying ? '🔄 Processing Payment...' : '✅ Confirm UPI Payment ₹' + grandTotal}
                    </button>
                  ) : (
                    <div style={styles.paySuccess}>✅ UPI Payment Confirmed! Click "Review Order" to continue.</div>
                  )}
                </div>
              )}

              {/* NET BANKING */}
              {payment === 'netbanking' && (
                <div style={styles.paymentForm}>
                  <h4 style={styles.payFormTitle}>Select Your Bank</h4>
                  <div style={styles.bankGrid}>
                    {[
                      { name: 'SBI', icon: '🏦' },
                      { name: 'HDFC', icon: '🏦' },
                      { name: 'ICICI', icon: '🏦' },
                      { name: 'Axis', icon: '🏦' },
                      { name: 'Kotak', icon: '🏦' },
                      { name: 'PNB', icon: '🏦' },
                      { name: 'BOI', icon: '🏦' },
                      { name: 'Canara', icon: '🏦' },
                    ].map(bank => (
                      <div key={bank.name} style={styles.bankCard}
                        onClick={handlePaymentVerify}>
                        <span style={styles.bankIcon}>{bank.icon}</span>
                        <span style={styles.bankName}>{bank.name}</span>
                      </div>
                    ))}
                  </div>
                  {paymentVerifying && (
                    <div style={styles.bankVerifying}>
                      🔄 Redirecting to bank portal... Please wait...
                    </div>
                  )}
                  {paymentDone && (
                    <div style={styles.paySuccess}>✅ Net Banking Payment Confirmed! Click "Review Order" to continue.</div>
                  )}
                </div>
              )}

              {/* COD */}
              {payment === 'cod' && (
                <div style={styles.paymentForm}>
                  <div style={styles.codBox}>
                    <p style={styles.codIcon}>💵</p>
                    <h4>Cash on Delivery</h4>
                    <p style={styles.codText}>Pay <strong>₹{grandTotal}</strong> when your order is delivered.</p>
                    <p style={styles.codNote}>⚠️ Please keep exact change ready.</p>
                  </div>
                </div>
              )}

              <div style={styles.btnRow}>
                <button onClick={() => setStep(1)} style={styles.backBtn}>← Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={payment !== 'cod' && !paymentDone}
                  style={(payment !== 'cod' && !paymentDone) ? styles.disabledNextBtn : styles.nextBtn}
                >
                  Review Order →
                </button>
              </div>
              {payment !== 'cod' && !paymentDone && (
                <p style={{ color: '#e94560', fontSize: '13px', marginTop: '8px', textAlign: 'center' }}>
                  ⚠️ Please complete payment above before proceeding
                </p>
              )}
            </div>
          )}

          {/* STEP 3 - Review */}
          {step === 3 && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📋 Review Your Order</h3>
              {error && <p style={styles.error}>{error}</p>}

              <div style={styles.reviewSection}>
                <h4 style={styles.reviewLabel}>📦 Shipping To</h4>
                <p style={styles.reviewText}>{address.address}, {address.city}, {address.postalCode}, {address.country}</p>
              </div>
              <div style={styles.reviewSection}>
                <h4 style={styles.reviewLabel}>💳 Payment</h4>
                <p style={styles.reviewText}>
                  {payment === 'card' ? '💳 Credit/Debit Card'
                    : payment === 'upi' ? '📱 UPI Payment'
                    : payment === 'netbanking' ? '🏦 Net Banking'
                    : '💵 Cash on Delivery'}
                  {payment !== 'cod' && <span style={styles.paidBadge}>✅ PAID</span>}
                </p>
              </div>
              <div style={styles.reviewSection}>
                <h4 style={styles.reviewLabel}>🛒 Items ({cartItems.length})</h4>
                {cartItems.map(item => (
                  <div key={item._id} style={styles.reviewItem}>
                    <img src={item.image} alt={item.name} style={styles.reviewImg}
                      onError={e => { e.target.src = `https://picsum.photos/seed/₹{item.name}/50/50`; }} />
                    <span style={styles.reviewItemName}>{item.name} × {item.quantity}</span>
                    <span style={styles.reviewItemPrice}>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={styles.btnRow}>
                <button onClick={() => setStep(2)} style={styles.backBtn}>← Back</button>
                <button onClick={handleOrder} disabled={loading} style={styles.placeBtn}>
                  {loading ? '⏳ Placing Order...' : '✅ Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          {cartItems.map(item => (
            <div key={item._id} style={styles.summaryItem}>
              <img src={item.image} alt={item.name} style={styles.summaryImg}
                onError={e => { e.target.src = `https://picsum.photos/seed/₹{item.name}/50/50`; }} />
              <div style={{ flex: 1 }}>
                <p style={styles.summaryName}>{item.name}</p>
                <p style={styles.summaryQty}>Qty: {item.quantity}</p>
              </div>
              <span style={styles.summaryPrice}>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={styles.divider} />
          <div style={styles.summaryRow}><span>Subtotal</span><span>₹{totalPrice.toFixed(2)}</span></div>
          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span style={{ color: delivery === 0 ? '#007600' : '#000' }}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
          </div>
          <div style={styles.summaryRow}><span>Tax (8%)</span><span>₹{tax}</span></div>
          <div style={styles.divider} />
          <div style={styles.totalRow}>
            <strong>Total</strong>
            <strong style={{ color: '#e94560', fontSize: '20px' }}>₹{grandTotal}</strong>
          </div>
          <p style={styles.secureNote}>🔒 Secure & Encrypted Checkout</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '24px', background: '#f3f3f3', minHeight: '100vh' },
  title: { fontSize: '28px', margin: '0 0 24px', color: '#1a1a2e' },
  steps: { display: 'flex', alignItems: 'center', marginBottom: '32px', background: '#fff', padding: '20px', borderRadius: '12px' },
  stepItem: { display: 'flex', alignItems: 'center', flex: 1 },
  stepActive: { width: '36px', height: '36px', borderRadius: '50%', background: '#e94560', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 },
  stepDone: { width: '36px', height: '36px', borderRadius: '50%', background: '#4caf50', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 },
  stepInactive: { width: '36px', height: '36px', borderRadius: '50%', background: '#ddd', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 },
  stepLabel: { marginLeft: '8px', fontSize: '14px', fontWeight: '600', color: '#444' },
  stepLine: { flex: 1, height: '2px', background: '#eee', margin: '0 12px' },
  layout: { display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' },
  formSection: { flex: 2, minWidth: '300px' },
  card: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  cardTitle: { fontSize: '18px', margin: '0 0 20px', color: '#1a1a2e' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#555' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box', marginBottom: '10px' },
  nextBtn: { padding: '12px 28px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', marginTop: '8px' },
  disabledNextBtn: { padding: '12px 28px', background: '#ccc', color: '#888', border: 'none', borderRadius: '8px', cursor: 'not-allowed', fontSize: '15px', fontWeight: 'bold', marginTop: '8px' },
  backBtn: { padding: '12px 28px', background: '#fff', color: '#444', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  btnRow: { display: 'flex', gap: '12px', marginTop: '20px' },
  placeBtn: { padding: '12px 28px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' },
  paymentOptions: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' },
  payOption: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' },
  payOptionActive: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', border: '2px solid #e94560', borderRadius: '8px', cursor: 'pointer', background: '#fff5f7' },
  payRadio: { fontSize: '20px' },
  payLabel: { margin: 0, fontWeight: '600', fontSize: '14px' },
  paySub: { margin: 0, color: '#888', fontSize: '12px' },
  paymentForm: { background: '#f9f9f9', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
  payFormTitle: { margin: '0 0 16px', fontSize: '16px', color: '#1a1a2e' },
  cardPreview: { background: 'linear-gradient(135deg, #1a1a2e, #e94560)', borderRadius: '12px', padding: '20px', color: '#fff', marginBottom: '16px' },
  cardChip: { fontSize: '24px', marginBottom: '16px' },
  cardNumber: { fontSize: '18px', letterSpacing: '3px', margin: '0 0 16px', fontFamily: 'monospace' },
  cardBottom: { display: 'flex', justifyContent: 'space-between', fontSize: '13px' },
  verifyBtn: { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #e94560, #c62a47)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '8px' },
  paySuccess: { background: '#e8f5e9', color: '#2e7d32', padding: '14px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', marginTop: '12px', fontSize: '15px' },
  qrSection: { textAlign: 'center', marginBottom: '16px' },
  qrLabel: { fontSize: '15px', fontWeight: '600', color: '#444', margin: '0 0 12px' },
  qrBox: { display: 'inline-block', padding: '12px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', marginBottom: '12px' },
  qrImage: { width: '180px', height: '180px', display: 'block' },
  qrAmount: { fontSize: '16px', margin: '8px 0 4px' },
  qrUpiId: { fontSize: '14px', color: '#555', margin: '0 0 12px' },
  upiApps: { display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '12px' },
  upiApp: { background: '#fff', border: '1px solid #ddd', padding: '8px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  orDivider: { textAlign: 'center', color: '#888', fontSize: '13px', margin: '12px 0' },
  upiInputRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' },
  upiVerifyTag: { background: '#4caf50', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' },
  bankGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' },
  bankCard: { background: '#fff', border: '1px solid #ddd', borderRadius: '8px', padding: '14px 8px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  bankIcon: { fontSize: '24px', display: 'block', marginBottom: '4px' },
  bankName: { fontSize: '12px', fontWeight: '600', color: '#444' },
  bankVerifying: { background: '#fff3e0', color: '#e65100', padding: '12px', borderRadius: '8px', textAlign: 'center', fontWeight: '600' },
  codBox: { textAlign: 'center', padding: '20px' },
  codIcon: { fontSize: '48px', margin: '0 0 8px' },
  codText: { fontSize: '16px', color: '#444', margin: '0 0 8px' },
  codNote: { fontSize: '13px', color: '#888' },
  reviewSection: { marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' },
  reviewLabel: { margin: '0 0 8px', color: '#888', fontSize: '13px', textTransform: 'uppercase' },
  reviewText: { margin: 0, fontSize: '15px', color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: '10px' },
  paidBadge: { background: '#e8f5e9', color: '#2e7d32', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  reviewItem: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' },
  reviewImg: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' },
  reviewItemName: { flex: 1, fontSize: '14px' },
  reviewItemPrice: { fontWeight: 'bold', color: '#e94560' },
  error: { color: '#c62828', background: '#ffebee', padding: '10px', borderRadius: '8px', marginBottom: '16px' },
  summary: { flex: 1, minWidth: '260px', background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', position: 'sticky', top: '100px' },
  summaryTitle: { fontSize: '18px', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '1px solid #eee' },
  summaryItem: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  summaryImg: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' },
  summaryName: { margin: '0 0 2px', fontSize: '13px', fontWeight: '600' },
  summaryQty: { margin: 0, fontSize: '12px', color: '#888' },
  summaryPrice: { fontWeight: 'bold', color: '#1a1a2e' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#444' },
  divider: { height: '1px', background: '#eee', margin: '12px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginBottom: '12px' },
  secureNote: { textAlign: 'center', color: '#888', fontSize: '12px', margin: '12px 0 0' },
  successPage: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f3f3f3' },
  successBox: { background: '#fff', padding: '60px 40px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '480px' },
  successIcon: { fontSize: '80px', marginBottom: '16px' },
  successTitle: { fontSize: '28px', color: '#1a1a2e', margin: '0 0 12px' },
  successText: { color: '#444', fontSize: '16px', margin: '0 0 8px' },
  successSub: { color: '#888', fontSize: '14px', margin: '0 0 28px' },
  successActions: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
  ordersBtn: { padding: '12px 24px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' },
  continueBtn: { padding: '12px 24px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
};

export default Checkout;