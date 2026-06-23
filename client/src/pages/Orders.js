import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/orders/${orderId}/status`, { status: 'cancelled' });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch (err) {
      alert('Failed to cancel order');
    }
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/orders/my')
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statusColor = s => ({
    pending: '#ff9800', processing: '#2196f3',
    shipped: '#9c27b0', delivered: '#4caf50', cancelled: '#f44336'
  }[s] || '#888');

  const statusIcon = s => ({
    pending: '🕐', processing: '⚙️',
    shipped: '🚚', delivered: '✅', cancelled: '❌'
  }[s] || '📦');

  if (loading) return (
    <div style={styles.loading}>
      <div style={styles.spinner} />
      <p>Loading your orders...</p>
    </div>
  );

  if (orders.length === 0) return (
    <div style={styles.emptyPage}>
      <div style={styles.emptyBox}>
        <p style={styles.emptyIcon}>📋</p>
        <h2>No orders yet</h2>
        <p style={styles.emptyText}>You haven't placed any orders yet.</p>
        <button onClick={() => navigate('/')} style={styles.shopBtn}>
          Start Shopping →
        </button>
      </div>
    </div>
  );

  const totalSpent = orders.reduce((s, o) => s + o.totalPrice, 0).toFixed(2);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>📋 My Orders</h2>
        <p style={styles.subtitle}>{orders.length} order{orders.length > 1 ? 's' : ''} placed</p>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>📦</span>
          <span style={styles.statValue}>{orders.length}</span>
          <span style={styles.statLabel}>Total Orders</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>✅</span>
          <span style={styles.statValue}>{orders.filter(o => o.status === 'delivered').length}</span>
          <span style={styles.statLabel}>Delivered</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>🚚</span>
          <span style={styles.statValue}>{orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}</span>
          <span style={styles.statLabel}>In Progress</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statIcon}>💰</span>
          <span style={styles.statValue}>₹{totalSpent}</span>
          <span style={styles.statLabel}>Total Spent</span>
        </div>
      </div>

      <div style={styles.ordersList}>
        {orders.slice().reverse().map(order => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div>
                <p style={styles.orderId}>Order # {order._id}</p>
                <p style={styles.orderDate}>
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
              <div style={styles.orderHeaderRight}>
                <p style={styles.orderTotal}>₹{order.totalPrice.toFixed(2)}</p>
                <div style={{ ...styles.statusBadge, background: statusColor(order.status) + '20', color: statusColor(order.status), border: '1px solid ' + statusColor(order.status) }}>
                  {statusIcon(order.status)} {order.status.toUpperCase()}
                </div>
              </div>
            </div>

            <div style={styles.progressSection}>
              {['pending', 'processing', 'shipped', 'delivered'].map((s, i) => {
                const statuses = ['pending', 'processing', 'shipped', 'delivered'];
                const currentIdx = statuses.indexOf(order.status);
                const isDone = i <= currentIdx && order.status !== 'cancelled';
                return (
                  <div key={s} style={styles.progressStep}>
                    <div style={isDone ? { ...styles.progressDot, background: statusColor(order.status) } : styles.progressDotInactive}>
                      {isDone ? '✓' : i + 1}
                    </div>
                    <span style={styles.progressLabel}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                    {i < 3 && <div style={{ ...styles.progressLine, background: isDone && i < currentIdx ? statusColor(order.status) : '#eee' }} />}
                  </div>
                );
              })}
            </div>

            <div style={styles.itemsSection}>
              {order.items.map((item, i) => (
                <div key={i} style={styles.orderItem}>
                  <img
                    src={item.image || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    style={styles.itemImg}
                  />
                  <div style={styles.itemDetails}>
                    <p style={styles.itemName}>{item.name}</p>
                    <p style={styles.itemQty}>Qty: {item.quantity}</p>
                    <p style={styles.itemPrice}>₹{item.price} each</p>
                  </div>
                  <div style={styles.itemTotal}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.orderFooter}>
              <div style={styles.shippingInfo}>
                <p style={styles.shippingLabel}>📦 Shipping Address</p>
                <p style={styles.shippingText}>
                  {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
                  {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
                </p>
              </div>
              <div style={styles.orderActions}>
                {order.status === 'delivered' && (
                  <button style={styles.reviewBtn}>⭐ Write a Review</button>
                )}
                {order.status === 'pending' && (
  <button onClick={() => handleCancelOrder(order._id)} style={styles.cancelBtn}>Cancel Order</button>
)}
                <button onClick={() => navigate('/')} style={styles.reorderBtn}>
                  🔄 Buy Again
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '24px', background: '#f3f3f3', minHeight: '100vh' },
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px', gap: '16px' },
  spinner: { width: '40px', height: '40px', border: '4px solid #ddd', borderTop: '4px solid #e94560', borderRadius: '50%' },
  header: { marginBottom: '20px' },
  title: { fontSize: '28px', margin: '0 0 4px', color: '#1a1a2e' },
  subtitle: { color: '#888', margin: 0, fontSize: '14px' },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: '120px', background: '#fff', borderRadius: '12px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: '4px' },
  statIcon: { fontSize: '24px' },
  statValue: { fontSize: '22px', fontWeight: 'bold', color: '#e94560' },
  statLabel: { fontSize: '12px', color: '#888' },
  ordersList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  orderCard: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px 20px', background: '#f9f9f9', borderBottom: '1px solid #eee', flexWrap: 'wrap', gap: '12px' },
  orderId: { margin: '0 0 4px', fontFamily: 'monospace', fontSize: '13px', color: '#555' },
  orderDate: { margin: 0, color: '#888', fontSize: '13px' },
  orderHeaderRight: { textAlign: 'right' },
  orderTotal: { margin: '0 0 8px', fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e' },
  statusBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
  progressSection: { display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f0f0f0', overflowX: 'auto' },
  progressStep: { display: 'flex', alignItems: 'center', flexShrink: 0 },
  progressDot: { width: '28px', height: '28px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 },
  progressDotInactive: { width: '28px', height: '28px', borderRadius: '50%', background: '#eee', color: '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', flexShrink: 0 },
  progressLabel: { fontSize: '11px', color: '#666', margin: '0 4px', whiteSpace: 'nowrap' },
  progressLine: { width: '40px', height: '2px', margin: '0 4px' },
  itemsSection: { padding: '16px 20px' },
  orderItem: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: '1px solid #f5f5f5' },
  itemImg: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 },
  itemDetails: { flex: 1 },
  itemName: { margin: '0 0 4px', fontWeight: '600', fontSize: '15px', color: '#1a1a2e' },
  itemQty: { margin: '0 0 2px', color: '#888', fontSize: '13px' },
  itemPrice: { margin: 0, color: '#555', fontSize: '13px' },
  itemTotal: { fontWeight: 'bold', fontSize: '16px', color: '#e94560', flexShrink: 0 },
  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#fafafa', borderTop: '1px solid #eee', flexWrap: 'wrap', gap: '12px' },
  shippingInfo: {},
  shippingLabel: { margin: '0 0 4px', fontSize: '12px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase' },
  shippingText: { margin: 0, fontSize: '13px', color: '#555' },
  orderActions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  reviewBtn: { padding: '8px 16px', background: '#fff3e0', color: '#e65100', border: '1px solid #e65100', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  cancelBtn: { padding: '8px 16px', background: '#ffebee', color: '#c62828', border: '1px solid #c62828', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  reorderBtn: { padding: '8px 16px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  emptyPage: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f3f3f3' },
  emptyBox: { background: '#fff', padding: '60px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
  emptyIcon: { fontSize: '80px', margin: '0 0 16px' },
  emptyText: { color: '#888', marginBottom: '24px' },
  shopBtn: { padding: '12px 32px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '24px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
};

export default Orders;