import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

const MAX_WISHLIST_ITEMS = 30;

// Rasm URL ni qisqartirish funksiyasi
const compressImageUrl = (url) => {
  if (!url) return "";
  if (url.includes("unsplash.com")) {
    return url.split("?")[0];
  }
  if (url.length > 100) {
    return url.substring(0, 100);
  }
  return url;
};

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("luxehome_wishlist");
      if (saved && saved.length < 500000) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      } else if (saved && saved.length >= 500000) {
        localStorage.removeItem("luxehome_wishlist");
      }
    } catch (error) {
      console.error("LocalStorage dan o'qishda xatolik:", error);
      localStorage.removeItem("luxehome_wishlist");
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    try {
      if (wishlist.length === 0) {
        localStorage.removeItem("luxehome_wishlist");
      } else {
        const cleanWishlist = wishlist.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          img: compressImageUrl(item.img),
          category: item.category,
        }));
        localStorage.setItem(
          "luxehome_wishlist",
          JSON.stringify(cleanWishlist),
        );
      }
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        localStorage.removeItem("luxehome_wishlist");
      }
    }
  }, [wishlist, isInitialized]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        if (prev.length >= MAX_WISHLIST_ITEMS) {
          alert(
            `Istaklar ro'yxatida maksimal ${MAX_WISHLIST_ITEMS} ta mahsulot bo'lishi mumkin!`,
          );
          return prev;
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            img: compressImageUrl(product.img),
            category: product.category,
          },
        ];
      }
    });
  };

  const hasInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  const count = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, hasInWishlist, count }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
