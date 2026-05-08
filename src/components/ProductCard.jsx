import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Stars from './Stars';
import Badge from './Badge';

function ProductCard({ product, onView }) {
  const { addToCart } = useCart();
  const { toggleWishlist, hasInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [hovered, setHovered] = useState(false);
  const isWishlisted = hasInWishlist(product.id);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-cardBg rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out flex flex-col ${
        hovered ? "shadow-2xl -translate-y-1.5" : "shadow-md"
      }`}
    >
      <div className="relative overflow-hidden h-60" onClick={() => onView(product)}>
        <img 
          src={product.img} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-110" : "scale-100"}`} 
        />
        <div className="absolute top-3.5 left-3.5">
          <Badge text={product.badge} />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); showToast(isWishlisted ? "Istaklar ro'yxatidan o'chirildi" : "Istaklar ro'yxatiga qo'shildi ♡", isWishlisted ? "error" : "success"); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/92 border-none cursor-pointer flex items-center justify-center transition-transform hover:scale-110"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? "#e55" : "none"} stroke={isWishlisted ? "#e55" : "#666"} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div className="p-5 pb-6 flex-1 flex flex-col">
        <p className="text-[11px] text-accent font-semibold tracking-[0.08em] uppercase mb-1.5">{product.category}</p>
        <h3 onClick={() => onView(product)} className="text-lg font-semibold text-dark mb-2.5 font-serif cursor-pointer">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3.5">
          <Stars rating={product.rating} />
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xl font-bold text-dark">${product.price.toLocaleString()}</span>
          <span className="text-sm text-gray-300 line-through">${product.oldPrice.toLocaleString()}</span>
        </div>
        <button
          onClick={() => { addToCart(product); showToast(`${product.name} savatga qo'shildi!`); }}
          className="mt-auto bg-dark text-white border-none rounded-xl py-3 text-[13px] font-semibold cursor-pointer tracking-wide transition-all hover:bg-accent w-full"
        >
          SAVATGA QO'SHISH
        </button>
      </div>
    </div>
  );
}

export default ProductCard;