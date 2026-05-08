import React from 'react';

function Footer({ setPage }) {
  const navLinks = [
    { label: "Bosh Sahifa", page: "Home" },
    { label: "Mahsulotlar", page: "Products" },
    { label: "Kategoriyalar", page: "Categories" },
    { label: "Biz Haqimizda", page: "About" },
    { label: "Bog'lanish", page: "Contact" }
  ];
  
  const collections = ["Yashash Xonasi", "Yotoqxona", "Ovqat Xonasi", "Yoritish"];
  const support = ["Ko'p So'raladigan Savollar", "Yetkazib Berish", "Qaytarish", "Kafolat"];
  
  return (
    <footer className="bg-black pt-16 px-8 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-[22px] font-bold font-serif text-white mb-4">
              Luxe<span className="text-accent">Home</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm max-w-[280px]">
              Ajoyib uylar uchun tanlangan mebel. Har bir buyumda sifat, go'zallik va mahorat.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-[13px] font-bold tracking-[0.1em] uppercase mb-5">Tez Havolalar</h4>
            {navLinks.map(l => (
              <div 
                key={l.label} 
                onClick={() => setPage(l.page)} 
                className="text-gray-600 text-sm mb-2.5 cursor-pointer transition-colors hover:text-accent"
              >
                {l.label}
              </div>
            ))}
          </div>
          
          <div>
            <h4 className="text-white text-[13px] font-bold tracking-[0.1em] uppercase mb-5">Kolleksiyalar</h4>
            {collections.map(l => (
              <div key={l} className="text-gray-600 text-sm mb-2.5 cursor-pointer transition-colors hover:text-accent">
                {l}
              </div>
            ))}
          </div>
          
          <div>
            <h4 className="text-white text-[13px] font-bold tracking-[0.1em] uppercase mb-5">Qo'llab-quvvatlash</h4>
            {support.map(l => (
              <div key={l} className="text-gray-600 text-sm mb-2.5 cursor-pointer transition-colors hover:text-accent">
                {l}
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-700 text-xs">© 2025 LuxeHome. Barcha huquqlar himoyalangan.</p>
          <p className="text-gray-700 text-xs">Yovvoyi uylar uchun mehr bilan yaratilgan.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;