import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loadingCart, setLoadingCart] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
      setLoadingCart(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoadingCart(true);
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoadingCart(false);
    }
  };

  const syncCartWithBackend = async (newItems) => {
    try {
      const { data } = await api.put('/cart', { items: newItems });
      setCart(data);
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  const addToCart = async (product, defaultQuantity = 1) => {
    if (!user) return alert('Please login to add items to cart');

    const existingItem = cart.items.find(item => item.product._id === product._id);
    let newItems;
    if (existingItem) {
      if (existingItem.quantity + defaultQuantity > product.stock) {
        return alert(`Cannot add more. Only ${product.stock} in stock.`);
      }
      newItems = cart.items.map(item =>
        item.product._id === product._id ? { product: item.product._id, quantity: item.quantity + defaultQuantity } : { product: item.product._id, quantity: item.quantity }
      );
    } else {
      newItems = [...cart.items.map(i => ({ product: i.product._id, quantity: i.quantity })), { product: product._id, quantity: defaultQuantity }];
    }

    await syncCartWithBackend(newItems);
  };

  const removeFromCart = async (productId) => {
    const newItems = cart.items
      .filter(item => item.product._id !== productId)
      .map(item => ({ product: item.product._id, quantity: item.quantity }));
      
    await syncCartWithBackend(newItems);
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    
    const item = cart.items.find(item => item.product._id === productId);
    if(item && quantity > item.product.stock) {
      return alert(`Cannot add more. Only ${item.product.stock} in stock.`);
    }

    const newItems = cart.items.map(item =>
      item.product._id === productId ? { product: item.product._id, quantity } : { product: item.product._id, quantity: item.quantity }
    );
    await syncCartWithBackend(newItems);
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart({ items: [] });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loadingCart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
