import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  // localStorage dan wishlist ni yuklash
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('luxehome_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // wishlist o'zgarganda localStorage ga saqlash
  useEffect(() => {
    localStorage.setItem('luxehome_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const hasInWishlist = (id) => {
    return wishlist.some(item => item.id === id);
  };

  const count = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, hasInWishlist, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);