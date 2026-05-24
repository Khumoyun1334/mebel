import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import ProfileDropdown from './ProfileDropdown';
import { FiShoppingCart, FiHeart, FiSearch, FiMenu, FiX, FiSun, FiMoon, FiUser } from 'react-icons/fi';

function Navbar() {
  const { count } = useCart();
  const { count: wCount } = useWishlist();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navLinks = [
    { label: "Bosh Sahifa", path: "/" },
    { label: "Mahsulotlar", path: "/products" },
    { label: "Kategoriyalar", path: "/categories" },
    { label: "Biz Haqimizda", path: "/about" },
    { label: "Bog'lanish", path: "/contact" }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQ)}`);
      setSearchOpen(false);
      setSearchQ("");
    }
  };

  const navBg = darkMode ? "#111" : (scrolled ? "rgba(250,249,247,0.97)" : "rgba(250,249,247,0.95)");

  return (
    <>
      <nav
        style={{ background: navBg }}
        className={`fixed top-0 left-0 right-0 z-[1000] backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "shadow-md border-accent/15" : "border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between h-[72px] gap-2">
          
          {/* Logo */}
          <Link to="/" className="cursor-pointer flex items-center gap-1 shrink-0">
            <div className="w-7 h-7 sm:w-8 md:w-9 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white text-sm sm:text-base md:text-lg font-serif font-bold">AZ</span>
            </div>
            <span className={`font-serif text-sm sm:text-base md:text-[22px] font-normal tracking-tight hidden sm:inline-block ${darkMode ? "text-white" : "text-dark"}`}>
              Azizbek<span className="text-accent">Mebellari</span>
            </span>
            <span className={`font-serif text-base font-normal tracking-tight sm:hidden ${darkMode ? "text-white" : "text-dark"}`}>
              AZ<span className="text-accent">M</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-6 xl:gap-8 flex-1 justify-center">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium cursor-pointer no-underline tracking-wide relative pb-0.5 transition-colors ${
                  location.pathname === link.path ? "text-accent" : darkMode ? "text-gray-300 hover:text-accent" : "text-gray-600 hover:text-accent"
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <div className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-1 md:gap-2">
            {/* Qidiruv tugmasi - Desktop */}
            <button onClick={() => setSearchOpen(!searchOpen)} className={`bg-transparent border-none cursor-pointer p-2 flex items-center ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
              <FiSearch size={18} />
            </button>

            <button onClick={() => setDarkMode(!darkMode)} className={`bg-transparent border-none cursor-pointer p-2 flex items-center ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <Link to="/wishlist" className={`bg-transparent border-none cursor-pointer p-2 flex relative items-center ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
              <FiHeart size={20} />
              {wCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold">
                  {wCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="bg-dark border-none cursor-pointer text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full flex items-center gap-1 md:gap-2 text-[11px] md:text-xs font-semibold font-serif hover:bg-accent transition-all">
              <FiShoppingCart size={14} />
              <span className="hidden sm:inline">Savat</span>
              {count > 0 && (
                <span className="bg-white text-dark rounded-full w-[18px] h-[18px] text-[10px] flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <ProfileDropdown />
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-transparent border border-accent text-accent px-3 py-1.5 rounded-full text-sm font-semibold hover:bg-accent hover:text-white transition-all flex items-center gap-1"
              >
                <FiUser size={14} />
                Kirish
              </button>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-1">
            {/* Qidiruv tugmasi - Mobil/Tablet */}
            <button onClick={() => setSearchOpen(!searchOpen)} className={`bg-transparent border-none cursor-pointer p-2 flex items-center ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
              <FiSearch size={18} />
            </button>

            <Link to="/wishlist" className="relative p-2">
              <FiHeart size={18} className={darkMode ? "text-gray-300" : "text-gray-500"} />
              {wCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold">
                  {wCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2">
              <FiShoppingCart size={18} className={darkMode ? "text-gray-300" : "text-gray-500"} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className={`bg-transparent border-none cursor-pointer p-2 flex items-center ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Qidiruv paneli - Desktop uchun (yuqori qatorda) */}
        {searchOpen && (
          <div className="hidden lg:block border-t border-accent/15 py-3 px-4 bg-lightBg/98">
            <div className="max-w-7xl mx-auto">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Mahsulot qidirish... (Masalan: divan, oshxona, yotoqxona, stol)"
                    autoFocus
                    className="w-full border border-gray-200 rounded-full py-3 pl-12 pr-4 text-base outline-none focus:border-accent bg-white"
                  />
                </div>
                <button type="submit" className="bg-accent text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-accent-dark transition-all">
                  Qidirish
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-dark p-2">
                  <FiX size={20} />
                </button>
              </form>
              <div className="flex gap-3 mt-3 flex-wrap">
                <span className="text-xs text-gray-400">Mashhur qidiruvlar:</span>
                <button onClick={() => { setSearchQ("divan"); setSearchOpen(false); navigate("/products?q=divan"); }} className="text-xs text-accent hover:underline">divan</button>
                <button onClick={() => { setSearchQ("oshxona"); setSearchOpen(false); navigate("/products?q=oshxona"); }} className="text-xs text-accent hover:underline">oshxona</button>
                <button onClick={() => { setSearchQ("yotoqxona"); setSearchOpen(false); navigate("/products?q=yotoqxona"); }} className="text-xs text-accent hover:underline">yotoqxona</button>
                <button onClick={() => { setSearchQ("stol"); setSearchOpen(false); navigate("/products?q=stol"); }} className="text-xs text-accent hover:underline">stol</button>
                <button onClick={() => { setSearchQ("kreslo"); setSearchOpen(false); navigate("/products?q=kreslo"); }} className="text-xs text-accent hover:underline">kreslo</button>
              </div>
            </div>
          </div>
        )}

        {/* Qidiruv paneli - Mobil/Tablet uchun (alohida pastga ochiladi) */}
        {searchOpen && (
          <div className="lg:hidden border-t border-accent/15 py-3 px-3 bg-lightBg/98">
            <form onSubmit={handleSearch} className="flex flex-col gap-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Mahsulot qidirish..."
                  autoFocus
                  className="w-full border border-gray-200 rounded-full py-2 pl-10 pr-3 text-sm outline-none focus:border-accent bg-white"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-accent text-white px-3 py-2 rounded-full text-sm font-semibold">
                  Qidirish
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="border border-gray-300 text-gray-500 px-3 py-2 rounded-full text-sm">
                  Bekor qilish
                </button>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-xs text-gray-400">Mashhur:</span>
                <button onClick={() => { setSearchQ("divan"); setSearchOpen(false); navigate("/products?q=divan"); }} className="text-xs text-accent hover:underline">divan</button>
                <button onClick={() => { setSearchQ("oshxona"); setSearchOpen(false); navigate("/products?q=oshxona"); }} className="text-xs text-accent hover:underline">oshxona</button>
                <button onClick={() => { setSearchQ("yotoqxona"); setSearchOpen(false); navigate("/products?q=yotoqxona"); }} className="text-xs text-accent hover:underline">yotoqxona</button>
              </div>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={`fixed top-[72px] left-0 right-0 z-[999] flex flex-col ${darkMode ? "bg-dark" : "bg-white"} shadow-xl animate-slideDown max-h-[calc(100vh-72px)] overflow-y-auto`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 px-4 text-base font-medium border-b ${darkMode ? "border-gray-800 text-gray-300 hover:bg-gray-800/50" : "border-gray-100 text-dark hover:bg-gray-50"} ${
                location.pathname === link.path ? "text-accent" : ""
              } transition-colors`}
            >
              {link.label}
            </Link>
          ))}

          <div className={`py-2 border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
            <Link
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 py-3 px-4 text-base font-medium ${darkMode ? "text-gray-300" : "text-dark"} transition-colors`}
            >
              <FiHeart size={18} />
              Istaklar Ro'yxati
              {wCount > 0 && (
                <span className="bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center ml-auto">
                  {wCount}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 py-3 px-4 text-base font-medium ${darkMode ? "text-gray-300" : "text-dark"} transition-colors`}
            >
              <FiUser size={18} />
              Shaxsiy kabinet
            </Link>

            <button
              onClick={() => { setDarkMode(!darkMode); setMobileOpen(false); }}
              className={`flex items-center gap-3 py-3 px-4 text-base font-medium w-full text-left ${darkMode ? "text-gray-300 hover:bg-gray-800/50" : "text-dark hover:bg-gray-50"} transition-colors`}
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              {darkMode ? "Yorug' rejim" : "Tungi rejim"}
            </button>

            {!user && (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setMobileOpen(false);
                }}
                className={`flex items-center gap-3 py-3 px-4 text-base font-medium w-full text-left ${darkMode ? "text-gray-300 hover:bg-gray-800/50" : "text-dark hover:bg-gray-50"} transition-colors`}
              >
                <FiUser size={18} />
                Kirish
              </button>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease;
        }
      `}</style>
    </>
  );
}

export default Navbar;