import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) return (
    <div style={styles.emptyPage}>
      <div style={styles.emptyBox}>
        <p style={styles.emptyIcon}>🛒</p>
        <h2>Your cart is empty</h2>
        <p style={styles.emptyText}>Add items to your cart to continue shopping</p>
        <button onClick={() => navigate('/')} style={styles.shopBtn}>Continue Shopping</button>
      </div>
    </div>
  );

  const delivery = totalPrice > 50 ? 0 : 5.99;
  const tax = (totalPrice * 0.08).toFixed(2);
  const grandTotal = (totalPrice + delivery + Number(tax)).toFixed(2);

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🛒 Shopping Cart</h2>

      <div style={styles.layout}>
        {/* Cart Items */}
        <div style={styles.itemsSection}>
          <div style={styles.cartHeader}>
            <span style={styles.headerText}>
              {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in cart
            </span>
            <button onClick={clearCart} style={styles.clearBtn}>🗑 Clear Cart</button>
          </div>

          {cartItems.map(item => (
            <div key={item._id} style={styles.cartItem}>
              <img src={item.image} alt={item.name} style={styles.itemImg} />

              <div style={styles.itemDetails}>
                <Link to={`/product/₹{item._id}`} style={styles.itemName}>{item.name}</Link>
                <p style={styles.itemCategory}>{item.category}</p>
                <p style={styles.inStock}>✅ In Stock</p>
                <p style={styles.delivery}>🚚 FREE Delivery</p>

                <div style={styles.itemActions}>
                  <div style={styles.qtyControl}>
                    <button
                      onClick={() => item.quantity > 1 ? updateQty(item._id, item.quantity - 1) : removeFromCart(item._id)}
                      style={styles.qtyBtn}
                    >−</button>
                    <span style={styles.qtyNum}>{item.quantity}</span>
                    <button onClick={() => updateQty(item._id, item.quantity + 1)} style={styles.qtyBtn}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} style={styles.removeBtn}>Remove</button>
                  <button style={styles.saveBtn}>Save for later</button>
                </div>
              </div>

              <div style={styles.itemPrice}>
                <p style={styles.priceMain}>₹{(item.price * item.quantity).toFixed(2)}</p>
                {item.quantity > 1 && (
                  <p style={styles.priceEach}>₹{item.price} each</p>
                )}
              </div>
            </div>
          ))}

          <div style={styles.subtotalBar}>
            Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items):&nbsp;
            <strong>₹{totalPrice.toFixed(2)}</strong>
          </div>
        </div>

        {/* Order Summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>

          <div style={styles.summaryRow}>
            <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span style={{ color: delivery === 0 ? '#007600' : '#000' }}>
              {delivery === 0 ? 'FREE' : `₹₹{delivery}`}
            </span>
          </div>
          <div style={styles.summaryRow}>
            <span>Estimated Tax</span>
            <span>₹{tax}</span>
          </div>

          {delivery === 0 && (
            <p style={styles.freeShipping}>✅ Your order qualifies for FREE shipping!</p>
          )}
          {delivery > 0 && (
            <p style={styles.freeShippingHint}>
              Add ₹{(50 - totalPrice).toFixed(2)} more for FREE shipping
            </p>
          )}

          <div style={styles.divider} />

          <div style={styles.totalRow}>
            <strong>Order Total</strong>
            <strong style={styles.totalPrice}>₹{grandTotal}</strong>
          </div>

          <button onClick={() => navigate('/checkout')} style={styles.checkoutBtn}>
            Proceed to Checkout →
          </button>

          <div style={styles.secure}>🔒 Secure Checkout</div>

          <div style={styles.paymentIcons}>
            <span style={styles.payIcon}>💳</span>
            <span style={styles.payIcon}>🏦</span>
            <span style={styles.payIcon}>📱</span>
          </div>
        </div>
      </div>

      {/* Recommended - Continue Shopping */}
      <div style={styles.continueSection}>
        <h3>Continue Shopping</h3>
        <button onClick={() => navigate('/')} style={styles.continueBtn}>
          ← Back to All Products
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '24px', background: '#f3f3f3', minHeight: '100vh' },
  title: { fontSize: '28px', margin: '0 0 20px', color: '#1a1a2e' },
  layout: { display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' },
  itemsSection: { flex: 3, minWidth: '300px' },
  cartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#fff', borderRadius: '10px 10px 0 0', borderBottom: '1px solid #eee' },
  headerText: { color: '#888', fontSize: '14px' },
  clearBtn: { background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '13px' },
  cartItem: { display: 'flex', gap: '16px', background: '#fff', padding: '20px', borderBottom: '1px solid #f0f0f0' },
  itemImg: { width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: '16px', fontWeight: '600', color: '#1a1a2e', textDecoration: 'none', display: 'block', marginBottom: '4px' },
  itemCategory: { color: '#e94560', fontSize: '12px', margin: '0 0 4px', textTransform: 'uppercase', fontWeight: 'bold' },
  inStock: { color: '#007600', fontSize: '13px', margin: '0 0 2px' },
  delivery: { color: '#555', fontSize: '13px', margin: '0 0 12px' },
  itemActions: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  qtyControl: { display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' },
  qtyBtn: { width: '32px', height: '32px', background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' },
  qtyNum: { padding: '0 16px', fontSize: '15px', fontWeight: '600' },
  removeBtn: { background: 'none', border: 'none', color: '#0066c0', cursor: 'pointer', fontSize: '13px', padding: '4px 0' },
  saveBtn: { background: 'none', border: 'none', color: '#0066c0', cursor: 'pointer', fontSize: '13px', padding: '4px 0' },
  itemPrice: { textAlign: 'right', flexShrink: 0 },
  priceMain: { fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 4px' },
  priceEach: { color: '#888', fontSize: '12px', margin: 0 },
  subtotalBar: { background: '#fff', padding: '16px', borderRadius: '0 0 10px 10px', textAlign: 'right', fontSize: '18px', borderTop: '2px solid #eee' },
  summary: { flex: 1, minWidth: '260px', background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', position: 'sticky', top: '100px' },
  summaryTitle: { fontSize: '18px', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '1px solid #eee' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#444' },
  freeShipping: { color: '#007600', fontSize: '13px', background: '#f0fff0', padding: '8px', borderRadius: '6px', margin: '8px 0' },
  freeShippingHint: { color: '#e65100', fontSize: '13px', background: '#fff3e0', padding: '8px', borderRadius: '6px', margin: '8px 0' },
  divider: { height: '1px', background: '#eee', margin: '12px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '18px', marginBottom: '16px' },
  totalPrice: { color: '#e94560' },
  checkoutBtn: { width: '100%', padding: '14px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '24px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' },
  secure: { textAlign: 'center', color: '#888', fontSize: '13px', marginBottom: '12px' },
  paymentIcons: { display: 'flex', justifyContent: 'center', gap: '8px' },
  payIcon: { fontSize: '24px' },
  emptyPage: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', background: '#f3f3f3' },
  emptyBox: { background: '#fff', padding: '60px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
  emptyIcon: { fontSize: '80px', margin: '0 0 16px' },
  emptyText: { color: '#888', marginBottom: '24px' },
  shopBtn: { padding: '12px 32px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '24px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  continueSection: { marginTop: '24px', background: '#fff', padding: '20px', borderRadius: '10px' },
  continueBtn: { padding: '10px 24px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', marginTop: '8px' },
};

export default Cart;