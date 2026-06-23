import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ onCategory, onSearch }) => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleCategory = (cat) => {
    if (onCategory) onCategory(cat);
    navigate('/');
  };

  const categories = [
    { name: 'All', icon: '🏠' },
    { name: 'Electronics', icon: '📱' },
    { name: 'Clothing', icon: '👕' },
    { name: 'Books', icon: '📚' },
    { name: 'Shoes', icon: '👟' },
    { name: 'Beauty', icon: '💄' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Home', icon: '🏡' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.topBar}>
        <Link to="/" style={styles.brand} onClick={() => handleCategory('All')}>🛒 Cartify</Link>

        {!isAuthPage && (
          <div style={styles.searchBar}>
            <input
              placeholder="Search products..."
              value={search}
              onChange={handleSearch}
              style={styles.searchInput}
            />
            <button style={styles.searchBtn}>🔍</button>
          </div>
        )}

        <div style={styles.rightLinks}>
          {user ? (
            <>
              <span style={styles.greeting}>Hello, {user.name.split(' ')[0]}</span>
              {!isAuthPage && <Link to="/orders" style={styles.link}>📋 Orders</Link>}
              {user.isAdmin && !isAuthPage && <Link to="/admin" style={styles.adminLink}>⚙️ Admin</Link>}
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Sign In</Link>
              <Link to="/register" style={styles.registerLink}>Register</Link>
            </>
          )}
          {!isAuthPage && (
            <Link to="/cart" style={styles.cartBtn}>
              🛒 Cart {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
            </Link>
          )}
        </div>
      </div>

      {!isAuthPage && (
        <div style={styles.bottomBar}>
          {categories.map(c => (
            <button key={c.name} onClick={() => handleCategory(c.name)} style={styles.navLink}>
              {c.icon} {c.name === 'Home' ? 'Home & Kitchen' : c.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: { background: '#1a1a2e', position: 'sticky', top: 0, zIndex: 100 },
  topBar: { display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 24px', flexWrap: 'wrap' },
  brand: { color: '#e94560', fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', whiteSpace: 'nowrap' },
  searchBar: { flex: 1, display: 'flex', minWidth: '200px' },
  searchInput: { flex: 1, padding: '10px 16px', border: 'none', borderRadius: '8px 0 0 8px', fontSize: '15px', outline: 'none' },
  searchBtn: { padding: '10px 16px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontSize: '16px' },
  rightLinks: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' },
  greeting: { color: '#ccc', fontSize: '13px' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '14px' },
  adminLink: { color: '#ffd700', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' },
  registerLink: { color: '#fff', textDecoration: 'none', fontSize: '14px', background: '#e94560', padding: '6px 12px', borderRadius: '6px' },
  logoutBtn: { background: 'transparent', color: '#ccc', border: '1px solid #555', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  cartBtn: { color: '#fff', textDecoration: 'none', fontSize: '14px', background: '#e94560', padding: '8px 16px', borderRadius: '8px', position: 'relative', fontWeight: 'bold' },
  badge: { background: '#ffd700', color: '#1a1a2e', borderRadius: '50%', padding: '1px 6px', fontSize: '11px', fontWeight: 'bold', marginLeft: '6px' },
  bottomBar: { background: '#16213e', padding: '8px 24px', display: 'flex', gap: '4px', overflowX: 'auto' },
  navLink: { color: '#ccc', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '6px' },
};

export default Navbar;