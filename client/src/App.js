import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductPage from './pages/ProductPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Admin from './pages/Admin';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar
            onCategory={setSelectedCategory}
            onSearch={setSearchQuery}
          />
          <div style={{ minHeight: '90vh', background: '#f5f5f5' }}>
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                    onCategory={setSelectedCategory}
                  />
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
          <Footer />  
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;