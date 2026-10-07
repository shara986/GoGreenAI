import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCart } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cartId, setCartId] = useState(null);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated || !isCustomer) {
      setCartCount(0);
      return;
    }
    try {
      const res = await getCart();
      const cart = res?.data;
      setCartCount(cart?.totalItems ?? 0);
      setCartId(cart?.id ?? null);
    } catch {
      setCartCount(0);
    }
  }, [isAuthenticated, isCustomer]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartCount, cartId, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};

export default CartContext;
