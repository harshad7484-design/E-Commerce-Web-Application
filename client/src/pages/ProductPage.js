import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products/' + id).then(res => setProduct(res.data));
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const renderStars = (rating) => '★'.repeat(Math.round(rating || 4)) + '☆'.repeat(5 - Math.round(rating || 4));

  if (!product) return (
    <div style={styles.loading}>
      <p>Loading product...</p>
    </div>
  );

  const discountPrice = (product.price * 1.2).toFixed(0);
  const saving = (discountPrice - product.price).toFixed(0);

  return (
    <div style={styles.page}>
      <button onClick={() => navigate(-1)} style={styles.back}>← Back to results</button>

      <div style={styles.container}>
        {/* Left - Image */}
        <div style={styles.imageSection}>
          <img src={product.image} alt={product.name} style={styles.mainImg}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'; }} />
        </div>

        {/* Middle - Details */}
        <div style={styles.details}>
          <p style={styles.category}>{product.category}</p>
          <h1 style={styles.productName}>{product.name}</h1>

          <div style={styles.ratingRow}>
            <span style={styles.stars}>{renderStars(product.rating)}</span>
            <span style={styles.ratingNum}>{product.rating || 4}/5</span>
            <span style={styles.reviewCount}>{product.numReviews || 0} ratings</span>
          </div>

          <div style={styles.divider} />

          <div style={styles.priceSection}>
            <span style={styles.dealLabel}>Deal of the Day</span>
            <div style={styles.priceRow}>
              <span style={styles.price}>₹{product.price}</span>
              <span style={styles.mrp}>M.R.P: <s>₹{discountPrice}</s></span>
            </div>
            <span style={styles.saving}>You save: ₹{saving} (17%)</span>
          </div>

          <div style={styles.divider} />

          <p style={styles.description}>{product.description}</p>

          <div style={styles.features}>
            <div style={styles.feature}>✅ Free Delivery on orders over ₹500</div>
            <div style={styles.feature}>🔄 Easy 30-day returns</div>
            <div style={styles.feature}>🛡️ 1 Year Warranty</div>
            <div style={styles.feature}>⚡ Usually ships in 1-2 days</div>
          </div>
        </div>

        {/* Right - Buy Box */}
        <div style={styles.buyBox}>
          <p style={styles.buyPrice}>₹{product.price}</p>
          <p style={styles.delivery}>🚚 FREE Delivery by Tomorrow</p>

          <div style={styles.stockStatus(product.stock)}>
            {product.stock > 10 ? '✅ In Stock' : product.stock > 0 ? '⚠️ Only ' + product.stock + ' left!' : '❌ Out of Stock'}
          </div>

          {product.stock > 0 && (
            <div style={styles.qtyRow}>
              <label style={styles.qtyLabel}>Qty:</label>
              <select value={qty} onChange={e => setQty(Number(e.target.value))} style={styles.qtySelect}>
                {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={added ? styles.addedBtn : product.stock === 0 ? styles.disabledBtn : styles.addBtn}
          >
            {added ? '✅ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>

          <button
            onClick={() => { handleAddToCart(); navigate('/cart'); }}
            disabled={product.stock === 0}
            style={product.stock === 0 ? styles.disabledBtn : styles.buyNowBtn}
          >
            ⚡ Buy Now
          </button>

          <div style={styles.secureBox}>
            🔒 Secure transaction<br />
            <span style={styles.secureText}>Ships from and sold by Cartify</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '20px 24px', background: '#f3f3f3', minHeight: '100vh' },
  loading: { display: 'flex', justifyContent: 'center', marginTop: '100px' },
  back: { background: '#fff', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' },
  container: { display: 'flex', gap: '24px', flexWrap: 'wrap', background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  imageSection: { flex: '0 0 340px' },
  mainImg: { width: '100%', height: '340px', objectFit: 'cover', borderRadius: '10px' },
  details: { flex: 2, minWidth: '280px' },
  category: { color: '#e94560', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 8px' },
  productName: { fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 12px', lineHeight: '1.3' },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
  stars: { color: '#ff9800', fontSize: '18px' },
  ratingNum: { color: '#ff9800', fontWeight: 'bold' },
  reviewCount: { color: '#0066c0', fontSize: '14px' },
  divider: { height: '1px', background: '#eee', margin: '16px 0' },
  priceSection: { marginBottom: '8px' },
  dealLabel: { background: '#cc0c39', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
  priceRow: { display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '8px' },
  price: { fontSize: '32px', fontWeight: 'bold', color: '#1a1a2e' },
  mrp: { color: '#888', fontSize: '14px' },
  saving: { color: '#cc0c39', fontSize: '14px', fontWeight: 'bold' },
  description: { color: '#444', lineHeight: '1.7', fontSize: '15px', marginBottom: '16px' },
  features: { display: 'flex', flexDirection: 'column', gap: '8px' },
  feature: { fontSize: '14px', color: '#555' },
  buyBox: { flex: '0 0 220px', border: '1px solid #ddd', borderRadius: '10px', padding: '20px', height: 'fit-content' },
  buyPrice: { fontSize: '24px', fontWeight: 'bold', color: '#1a1a2e', margin: '0 0 8px' },
  delivery: { fontSize: '13px', color: '#007600', marginBottom: '8px' },
  stockStatus: s => ({ fontSize: '16px', fontWeight: 'bold', color: s > 10 ? '#007600' : s > 0 ? '#e65100' : '#c62828', marginBottom: '12px' }),
  qtyRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  qtyLabel: { fontSize: '14px', color: '#444' },
  qtySelect: { padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' },
  addBtn: { width: '100%', padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '24px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', marginBottom: '8px' },
  addedBtn: { width: '100%', padding: '12px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '24px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', marginBottom: '8px' },
  buyNowBtn: { width: '100%', padding: '12px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: '24px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', marginBottom: '16px' },
  disabledBtn: { width: '100%', padding: '12px', background: '#ccc', color: '#666', border: 'none', borderRadius: '24px', cursor: 'not-allowed', fontSize: '15px', marginBottom: '8px' },
  secureBox: { fontSize: '12px', color: '#555', textAlign: 'center', padding: '10px', background: '#f9f9f9', borderRadius: '6px' },
  secureText: { color: '#888' },
};

export default ProductPage;