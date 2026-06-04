import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // LocalStorage dan yuklash - hech qanday cheklovsiz
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
          console.log("📦 Savat yuklandi:", parsed.length);
        }
      }
    } catch (error) {
      console.error("Savatni yuklashda xatolik:", error);
      // Xatolik bo'lsa, localStorage ni tozalash
      localStorage.removeItem("cart");
    }
  }, []);

  // LocalStorage ga saqlash
  useEffect(() => {
    try {
      if (cart.length === 0) {
        localStorage.removeItem("cart");
      } else {
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("💾 Savat saqlandi:", cart.length);
      }
    } catch (error) {
      console.error("Savatni saqlashda xatolik:", error);
      if (error.name === "QuotaExceededError") {
        // localStorage to'lib qolgan, tozalash
        localStorage.clear();
        alert("Savat ma'lumotlari tozalandi. Iltimos, sahifani yangilang!");
        window.location.reload();
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
    localStorage.removeItem("cart");
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
