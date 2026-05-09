import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0e8] to-[#ede8df] flex items-center relative overflow-hidden pt-[72px]">
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-[55%] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85" 
          alt="bosh divan" 
          className="w-full h-full object-cover opacity-90" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0e8] via-[#f5f0e8]/50 to-transparent md:bg-gradient-to-r md:from-[#f5f0e8] md:to-transparent" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
        <div className="max-w-lg md:max-w-xl animate-fadeUp">
          <p className="text-[11px] md:text-xs font-bold tracking-[0.15em] uppercase text-accent mb-4 md:mb-5">
            Premium Mebel Kolleksiyasi 2025
          </p>
          <h1 className="text-3xl md:text-[clamp(42px,6vw,76px)] font-serif font-normal text-dark leading-[1.1] mb-4 md:mb-6 tracking-[-0.02em]">
            Zamonaviy Mebel<br />Sizning<br /><em className="text-accent not-italic">Orzuingizdagi Uy</em>
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 md:mb-10 max-w-md">
            Zamonaviy uy uchun yaratilgan abadiy buyumlarni kashf eting. Hashamatli materiallar, hunarmand sifati, eshikingizgacha yetkazib beriladi.
          </p>
          <div className="flex gap-3 md:gap-4 flex-wrap">
            <Link 
              to="/products"
              className="bg-accent text-white border-none rounded-full px-6 md:px-9 py-3 md:py-4 text-xs md:text-sm font-bold cursor-pointer tracking-[0.06em] uppercase transition-all hover:bg-dark hover:-translate-y-0.5"
            >
              Kolleksiyani Ko'rish
            </Link>
            <Link 
              to="/categories"
              className="bg-transparent text-dark border-2 border-dark rounded-full px-5 md:px-8 py-2.5 md:py-3.5 text-xs md:text-sm font-bold cursor-pointer tracking-[0.06em] uppercase transition-all hover:bg-dark hover:text-white"
            >
              Kategoriyalarni Ko'rish
            </Link>
          </div>
          
          <div className="flex gap-6 md:gap-10 mt-10 md:mt-14">
            {[["500+", "Mahsulotlar"], ["12K+", "Baxtli Mijozlar"], ["15yil", "Tajriba"]].map(([n, l]) => (
              <div key={l}>
                <div className="text-xl md:text-[28px] font-bold font-serif text-dark">{n}</div>
                <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.08em]">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;