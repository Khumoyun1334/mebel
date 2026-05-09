import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiShoppingCart, FiHeart, FiSearch, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';

function Navbar() {
  const { count } = useCart();
  const { count: wCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [darkMode, setDarkMode] = useState(false);

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
          scrolled ? "shadow-md border-accent/15 " : " border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center h-[72px] gap-4 md:gap-10">
          {/* Logo */}
          <Link to="/" className="cursor-pointer flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white text-base md:text-lg font-serif font-bold">L</span>
            </div>
            <span className={`font-serif text-lg md:text-[22px] font-normal tracking-tight ${darkMode ? "text-white" : "text-dark"}`}>
              Luxe<span className="text-accent">Home</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 lg:gap-8 flex-1 justify-center">
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

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-2 ml-auto">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center bg-cream rounded-full py-1.5 px-3 gap-2">
                <input
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Mahsulot qidirish..."
                  autoFocus
                  className="border-none bg-transparent outline-none text-xs w-28 md:w-40 text-dark"
                />
                <button type="submit" className="bg-transparent border-none cursor-pointer text-gray-400 flex items-center">
                  <FiSearch size={16} />
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="bg-transparent border-none cursor-pointer text-gray-400 flex items-center">
                  <FiX size={16} />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className={`bg-transparent border-none cursor-pointer p-2 flex items-center ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                <FiSearch size={18} />
              </button>
            )}

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

            {/* Admin Button */}
          

            <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden bg-transparent border-none cursor-pointer p-2 flex items-center ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar Expanded */}
        {searchOpen && (
          <div className="border-t border-accent/15 py-3 px-4 md:px-8 bg-lightBg/98">
            <input
              autoFocus
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && searchQ) { handleSearch(e); } }}
              placeholder="Mebel, kategoriyalarni qidirish..."
              className="w-full border-none border-b-2 border-accent outline-none text-base py-2 bg-transparent text-dark font-sans"
            />
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={`fixed inset-0 z-[999] pt-20 flex flex-col gap-1 px-8 py-6 ${darkMode ? "bg-dark" : "bg-lightBg"}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-xl font-medium border-b ${darkMode ? "border-gray-800 text-gray-300" : "border-gray-100 text-dark"} ${
                location.pathname === link.path ? "text-accent" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
       
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}

export default Navbar;