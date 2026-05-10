import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/data';

function CategoriesPage() {
  const categoryIcons = {
    "Oshxona Mebellari": "🍳",
    "Yotoqxona Mebellari": "🛏️",
    "Mehmonxona Mebellari": "🛋️",
    "Yumshoq Mebellar": "🪑",
    "Ofis Mebellari": "💼"
  };

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="bg-dark mt-10 py-15 px-8 text-center">
        <h1 className="text-[clamp(32px,5vw,56px)] font-serif font-normal text-white">Kolleksiyalar</h1>
        <p className="text-gray-400 text-sm mt-3">Har bir xona uchun mukammal mebelni toping</p>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 py-15">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map(cat => (
            <Link 
              key={cat.name} 
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="rounded-2xl overflow-hidden cursor-pointer relative h-[400px] shadow-lg transition-transform hover:-translate-y-2 group block"
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/40 to-transparent" />
              <div className="absolute bottom-7 left-7 right-7">
                <div className="text-4xl mb-2">{cat.icon}</div>
                <h3 className="text-white text-2xl font-serif font-normal mb-2">{cat.name}</h3>
                <p className="text-white/60 text-sm">{cat.count} ta kuratsiyalangan buyum</p>
                <div className="mt-4 inline-flex items-center gap-2 text-accent text-[13px] font-semibold tracking-[0.06em] group-hover:gap-3 transition-all">
                  KO'RISH →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;