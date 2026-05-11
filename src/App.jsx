import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { useAdminShortcut } from './hooks/useAdminShortcut';
import { supabase } from './services/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminModal from './components/AdminModal';
import AdminPanel from './context/AdminPanel';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

// ============ SCROLL TO TOP KOMPONENTI ============
// Bu komponent sahifa o'zgarganda scroll ni yuqoriga chiqaradi
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Sahifa o'zgarganda darhol scroll ni 0 ga tushirish
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}
// ============ SCROLL TO TOP KOMPONENTI TUGADI ============

function AppContent() {
  const { showAdminModal, setShowAdminModal, isAdmin, loading } = useAdmin();
  useAdminShortcut();

  const testConnection = async () => {
    try {
      console.log('🔍 Supabase ulanishi tekshirilmoqda...');
      console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Bor' : '❌ Yoq');
      
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log('❌ Supabase xatolik:', error.message);
      } else {
        console.log('✅ Supabase ga muvaffaqiyatli ulandi!');
        console.log('📦 Mahsulotlar soni:', count);
      }
    } catch (err) {
      console.log('❌ Xatolik:', err.message);
    }
  };

  // testConnection ni ishga tushirish
  useEffect(() => {
    testConnection();
  }, []);



  return (
    <div className="font-serif bg-lightBg min-h-screen flex flex-col">
      <ScrollToTop /> {/* Scroll ni yuqoriga chiqarish komponenti */}
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />

      {showAdminModal && <AdminModal onClose={() => setShowAdminModal(false)} />}
      {isAdmin && <AdminPanel onClose={() => setShowAdminModal(false)} />}
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <AdminProvider>
            <AppContent />
          </AdminProvider>
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;