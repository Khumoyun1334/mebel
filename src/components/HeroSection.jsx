import React from 'react';

function HeroSection({ setPage }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0e8] to-[#ede8df] flex items-center relative overflow-hidden pt-[72px]">
      <div className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85" 
          alt="bosh divan" 
          className="w-full h-full object-cover opacity-90" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0e8] to-transparent" />
      </div>
      
      <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
        <div className="max-w-[560px] animate-fadeUp">
          <p className="text-[12px] font-bold tracking-[0.15em] uppercase text-accent mb-5">
            Premium Mebel Kolleksiyasi 2025
          </p>
          <h1 className="text-[clamp(42px,6vw,76px)] font-serif font-normal text-dark leading-[1.1] mb-6 tracking-[-0.02em]">
            Zamonaviy Mebel<br />Sizning<br /><em className="text-accent not-italic">Orzuingizdagi Uy</em>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-[420px]">
            Zamonaviy uy uchun yaratilgan abadiy buyumlarni kashf eting. Hashamatli materiallar, hunarmand sifati, eshikingizgacha yetkazib beriladi.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button 
              onClick={() => setPage("Products")}
              className="bg-accent text-white border-none rounded-full px-9 py-4 text-sm font-bold cursor-pointer tracking-[0.06em] uppercase transition-all hover:bg-dark hover:-translate-y-0.5"
            >
              Kolleksiyani Ko'rish
            </button>
            <button 
              onClick={() => setPage("Categories")}
              className="bg-transparent text-dark border-2 border-dark rounded-full px-8 py-3.5 text-sm font-bold cursor-pointer tracking-[0.06em] uppercase transition-all hover:bg-dark hover:text-white"
            >
              Kategoriyalarni Ko'rish
            </button>
          </div>
          
          <div className="flex gap-10 mt-14">
            {[["500+", "Mahsulotlar"], ["12K+", "Baxtli Mijozlar"], ["15yil", "Tajriba"]].map(([n, l]) => (
              <div key={l}>
                <div className="text-[28px] font-bold font-serif text-dark">{n}</div>
                <div className="text-[12px] text-gray-500 uppercase tracking-[0.08em]">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;