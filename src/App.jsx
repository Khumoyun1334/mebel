import React from 'react';
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
  const { showAdminModal, setShowAdminModal, isAdmin } = useAdmin();
  useAdminShortcut();

  // WebSocket va MetaMask xatolarini suppress qilish
  React.useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && (
        args[0].includes('WebSocket connection failed') ||
        args[0].includes('WebSocket connection to') ||
        args[0].includes('Failed to connect to MetaMask') ||
        args[0].includes('StreamMiddleware')
      )) {
        return;
      }
      originalError.apply(console, args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div className="font-serif bg-lightBg min-h-screen flex flex-col">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      <Navbar />
      <main className="flex-1">
     <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/products" element={<ProductsPage />} />
  <Route path="/product/:id" element={<ProductDetailPage />} />
  <Route path="/categories" element={<CategoriesPage />} /> {/* Kategoriyalar sahifasi */}
  <Route path="/contact" element={<ContactPage />} />        {/* Bog'lanish sahifasi */}
  <Route path="/cart" element={<CartPage />} />
  <Route path="/wishlist" element={<WishlistPage />} />
  <Route path="/about" element={<AboutPage />} />
</Routes>
      </main>
      <Footer />

      {/* Admin Modal */}
      {showAdminModal && <AdminModal onClose={() => setShowAdminModal(false)} />}
      
      {/* Admin Panel */}
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