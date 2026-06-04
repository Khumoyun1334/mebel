import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("furn_cart") || "[]"); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("furn_wishlist") || "[]"); } catch { return []; }
  });
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => { localStorage.setItem("furn_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("furn_wishlist", JSON.stringify(wishlist)); }, [wishlist]);

  const showToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    showToast(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const toggleWishlist = (product) => {
    const isIn = wishlist.some(i => i.id === product.id);
    if (isIn) { 
      setWishlist(prev => prev.filter(i => i.id !== product.id)); 
      showToast("Removed from wishlist", "info"); 
    } else { 
      setWishlist(prev => [...prev, product]); 
      showToast(`${product.name} added to wishlist`); 
    }
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <StoreContext.Provider value={{ 
      cart, wishlist, darkMode, setDarkMode, 
      addToCart, removeFromCart, updateQty, 
      toggleWishlist, cartTotal, cartCount, toasts 
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);