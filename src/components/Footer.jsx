import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const navLinks = [
    { label: "Bosh Sahifa", path: "/" },
    { label: "Mahsulotlar", path: "/products" },
    { label: "Kategoriyalar", path: "/categories" },
    { label: "Biz Haqimizda", path: "/about" },
    { label: "Bog'lanish", path: "/contact" }
  ];
  
  const collections = ["Oshxona Mebellari", "Yotoqxona Mebellari", "Mehmonxona Mebellari", "Yumshoq Mebellar", "Ofis Mebellari"];
  const support = ["Ko'p So'raladigan Savollar", "Yetkazib Berish", "Qaytarish", "Kafolat"];
  
  return (
    <footer className="bg-black pt-12 md:pt-16 px-4 md:px-8 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          <div>
            <div className="text-lg md:text-[22px] font-bold font-serif text-white mb-4">
              Luxe<span className="text-accent">Home</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-xs md:text-sm max-w-[280px]">
              Ajoyib uylar uchun tanlangan mebel. Har bir buyumda sifat, go'zallik va mahorat.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-[11px] md:text-[13px] font-bold tracking-[0.1em] uppercase mb-4 md:mb-5">Tez Havolalar</h4>
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path}
                className="block text-gray-600 text-xs md:text-sm mb-2 md:mb-2.5 cursor-pointer transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div>
            <h4 className="text-white text-[11px] md:text-[13px] font-bold tracking-[0.1em] uppercase mb-4 md:mb-5">Kolleksiyalar</h4>
            {collections.map(cat => (
              <Link 
                key={cat} 
                to="/products"
                className="block text-gray-600 text-xs md:text-sm mb-2 md:mb-2.5 cursor-pointer transition-colors hover:text-accent"
              >
                {cat}
              </Link>
            ))}
          </div>
          
          <div>
            <h4 className="text-white text-[11px] md:text-[13px] font-bold tracking-[0.1em] uppercase mb-4 md:mb-5">Qo'llab-quvvatlash</h4>
            {support.map(item => (
              <div key={item} className="text-gray-600 text-xs md:text-sm mb-2 md:mb-2.5 cursor-pointer transition-colors hover:text-accent">
                {item}
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-5 md:pt-6 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-gray-700 text-[10px] md:text-xs">© 2025 LuxeHome. Barcha huquqlar himoyalangan.</p>
          <p className="text-gray-700 text-[10px] md:text-xs">Go'zal uylar uchun mehr bilan yaratilgan.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;