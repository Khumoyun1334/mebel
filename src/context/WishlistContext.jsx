import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // LocalStorage dan yuklash
  useEffect(() => {
    try {
      const saved = localStorage.getItem("luxehome_wishlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
          console.log("💖 Wishlist yuklandi:", parsed.length);
        }
      }
    } catch (error) {
      console.error("Wishlistni yuklashda xatolik:", error);
      localStorage.removeItem("luxehome_wishlist");
    }
  }, []);

  // LocalStorage ga saqlash - xatolikni ushlash
  useEffect(() => {
    try {
      if (wishlist.length === 0) {
        localStorage.removeItem("luxehome_wishlist");
      } else {
        localStorage.setItem("luxehome_wishlist", JSON.stringify(wishlist));
        console.log("💾 Wishlist saqlandi:", wishlist.length);
      }
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.error("❌ Wishlist to'lib qolgan!");
        localStorage.clear();
        setWishlist([]);
        alert(
          "Wishlist to'lib qolgan! Iltimos, sahifani yangilang va qayta urinib ko'ring.",
        );
      } else {
        console.error("Wishlistni saqlashda xatolik:", error);
      }
    }
  }, [wishlist]);

  const toggleWishlist = (product) => {
    if (!product || !product.id) return;

    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const hasInWishlist = (id) => {
    if (!id) return false;
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
