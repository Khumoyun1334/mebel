import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // LocalStorage dan yuklash
  useEffect(() => {
    try {
      const saved = localStorage.getItem("luxehome_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
          console.log("📦 Savat yuklandi:", parsed.length);
        }
      }
    } catch (error) {
      console.error("Savatni yuklashda xatolik:", error);
      localStorage.removeItem("luxehome_cart");
    }
  }, []);

  // LocalStorage ga saqlash - xatolikni ushlash
  useEffect(() => {
    try {
      if (cart.length === 0) {
        localStorage.removeItem("luxehome_cart");
      } else {
        localStorage.setItem("luxehome_cart", JSON.stringify(cart));
        console.log("💾 Savat saqlandi:", cart.length);
      }
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.error("❌ Savat to'lib qolgan!");
        // localStorage ni tozalash va savatni bo'shatish
        localStorage.clear();
        setCart([]);
        alert(
          "Savat to'lib qolgan! Iltimos, sahifani yangilang va qayta urinib ko'ring.",
        );
      } else {
        console.error("Savatni saqlashda xatolik:", error);
      }
    }
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    if (!product || !product.id) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item,
        );
      }
      return [...prev, { ...product, qty: qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: qty } : item)),
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("luxehome_cart");
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

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
