import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import Stars from '../components/Stars';
import { CATEGORIES, REVIEWS } from '../data/data';
import { useAdmin } from '../context/AdminContext';

function HomePage() {
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

  const featured = safeProducts.slice(0, 4);
  const bestSellers = safeProducts.filter(p => p?.badge === "Eng Ko'p Sotilgan" || p?.rating >= 4.8);
  const kitchenProducts = safeProducts.filter(p => p?.category === "Oshxona Mebellari").slice(0, 4);
  const officeProducts = safeProducts.filter(p => p?.category === "Ofis Mebellari").slice(0, 4);

  return (
    <div>
      <HeroSection />

      {/* Kategoriyalar Qismi */}
      <div className="bg-white py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionTitle label="Kategoriyalar" title="Bizning Kolleksiyalar" sub="Uyingizdagi har bir xona uchun maxsus tanlangan mebellar" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            {categoriesWithCount.map(cat => (
              <Link 
                key={cat.name} 
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="rounded-2xl overflow-hidden cursor-pointer relative h-56 md:h-64 transition-transform hover:scale-[1.02] group block"
              >
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/75 to-transparent" />
                <div className="absolute bottom-4 md:bottom-5 left-4 md:left-5">
                  <div className="text-xl md:text-2xl mb-1">{cat.icon}</div>
                  <h3 className="text-white text-sm md:text-base font-serif font-normal mb-0.5">{cat.name}</h3>
                  <p className="text-white/70 text-[10px] md:text-[11px]">{cat.count} ta mahsulot</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tanlangan Mahsulotlar */}
      {safeProducts.length > 0 && (
        <div className="bg-lightBg py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionTitle label="Qo'lda Tanlangan" title="Tanlangan Mahsulotlar" sub="Bu mavsum uchun muharrirlarimiz tanlovi" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="text-center mt-10 md:mt-12">
              <Link 
                to="/products"
                className="inline-block bg-transparent border-2 border-dark rounded-full px-8 md:px-10 py-3 md:py-3.5 text-[12px] md:text-[13px] font-bold cursor-pointer tracking-[0.08em] uppercase text-dark transition-all hover:bg-dark hover:text-white"
              >
                Barcha Mahsulotlarni Ko'rish
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Oshxona Mebellari Bo'limi */}
      {kitchenProducts.length > 0 && (
        <div className="bg-white py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionTitle label="Oshxona Uchun" title="Oshxona Mebellari" sub="Zamonaviy va funksional oshxona mebellari" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
              {kitchenProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* Maxsus Taklif Banner */}
      <div className="bg-dark py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-15 items-center">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-accent mb-4">Cheklangan Vaqt Taklifi</p>
            <h2 className="text-2xl md:text-[clamp(28px,3.5vw,48px)] font-serif font-normal text-white mb-4 md:mb-5 leading-tight">
              Yumshoq Mebellarda<br />30% gacha Chegirma
            </h2>
            <p className="text-white/60 leading-relaxed text-sm md:text-base mb-6 md:mb-8">Bu mavsumda yashash xonangizni o'zgartiring. Ajoyib narxlarda qo'lda ishlangan divanlarning tanlangan kolleksiyasini ko'ring.</p>
            <Link 
              to="/products"
              className="inline-block bg-accent text-white border-none rounded-full px-6 md:px-8 py-3 md:py-3.5 text-[12px] md:text-[13px] font-bold cursor-pointer tracking-[0.06em] uppercase hover:bg-accent-dark transition-all"
            >
              Hoziroq Xarid Qiling
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden h-64 md:h-90">
            <img 
              src="https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800&q=80" 
              alt="divan taklifi" 
              className="w-full h-full object-cover opacity-85" 
            />
          </div>
        </div>
      </div>

      {/* Eng Ko'p Sotilganlar */}
      {bestSellers.length > 0 && (
        <div className="bg-white py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionTitle label="Eng Yuqori Reyting" title="Eng Ko'p Sotilganlar" sub="Mijozlarimiz sevishdan to'xtamaydigan buyumlar" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
              {bestSellers.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* Ofis Mebellari Bo'limi */}
      {officeProducts.length > 0 && (
        <div className="bg-lightBg py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionTitle label="Ofis Uchun" title="Ofis Mebellari" sub="Samarali ishlash uchun zamonaviy ofis mebellari" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
              {officeProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* Mijozlar Fikrlari */}
      <div className="bg-[#f9f5ef] py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionTitle label="Mijozlar Fikrlari" title="Mijozlarimiz Nima Deydi?" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 md:p-8 shadow-md">
                <Stars rating={r.rating} />
                <p className="text-sm md:text-base text-gray-600 leading-relaxed my-4 md:my-5 italic">"{r.text}"</p>
                <div className="flex items-center gap-3 md:gap-3.5">
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-accent text-white flex items-center justify-center text-xs md:text-sm font-bold">{r.avatar}</div>
                  <div>
                    <div className="font-semibold text-dark text-sm md:text-[15px]">{r.name}</div>
                    <div className="text-[10px] md:text-xs text-gray-400">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Axborotnoma */}
      <div className="bg-accent py-12 md:py-20 px-4 md:px-8 text-center">
        <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/80 mb-3 md:mb-4">Yangiliklardan Xabardor Bo'ling</p>
        <h2 className="text-xl md:text-[clamp(24px,3vw,40px)] font-serif font-normal text-white mb-3 md:mb-4">Axborotnomaning Obuna Bo'ling</h2>
        <p className="text-white/80 text-sm md:text-base mb-6 md:mb-9">Dizayn ilhomi, yangi mahsulotlar va eksklyuziv takliflarni pochtangizda oling.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <input 
            placeholder="Email manzilingiz" 
            className="border-none rounded-full py-3 md:py-3.5 px-5 md:px-7 text-sm md:text-[15px] w-[250px] md:w-[300px] outline-none font-sans" 
          />
          <button className="bg-dark text-white border-none rounded-full px-6 md:px-8 py-3 md:py-3.5 text-xs md:text-sm font-bold cursor-pointer tracking-[0.06em]">
            Obuna Bo'lish
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;