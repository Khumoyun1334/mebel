import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ToastProvider } from "./context/ToastContext";
import { AdminProvider } from "./context/AdminContext";
import { AuthProvider } from "./context/AuthContext";
import { supabase } from "./services/supabase";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { FiTrash2 } from "react-icons/fi";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileOrdersPage from "./pages/ProfileOrdersPage";
import ProfileAddressesPage from "./pages/ProfileAddressesPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [showClearButton, setShowClearButton] = useState(false);

  const testConnection = async () => {
    try {
      console.log("🔍 Supabase ulanishi tekshirilmoqda...");
      const { error, count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      if (error) {
        console.log("❌ Supabase xatolik:", error.message);
      } else {
        console.log("✅ Supabase ga muvaffaqiyatli ulandi!");
        console.log("📦 Mahsulotlar soni:", count);
      }
    } catch (err) {
      console.log("❌ Xatolik:", err.message);
    }
  };

  const handleClearStorage = () => {
    if (
      window.confirm(
        "⚠️ Barcha ma'lumotlar (savat, wishlist) tozalanadi. Davom etasizmi?",
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  useEffect(() => {
    testConnection();

    // LocalStorage hajmini tekshirish
    try {
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const value = localStorage.getItem(localStorage.key(i));
        total += value?.length || 0;
      }
      if (total > 3000000) {
        setShowClearButton(true);
      }
    } catch (e) {
      console.error("Hajmni tekshirishda xatolik:", e);
    }

    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-lightBg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-serif bg-lightBg min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/orders" element={<ProfileOrdersPage />} />
          <Route path="/profile/addresses" element={<ProfileAddressesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />

      {showClearButton && (
        <button
          onClick={handleClearStorage}
          className="fixed bottom-6 right-6 z-[1000] bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 text-sm font-semibold"
        >
          <FiTrash2 size={16} />
          Ma'lumotlarni tozalash
        </button>
      )}
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <AuthProvider>
            <AdminProvider>
              <AppContent />
            </AdminProvider>
          </AuthProvider>
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
