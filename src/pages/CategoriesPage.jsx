import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { CATEGORIES } from '../data/data';

function CategoriesPage() {
  const { products } = useAdmin();
  const safeProducts = products || [];

  // Har bir kategoriyadagi mahsulotlar sonini hisoblash
  const getCategoryCount = (categoryName) => {
    return safeProducts.filter(p => p?.category === categoryName).length;
  };

  // Kategoriyalarni yangilangan sonlar bilan
  const categoriesWithCount = CATEGORIES.map(cat => ({
    ...cat,
    count: getCategoryCount(cat.name)
  }));

  const categoryIcons = {
    "Oshxona Mebellari": "🍳",
    "Yotoqxona Mebellari": "🛏️",
    "Mehmonxona Mebellari": "🛋️",
    "Yumshoq Mebellar": "🪑",
    "Ofis Mebellari": "💼"
  };

  return (
    <div className="min-h-screen bg-lightBg pt-[72px]">
      <div className="bg-dark py-12 md:py-20 px-4 md:px-8 text-center">
        <h1 className="text-3xl md:text-5xl font-serif font-normal text-white">Kolleksiyalar</h1>
        <p className="text-gray-400 text-sm mt-3">Har bir xona uchun mukammal mebelni toping</p>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categoriesWithCount.map(cat => (
            <Link 
              key={cat.name} 
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="rounded-2xl overflow-hidden cursor-pointer relative h-80 md:h-[400px] shadow-lg transition-transform hover:-translate-y-2 group block"
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/40 to-transparent" />
              <div className="absolute bottom-6 md:bottom-7 left-6 md:left-7 right-6 md:right-7">
                <div className="text-3xl md:text-4xl mb-2">{cat.icon}</div>
                <h3 className="text-white text-xl md:text-2xl font-serif font-normal mb-1">{cat.name}</h3>
                <p className="text-white/60 text-xs md:text-sm">{cat.count} ta mahsulot</p>
                <div className="mt-4 inline-flex items-center gap-2 text-accent text-xs md:text-sm font-semibold tracking-[0.06em] group-hover:gap-3 transition-all">
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