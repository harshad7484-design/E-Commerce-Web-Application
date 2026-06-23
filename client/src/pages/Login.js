import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <h1 style={styles.leftTitle}>🛒 Cartify</h1>
        <p style={styles.leftSub}>Your one-stop shop for everything you love</p>
        <div style={styles.features}>
          {['✅ Millions of products', '🚚 Free delivery over ₹50', '🔒 Secure payments', '⭐ Top rated brands'].map(f => (
            <div key={f} style={styles.feature}>{f}</div>
          ))}
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Sign In</h2>
          <p style={styles.subtitle}>Welcome back to Cartify!</p>

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={styles.input}
                required
              />
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>New to Cartify?</span>
            <span style={styles.dividerLine} />
          </div>

          <Link to="/register" style={styles.registerBtn}>
            Create your Cartify account
          </Link>

          <p style={styles.secureNote}>🔒 Secure & encrypted login</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  left: { flex: 1, background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', color: '#fff', padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  leftTitle: { fontSize: '42px', fontWeight: '800', margin: '0 0 12px', color: '#e94560' },
  leftSub: { fontSize: '18px', color: 'rgba(255,255,255,0.7)', margin: '0 0 48px', lineHeight: '1.6' },
  features: { display: 'flex', flexDirection: 'column', gap: '16px' },
  feature: { fontSize: '16px', color: 'rgba(255,255,255,0.85)', padding: '12px 16px', background: 'rgba(255,255,255,0.07)', borderRadius: '10px', backdropFilter: 'blur(10px)' },
  right: { flex: 1, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' },
  card: { background: '#fff', borderRadius: '20px', padding: '48px 40px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#888', fontSize: '15px', margin: '0 0 28px' },
  errorBox: { background: '#fff0f3', border: '1px solid #ffb3c1', color: '#c62a47', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#444' },
  input: { padding: '13px 16px', borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '15px', outline: 'none', transition: 'border 0.2s', width: '100%', boxSizing: 'border-box' },
  submitBtn: { padding: '14px', background: 'linear-gradient(135deg, #e94560, #c62a47)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', marginTop: '8px', boxShadow: '0 4px 16px rgba(233,69,96,0.3)' },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' },
  dividerLine: { flex: 1, height: '1px', background: '#eee' },
  dividerText: { color: '#aaa', fontSize: '13px', whiteSpace: 'nowrap' },
  registerBtn: { display: 'block', textAlign: 'center', padding: '13px', border: '1.5px solid #e94560', borderRadius: '10px', color: '#e94560', textDecoration: 'none', fontSize: '15px', fontWeight: '600' },
  secureNote: { textAlign: 'center', color: '#bbb', fontSize: '12px', margin: '20px 0 0' },
};

export default Login;