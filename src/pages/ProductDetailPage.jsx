import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import SectionTitle from '../components/SectionTitle';
import Stars from '../components/Stars';
import Footer from '../components/Footer';
import { PRODUCTS } from '../data/data';

function ProductDetailPage({ product, setPage }) {
  const { addToCart } = useCart();
  const { toggleWishlist, hasInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const isWishlisted = hasInWishlist(product.id);
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <button 
          onClick={() => setPage("Products")} 
          className="bg-transparent border-none cursor-pointer text-gray-500 text-sm flex items-center gap-2 mb-9 font-sans"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg> 
          Mahsulotlarga Orqaga
        </button>
        
        <div className="grid md:grid-cols-2 gap-15 items-start">
          <div className="rounded-2xl overflow-hidden h-[520px]">
            <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
          </div>
          
          <div className="pt-5">
            <p className="text-[11px] text-accent font-bold tracking-[0.1em] uppercase mb-2.5">{product.category}</p>
            <h1 className="text-[38px] font-serif font-normal text-dark mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mb-5">
              <Stars rating={product.rating} />
              <span className="text-[13px] text-gray-500">{product.rating} ({product.reviews} fikr)</span>
            </div>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-[34px] font-bold text-dark">${product.price.toLocaleString()}</span>
              <span className="text-lg text-gray-300 line-through">${product.oldPrice.toLocaleString()}</span>
              <span className="text-[13px] text-green-600 font-semibold">${(product.oldPrice - product.price).toLocaleString()} Tejang</span>
            </div>
            <p className="text-base text-gray-600 leading-relaxed mb-8">{product.desc}</p>
            
            <div className="flex gap-4 mb-6 items-center">
              <div className="flex items-center border-[1.5px] border-gray-300 rounded-full overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty-1))} className="w-11 h-11 bg-transparent border-none text-xl cursor-pointer text-dark">−</button>
                <span className="w-9 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(qty+1)} className="w-11 h-11 bg-transparent border-none text-xl cursor-pointer text-dark">+</button>
              </div>
              <button 
                onClick={() => { addToCart(product, qty); showToast(`${product.name} savatga qo'shildi!`); }} 
                className="flex-1 bg-dark text-white border-none rounded-full py-3.5 text-sm font-bold cursor-pointer tracking-[0.06em] uppercase transition-all hover:bg-accent"
              >
                Savatga Qo'shish
              </button>
              <button 
                onClick={() => { toggleWishlist(product); showToast(isWishlisted ? "Istaklar ro'yxatidan o'chirildi" : "Istaklar ro'yxatiga qo'shildi!"); }} 
                className={`w-12 h-12 rounded-full border-[1.5px] bg-transparent cursor-pointer flex items-center justify-center transition-all ${
                  isWishlisted ? "border-red-500" : "border-gray-300"
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "#e55" : "none"} stroke={isWishlisted ? "#e55" : "#888"} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              {[["Bepul Yetkazib Berish", "$500 dan ortiq xaridlarda"], ["30-Kunlik Qaytarish", "Muammosiz qaytarish"], ["5-Yillik Kafolat", "Barcha mebellarda"]].map(([t, s]) => (
                <div key={t} className="flex items-center gap-3.5 py-2.5 border-b border-gray-50">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <div><span className="font-semibold text-sm text-dark">{t}</span> <span className="text-[13px] text-gray-500">— {s}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {related.length > 0 && (
          <div className="mt-20">
            <SectionTitle label="Sizga Yoqishi Mumkin" title="O'xshash Mahsulotlar" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {related.map(p => <ProductCard key={p.id} product={p} onView={prod => { setPage("Detail"); }} />)}
            </div>
          </div>
        )}
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

export default ProductDetailPage;