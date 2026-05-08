import React, { createContext, useContext, useState } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  
  const toggleWishlist = (product) => {
    setWishlist(prev => 
      prev.find(i => i.id === product.id) 
        ? prev.filter(i => i.id !== product.id) 
        : [...prev, product]
    );
  };
  
  const hasInWishlist = (id) => wishlist.some(i => i.id === id);
  const count = wishlist.length;
  
  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, hasInWishlist, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);