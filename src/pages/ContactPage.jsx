import React from 'react';
import Footer from '../components/Footer';
import { CATEGORIES } from '../data/data';

function CategoriesPage({ setPage }) {
  return (
    <div className="min-h-screen bg-lightBg">
      <div className="bg-dark py-15 px-8 text-center">
        <h1 className="text-[clamp(32px,5vw,56px)] font-serif font-normal text-white">Kolleksiyalar</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 py-15">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CATEGORIES.map(cat => (
            <div 
              key={cat.name} 
              onClick={() => setPage("Products")} 
              className="rounded-2xl overflow-hidden cursor-pointer relative h-[400px] shadow-lg transition-transform hover:-translate-y-2"
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/85 to-transparent" />
              <div className="absolute bottom-7 left-7 right-7">
                <h3 className="text-white text-2xl font-serif font-normal mb-2">{cat.name}</h3>
                <p className="text-white/60 text-sm">{cat.count} ta kuratsiyalangan buyum</p>
                <div className="mt-4 inline-flex items-center gap-2 text-accent text-[13px] font-semibold tracking-[0.06em]">
                  KO'RISH →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Footer setPage={setPage} />
    </div>
  );
}

export default CategoriesPage;