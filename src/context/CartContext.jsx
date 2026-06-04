import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

const MAX_CART_ITEMS = 30;
const MAX_QUANTITY = 10;

// Rasm URL ni qisqartirish funksiyasi
const compressImageUrl = (url) => {
  if (!url) return "";
  // Agar Unsplash rasmi bo'lsa, parametrlarni qisqartirish
  if (url.includes("unsplash.com")) {
    return url.split("?")[0]; // ? dan keyingi parametrlarni olib tashlash
  }
  // URL ni qisqartirish (faqat asosiy qismini saqlash)
  if (url.length > 100) {
    return url.substring(0, 100);
  }
  return url;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("luxehome_cart");
      if (saved && saved.length < 500000) {
        // 500KB dan kichik bo'lsa
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      } else if (saved && saved.length >= 500000) {
        localStorage.removeItem("luxehome_cart");
      }
    } catch (error) {
      console.error("LocalStorage dan o'qishda xatolik:", error);
      localStorage.removeItem("luxehome_cart");
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    try {
      if (cart.length === 0) {
        localStorage.removeItem("luxehome_cart");
      } else {
        // Rasm URL ni qisqartirib saqlash
        const cleanCart = cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: Math.min(item.qty, MAX_QUANTITY),
          img: compressImageUrl(item.img), // Qisqartirilgan rasm URL
          category: item.category,
        }));
        const jsonStr = JSON.stringify(cleanCart);

        if (jsonStr.length < 500000) {
          localStorage.setItem("luxehome_cart", jsonStr);
        } else {
          console.warn("Savat hajmi juda katta");
          localStorage.removeItem("luxehome_cart");
        }
      }
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        localStorage.removeItem("luxehome_cart");
      }
    }
  }, [cart, isInitialized]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        const newQty = existing.qty + qty;
        if (newQty > MAX_QUANTITY) {
          alert(
            `Bir mahsulotdan maksimal ${MAX_QUANTITY} dona qo'shish mumkin!`,
          );
          return prev;
        }
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: newQty } : i,
        );
      }

      if (prev.length >= MAX_CART_ITEMS) {
        alert(
          `Savatda maksimal ${MAX_CART_ITEMS} xil mahsulot bo'lishi mumkin!`,
        );
        return prev;
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: Math.min(qty, MAX_QUANTITY),
          img: compressImageUrl(product.img), // Qisqartirilgan rasm URL
          category: product.category,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }
    if (qty > MAX_QUANTITY) {
      alert(`Maksimal ${MAX_QUANTITY} dona bo'lishi mumkin!`);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("luxehome_cart");
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
