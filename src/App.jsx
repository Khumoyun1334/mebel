import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { useAdminShortcut } from './hooks/useAdminShortcut';
import { supabase } from './services/supabase'; // ← MUHIM! QO'SHILDI
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminModal from './components/AdminModal';
import AdminPanel from './context/AdminPanel'; // ← 'context/AdminPanel' emas, 'components/AdminPanel'

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

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