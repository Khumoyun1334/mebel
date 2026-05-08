import React from 'react';
import HeroSection from '../components/HeroSection';
import SectionTitle from '../components/SectionTitle';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import Stars from '../components/Stars';
import { PRODUCTS, CATEGORIES, REVIEWS } from '../data/data';

function HomePage({ setPage, setDetailProduct }) {
  const featured = PRODUCTS.slice(0, 4);
  const bestSellers = PRODUCTS.filter(p => p.badge === "Eng Ko'p Sotilgan" || p.rating >= 4.8);

  return (
    <div>
      <HeroSection setPage={setPage} />

      {/* Kategoriyalar Qismi */}
      <div className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <SectionTitle label="Ko'rish" title="Bizning Kolleksiyalar" sub="Uyingizdagi har bir xona uchun kuratsiyalangan kategoriyalar" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map(cat => (
              <div 
                key={cat.name} 
                onClick={() => setPage("Categories")} 
                className="rounded-2xl overflow-hidden cursor-pointer relative h-80 transition-transform hover:scale-[1.02]"
              >
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/75 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white text-xl font-serif font-normal mb-1">{cat.name}</h3>
                  <p className="text-white/70 text-[13px]">{cat.count} buyum</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tanlangan Mahsulotlar */}
      <div className="bg-lightBg py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <SectionTitle label="Qo'lda Tanlangan" title="Tanlangan Mahsulotlar" sub="Bu mavsum uchun muharrirlarimiz tanlovi" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {featured.map(p => <ProductCard key={p.id} product={p} onView={prod => { setDetailProduct(prod); setPage("Detail"); }} />)}
          </div>
          <div className="text-center mt-12">
            <button 
              onClick={() => setPage("Products")}
              className="bg-transparent border-2 border-dark rounded-full px-10 py-3.5 text-[13px] font-bold cursor-pointer tracking-[0.08em] uppercase text-dark transition-all hover:bg-dark hover:text-white"
            >
              Barcha Mahsulotlarni Ko'rish
            </button>
          </div>
        </div>
      </div>

      {/* Maxsus Taklif Banner */}
      <div className="bg-dark py-20 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-15 items-center">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-accent mb-4">Cheklangan Vaqt Taklifi</p>
            <h2 className="text-[clamp(28px,3.5vw,48px)] font-serif font-normal text-white mb-5 leading-tight">
              Premium Divanlarda<br />30% gacha Chegirma
            </h2>
            <p className="text-white/60 leading-relaxed mb-8">Bu mavsumda yashash xonangizni o'zgartiring. Ajoyib narxlarda qo'lda ishlangan divanlarning tanlangan kolleksiyasini ko'ring.</p>
            <button 
              onClick={() => setPage("Products")}
              className="bg-accent text-white border-none rounded-full px-8 py-3.5 text-[13px] font-bold cursor-pointer tracking-[0.06em] uppercase"
            >
              Hoziroq Xarid Qiling
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden h-90">
            <img 
              src="https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800&q=80" 
              alt="divan taklifi" 
              className="w-full h-full object-cover opacity-85" 
            />
          </div>
        </div>
      </div>

      {/* Eng Ko'p Sotilganlar */}
      <div className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <SectionTitle label="Eng Yuqori Reyting" title="Eng Ko'p Sotilganlar" sub="Mijozlarimiz sevishdan to'xtamaydigan buyumlar" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {bestSellers.slice(0, 4).map(p => <ProductCard key={p.id} product={p} onView={prod => { setDetailProduct(prod); setPage("Detail"); }} />)}
          </div>
        </div>
      </div>

      {/* Mijozlar Fikrlari */}
      <div className="bg-[#f9f5ef] py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <SectionTitle label="Mijozlar Fikrlari" title="Mijozlarimiz Nima Deydi?" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-md">
                <Stars rating={r.rating} />
                <p className="text-base text-gray-600 leading-relaxed my-5 italic">"{r.text}"</p>
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">{r.avatar}</div>
                  <div>
                    <div className="font-semibold text-dark text-[15px]">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Axborotnoma */}
      <div className="bg-accent py-20 px-8 text-center">
        <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/80 mb-4">Yangiliklardan Xabardor Bo'ling</p>
        <h2 className="text-[clamp(24px,3vw,40px)] font-serif font-normal text-white mb-4">Axborotnomaning Obuna Bo'ling</h2>
        <p className="text-white/80 mb-9">Dizayn ilhomi, yangi mahsulotlar va eksklyuziv takliflarni pochtangizda oling.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <input 
            placeholder="Email manzilingiz" 
            className="border-none rounded-full py-3.5 px-7 text-[15px] w-[300px] outline-none font-sans" 
          />
          <button className="bg-dark text-white border-none rounded-full px-8 py-3.5 text-sm font-bold cursor-pointer tracking-[0.06em]">
            Obuna Bo'lish
          </button>
        </div>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
}

export default HomePage;