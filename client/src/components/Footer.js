import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      {/* Newsletter */}
      <div style={styles.newsletter}>
        <h3 style={styles.newsletterTitle}>📧 Subscribe to our Newsletter</h3>
        <p style={styles.newsletterSub}>Get exclusive deals and offers directly in your inbox!</p>
        <div style={styles.newsletterForm}>
          <input placeholder="Enter your email address" style={styles.newsletterInput} />
          <button style={styles.newsletterBtn}>Subscribe</button>
        </div>
      </div>

      {/* Main Footer */}
      <div style={styles.mainFooter}>
        {/* Brand */}
        <div style={styles.footerCol}>
          <h2 style={styles.brand}>🛒 Cartify</h2>
          <p style={styles.brandDesc}>Your one-stop destination for all your shopping needs. Best prices guaranteed!</p>
          <div style={styles.socialLinks}>
            <a href="#" style={styles.socialBtn}>📘</a>
            <a href="#" style={styles.socialBtn}>📸</a>
            <a href="#" style={styles.socialBtn}>🐦</a>
            <a href="#" style={styles.socialBtn}>▶️</a>
          </div>
        </div>

        {/* Quick Links */}
        <div style={styles.footerCol}>
          <h4 style={styles.colTitle}>Quick Links</h4>
          <div style={styles.linkList}>
            <Link to="/" style={styles.footerLink}>🏠 Home</Link>
            <Link to="/" style={styles.footerLink}>📱 Electronics</Link>
            <Link to="/" style={styles.footerLink}>👕 Clothing</Link>
            <Link to="/" style={styles.footerLink}>👟 Shoes</Link>
            <Link to="/" style={styles.footerLink}>📚 Books</Link>
            <Link to="/" style={styles.footerLink}>⚽ Sports</Link>
          </div>
        </div>

        {/* Customer Service */}
        <div style={styles.footerCol}>
          <h4 style={styles.colTitle}>Customer Service</h4>
          <div style={styles.linkList}>
            <Link to="/orders" style={styles.footerLink}>📦 My Orders</Link>
            <Link to="/cart" style={styles.footerLink}>🛒 My Cart</Link>
            <a href="#" style={styles.footerLink}>🔄 Returns & Refunds</a>
            <a href="#" style={styles.footerLink}>🚚 Track Order</a>
            <a href="#" style={styles.footerLink}>❓ FAQs</a>
            <a href="#" style={styles.footerLink}>📞 Contact Us</a>
          </div>
        </div>

        {/* Contact Info */}
        <div style={styles.footerCol}>
          <h4 style={styles.colTitle}>Contact Us</h4>
          <div style={styles.linkList}>
            <p style={styles.contactItem}>📍 123 MG Road, Bangalore, Karnataka 560001</p>
            <p style={styles.contactItem}>📞 +91 98765 43210</p>
            <p style={styles.contactItem}>📧 support@cartify.com</p>
            <p style={styles.contactItem}>🕐 Mon-Sat: 9AM - 6PM</p>
          </div>
        </div>
      </div>

      {/* Payment Icons */}
      <div style={styles.paymentSection}>
        <p style={styles.paymentTitle}>We Accept</p>
        <div style={styles.paymentIcons}>
          {['💳 Visa', '💳 Mastercard', '📱 UPI', '💰 PayTM', '🏦 NetBanking', '💵 COD'].map(p => (
            <span key={p} style={styles.paymentBadge}>{p}</span>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={styles.bottomBar}>
        <p style={styles.copyright}>© 2024 Cartify. All rights reserved. Made with ❤️ in India</p>
        <div style={styles.bottomLinks}>
          <a href="#" style={styles.bottomLink}>Privacy Policy</a>
          <a href="#" style={styles.bottomLink}>Terms of Service</a>
          <a href="#" style={styles.bottomLink}>Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: { background: '#1a1a2e', color: '#fff', marginTop: '40px' },
  newsletter: { background: '#e94560', padding: '32px 24px', textAlign: 'center' },
  newsletterTitle: { margin: '0 0 8px', fontSize: '22px' },
  newsletterSub: { margin: '0 0 16px', color: 'rgba(255,255,255,0.85)', fontSize: '14px' },
  newsletterForm: { display: 'flex', maxWidth: '480px', margin: '0 auto', gap: '0' },
  newsletterInput: { flex: 1, padding: '12px 16px', border: 'none', borderRadius: '8px 0 0 8px', fontSize: '14px', outline: 'none' },
  newsletterBtn: { padding: '12px 24px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '0 8px 8px 0', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  mainFooter: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', padding: '48px 40px' },
  footerCol: {},
  brand: { color: '#e94560', margin: '0 0 12px', fontSize: '22px' },
  brandDesc: { color: '#aaa', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' },
  socialLinks: { display: 'flex', gap: '10px' },
  socialBtn: { fontSize: '24px', textDecoration: 'none', background: '#16213e', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  colTitle: { color: '#e94560', margin: '0 0 16px', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px' },
  linkList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  footerLink: { color: '#aaa', textDecoration: 'none', fontSize: '13px' },
  contactItem: { color: '#aaa', fontSize: '13px', margin: 0 },
  paymentSection: { borderTop: '1px solid #16213e', padding: '20px 40px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  paymentTitle: { color: '#aaa', fontSize: '13px', margin: 0 },
  paymentIcons: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  paymentBadge: { background: '#16213e', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontSize: '12px' },
  bottomBar: { background: '#0f0f1a', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  copyright: { color: '#666', fontSize: '13px', margin: 0 },
  bottomLinks: { display: 'flex', gap: '20px' },
  bottomLink: { color: '#666', textDecoration: 'none', fontSize: '13px' },
};

export default Footer;