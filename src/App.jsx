// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { useAdminShortcut } from './hooks/useAdminShortcut';
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

function AppContent() {
  const { showAdminModal, setShowAdminModal, isAdmin, loading } = useAdmin();
  useAdminShortcut();


    useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('count', { count: 'exact', head: true });
        
        if (error) {
          console.log('❌ Supabase ga ulanishda xatolik:', error.message);
        } else {
          console.log('✅ Supabase ga muvaffaqiyatli ulandi!');
          console.log('📦 Mahsulotlar soni:', data);
        }
      } catch (err) {
        console.log('❌ Xatolik:', err.message);
      }
    };
    
    testConnection();
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