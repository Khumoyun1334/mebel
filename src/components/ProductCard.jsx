import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Stars from './Stars';
import Badge from './Badge';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { formatPrice, getDiscountPercent } from '../utils/formatPrice';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, hasInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [hovered, setHovered] = useState(false);
  const isWishlisted = hasInWishlist(product.id);
  const discountPercent = getDiscountPercent(product.oldPrice, product.price);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 transform ${
        hovered ? "shadow-2xl -translate-y-2 scale-[1.02]" : "shadow-md"
      }`}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden h-56 md:h-60 bg-cream">
          <img 
            src={product.img} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? "scale-110" : "scale-100"}`} 
          />
          <div className="absolute top-3 left-3">
            <Badge text={product.badge} />
          </div>
          {product.oldPrice && discountPercent > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercent}%
            </div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); showToast(isWishlisted ? "Istaklar ro'yxatidan o'chirildi" : "Istaklar ro'yxatiga qo'shildi ♡", isWishlisted ? "error" : "success"); }}
            className={`absolute bottom-3 right-3 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 border-none cursor-pointer flex items-center justify-center shadow-md transition-all hover:scale-110 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <FiHeart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"} />
          </button>
        </div>
        <div className="p-3 md:p-4 pb-4 md:pb-5">
          <p className="text-[10px] md:text-[11px] text-accent font-semibold tracking-wider uppercase mb-1">{product.category}</p>
          <h3 className="text-sm md:text-base font-semibold text-dark mb-1.5 md:mb-2 font-serif line-clamp-1">{product.name}</h3>
          <Stars rating={product.rating} />
          <div className="flex flex-wrap items-baseline gap-2 mt-2">
            <span className="text-base md:text-lg font-bold text-accent font-serif">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs md:text-sm text-gray-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); showToast(`${product.name} savatga qo'shildi!`); }}
            className="mt-3 bg-dark text-white border-none rounded-xl py-2 text-[11px] md:text-[13px] font-semibold cursor-pointer transition-all duration-300 hover:bg-accent w-full flex items-center justify-center gap-1"
          >
            <FiShoppingCart size={12} /> Savatga Qo'shish
          </button>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;