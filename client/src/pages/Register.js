import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px' }}>📝 Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            name="name" placeholder="Full Name"
            value={form.name} onChange={handleChange}
            style={styles.input} required
          />
          <input
            name="email" type="email" placeholder="Email"
            value={form.email} onChange={handleChange}
            style={styles.input} required
          />
          <input
            name="password" type="password" placeholder="Password"
            value={form.password} onChange={handleChange}
            style={styles.input} required
          />
          <button type="submit" style={styles.btn}>Create Account</button>
        </form>
        <p style={{ marginTop: '14px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  card: { background: '#fff', padding: '36px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', width: '360px' },
  input: { display: 'block', width: '100%', padding: '10px 14px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginTop: '6px' },
  error: { color: 'red', marginBottom: '10px', fontSize: '14px' },
};

export default Register;