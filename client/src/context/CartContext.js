import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );

  const saveCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
    setCartItems(items);
  };

  const addToCart = (product) => {
    const exists = cartItems.find((x) => x._id === product._id);
    let updated;
    if (exists) {
      updated = cartItems.map((x) =>
        x._id === product._id ? { ...x, quantity: x.quantity + 1 } : x
      );
    } else {
      updated = [...cartItems, { ...product, quantity: 1 }];
    }
    saveCart(updated);
  };

  const removeFromCart = (id) => {
    const updated = cartItems.filter((x) => x._id !== id);
    saveCart(updated);
  };

  const updateQty = (id, qty) => {
    const updated = cartItems.map((x) =>
      x._id === id ? { ...x, quantity: qty } : x
    );
    saveCart(updated);
  };

  const clearCart = () => saveCart([]);

  const totalItems = cartItems.reduce((sum, x) => sum + x.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, x) => sum + x.price * x.quantity, 0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems, addToCart, removeFromCart,
        updateQty, clearCart, totalItems, totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);