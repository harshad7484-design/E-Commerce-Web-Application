import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const FALLBACK_IMAGES = {
  Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
  Shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
  Clothing: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400',
  Books: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
  Beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
  Sports: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400',
  Home: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
  default: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
};

const Home = ({ selectedCategory, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('default');
  const { addToCart } = useCart();

  useEffect(() => {
    api.get('/products')
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...products];
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sort === 'low') result.sort((a, b) => a.price - b.price);
    if (sort === 'high') result.sort((a, b) => b.price - a.price);
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    setFiltered(result);
  }, [searchQuery, selectedCategory, sort, products]);

  const getImage = (p) => {
    if (p.image && p.image.startsWith('http')) return p.image;
    return FALLBACK_IMAGES[p.category] || FALLBACK_IMAGES.default;
  };

  const renderStars = (rating) => '★'.repeat(Math.round(rating || 4)) + '☆'.repeat(5 - Math.round(rating || 4));

  if (loading) return (
    <div style={styles.loadingWrapper}>
      <p style={{ fontSize: '18px' }}>Loading products... ⏳</p>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🛒 Welcome to Cartify</h1>
        <p style={styles.heroSub}>Millions of products. Best prices. Fast delivery.</p>
      </div>

      <div style={styles.filterBar}>
        <span style={styles.filterLabel}>
          {selectedCategory && selectedCategory !== 'All' ? '📁 ' + selectedCategory : '🏠 All Products'}
        </span>
        <select value={sort} onChange={e => setSort(e.target.value)} style={styles.select}>
          <option value="default">Sort: Default</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
        </select>
      </div>

      <p style={styles.resultCount}>
        Showing <strong>{filtered.length}</strong> products
        {searchQuery && ' for "' + searchQuery + '"'}
        {selectedCategory && selectedCategory !== 'All' && ' in ' + selectedCategory}
      </p>

      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <p style={{ fontSize: '48px' }}>😕</p>
          <p>No products found.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map(p => (
            <div key={p._id} style={styles.card}>
              <Link to={'/product/' + p._id}>
                <div style={styles.imgWrapper}>
                  <img
                    src={getImage(p)}
                    alt={p.name}
                    style={styles.img}
                    onError={e => { e.target.src = FALLBACK_IMAGES[p.category] || FALLBACK_IMAGES.default; }}
                  />
                  {p.stock < 10 && p.stock > 0 && <span style={styles.lowStock}>Only {p.stock} left!</span>}
                  {p.stock === 0 && <span style={styles.outOfStock}>Out of Stock</span>}
                </div>
              </Link>
              <div style={styles.cardBody}>
                <p style={styles.cardCategory}>{p.category}</p>
                <Link to={'/product/' + p._id} style={styles.cardTitle}>{p.name}</Link>
                <div style={styles.stars}>
                  <span style={styles.starText}>{renderStars(p.rating)}</span>
                  <span style={styles.reviewCount}>({p.numReviews || 0})</span>
                </div>
                <div style={styles.priceRow}>
                  <span style={styles.price}>₹{p.price}</span>
                  <span style={styles.originalPrice}>₹{(p.price * 1.2).toFixed(0)}</span>
                  <span style={styles.discount}>17% off</span>
                </div>
                <p style={styles.delivery}>🚚 FREE Delivery</p>
                <button
                  onClick={() => addToCart(p)}
                  disabled={p.stock === 0}
                  style={p.stock === 0 ? styles.disabledBtn : styles.addBtn}
                >
                  {p.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { background: '#f3f3f3', minHeight: '100vh', paddingBottom: '40px' },
  loadingWrapper: { display: 'flex', justifyContent: 'center', marginTop: '100px' },
  hero: { background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', color: '#fff', padding: '50px 24px', textAlign: 'center' },
  heroTitle: { fontSize: '36px', fontWeight: 'bold', margin: '0 0 12px' },
  heroSub: { fontSize: '18px', color: '#ccc', margin: 0 },
  filterBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', flexWrap: 'wrap', gap: '12px' },
  filterLabel: { fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e' },
  select: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', background: '#fff', cursor: 'pointer' },
  resultCount: { padding: '10px 24px', color: '#555', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', padding: '0 24px' },
  card: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  imgWrapper: { position: 'relative', overflow: 'hidden' },
  img: { width: '100%', height: '200px', objectFit: 'cover', display: 'block' },
  lowStock: { position: 'absolute', top: '8px', left: '8px', background: '#ff9800', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  outOfStock: { position: 'absolute', top: '8px', left: '8px', background: '#f44336', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  cardBody: { padding: '14px' },
  cardCategory: { color: '#e94560', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 4px' },
  cardTitle: { fontSize: '15px', fontWeight: '600', color: '#1a1a2e', textDecoration: 'none', display: 'block', marginBottom: '6px', lineHeight: '1.3' },
  stars: { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' },
  starText: { color: '#ff9800', fontSize: '14px' },
  reviewCount: { color: '#888', fontSize: '12px' },
  priceRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
  price: { fontSize: '20px', fontWeight: 'bold', color: '#1a1a2e' },
  originalPrice: { fontSize: '13px', color: '#999', textDecoration: 'line-through' },
  discount: { fontSize: '12px', color: '#4caf50', fontWeight: 'bold' },
  delivery: { fontSize: '12px', color: '#555', margin: '4px 0 10px' },
  addBtn: { width: '100%', padding: '10px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  disabledBtn: { width: '100%', padding: '10px', background: '#ccc', color: '#666', border: 'none', borderRadius: '8px', cursor: 'not-allowed', fontSize: '14px' },
  empty: { textAlign: 'center', padding: '60px', color: '#888' },
};

export default Home;