import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

function Navbar({ page, setPage }) {
  const { count } = useCart();
  const { count: wCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = ["Bosh Sahifa", "Mahsulotlar", "Kategoriyalar", "Biz Haqimizda", "Bog'lanish"];
  const pageMap = {
    "Bosh Sahifa": "Home",
    "Mahsulotlar": "Products",
    "Kategoriyalar": "Categories",
    "Biz Haqimizda": "About",
    "Bog'lanish": "Contact"
  };

  const getPageKey = (currentPage) => {
    const entry = Object.entries(pageMap).find(([_, v]) => v === currentPage);
    return entry ? entry[0] : "Bosh Sahifa";
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQ(value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQ) {
      setPage("Products");
      setSearchOpen(false);
      setSearchQ("");
    }
  };

  const navBg = scrolled ? "bg-lightBg/97" : "bg-lightBg/85";

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] backdrop-blur-xl transition-all duration-300 border-b ${scrolled ? "border-accent/15" : "border-transparent"} ${navBg}`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center h-[72px] gap-10">
          <div onClick={() => setPage("Home")} className="text-[22px] font-bold font-serif text-dark cursor-pointer tracking-[-0.03em]">
            Luxe<span className="text-accent">Home</span>
          </div>
          
          <div className="desktop-nav flex gap-8 flex-1 justify-center">
            {navLinks.map(l => (
              <button
                key={l}
                onClick={() => setPage(pageMap[l])}
                className={`bg-transparent border-none text-[13px] font-medium cursor-pointer tracking-[0.06em] uppercase relative py-1 transition-colors ${
                  page === pageMap[l] ? "text-accent" : "text-gray-600 hover:text-accent"
                }`}
              >
                {l}
                {page === pageMap[l] && <span className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-accent rounded-full" />}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(!searchOpen)} className="bg-transparent border-none cursor-pointer p-1 text-gray-600 flex">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            
            <button onClick={() => setPage("Wishlist")} className="bg-transparent border-none cursor-pointer p-1 text-gray-600 flex relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {wCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wCount}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setPage("Cart")}
              className="bg-dark border-none cursor-pointer px-5 py-2 rounded-full text-white flex items-center gap-2 text-[13px] font-semibold transition-all hover:bg-accent"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Savat {count > 0 && `(${count})`}
            </button>
            
            <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-toggle bg-transparent border-none cursor-pointer p-1 text-dark hidden">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        
        {searchOpen && (
          <div className="border-t border-accent/15 py-3 px-8 bg-lightBg/98">
            <input
              autoFocus
              value={searchQ}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit}
              placeholder="Mebel, kategoriyalarni qidirish..."
              className="w-full max-w-[500px] border-none border-b-2 border-accent outline-none text-base py-2 bg-transparent text-dark font-sans"
            />
          </div>
        )}
      </nav>
      
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] bg-lightBg pt-20 flex flex-col gap-1 px-8 py-24">
          {navLinks.map(l => (
            <button
              key={l}
              onClick={() => { setPage(pageMap[l]); setMobileOpen(false); }}
              className="bg-transparent border-none text-left text-2xl font-medium text-dark cursor-pointer py-3 border-b border-black/6 font-serif"
            >
              {l}
            </button>
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