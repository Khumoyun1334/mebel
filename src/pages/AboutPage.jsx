import React from 'react';
import Footer from '../components/Footer';

function AboutPage({ setPage }) {
  return (
    <div className="min-h-screen bg-lightBg">
      <div className="h-[480px] relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=1400&q=80" 
          alt="biz haqimizda" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-dark/55 flex items-center justify-center flex-col gap-4">
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-accent">Bizning Hikoyamiz</p>
          <h1 className="text-[clamp(36px,5vw,64px)] font-serif font-normal text-white text-center">
            2010 Yildan Beri Go'zal<br />Yashash Joylarini Yaratamiz
          </h1>
        </div>
      </div>
      
      <div className="max-w-[900px] mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-15 mb-20">
          <div>
            <h2 className="text-3xl font-serif font-normal text-dark mb-5">Bizning Falsafamiz</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              LuxeHome'da biz sizning uyingiz eng yaxshi shaxsingizning ifodasi bo'lishi kerakligiga ishonamiz. Biz tanlagan har bir buyum o'zining ajoyib sifati, o'ylangan dizayni va abadiy go'zalligi uchun tanlangan.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-serif font-normal text-dark mb-5">Bizning Hunarimiz</h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Biz dunyoning eng iste'dodli mebel hunarmandlari bilan hamkorlik qilamiz — italyan charm ustalaridan tortib Skandinaviya yog'ochsozlarigacha — sizga chinakam ajoyib buyumlarni yetkazib berish uchun.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center bg-white rounded-2xl p-10 shadow-sm">
          {[["2010", "Tashkil Topgan"], ["500+", "Mahsulotlar"], ["12,000+", "Mijozlar"], ["15", "Davlatlar"]].map(([n, l]) => (
            <div key={l}>
              <div className="text-4xl font-bold font-serif text-accent">{n}</div>
              <div className="text-[13px] text-gray-500 uppercase tracking-[0.08em] mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
      

    </div>
  );
}

export default AboutPage;