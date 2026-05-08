import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  const [page, setPage] = useState("Home");
  const [detailProduct, setDetailProduct] = useState(null);

  const renderPage = () => {
    switch (page) {
      case "Home": 
        return <HomePage setPage={setPage} setDetailProduct={setDetailProduct} />;
      case "Products": 
        return <ProductsPage setPage={setPage} setDetailProduct={setDetailProduct} />;
      case "Detail": 
        return detailProduct ? <ProductDetailPage product={detailProduct} setPage={setPage} /> : <ProductsPage setPage={setPage} setDetailProduct={setDetailProduct} />;
      case "Categories": 
        return <CategoriesPage setPage={setPage} />;
      case "Cart": 
        return <CartPage setPage={setPage} />;
      case "Wishlist": 
        return <WishlistPage setPage={setPage} setDetailProduct={setDetailProduct} />;
      case "About": 
        return <AboutPage setPage={setPage} />;
      case "Contact": 
        return <ContactPage setPage={setPage} />;
      default: 
        return <HomePage setPage={setPage} setDetailProduct={setDetailProduct} />;
    }
  };

  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="font-serif bg-lightBg min-h-screen">
            <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
            <Navbar page={page} setPage={setPage} />
            <main className="transition-opacity duration-300">
              {renderPage()}
            </main>
          </div>
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;