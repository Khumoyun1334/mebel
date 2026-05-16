import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Stars from './Stars';
import Badge from './Badge';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, hasInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isWishlisted = hasInWishlist(product.id);

  const productImage = product.img || (product.images && product.images[0]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-cardBg rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out flex flex-col ${
        hovered ? "shadow-2xl -translate-y-1.5" : "shadow-md"
      }`}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden h-56 md:h-60 bg-gray-100">
          {!imgError && productImage ? (
            <img 
              src={productImage} 
              alt={product.name} 
              className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-110" : "scale-100"}`}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400 text-sm">🖼️ Rasm yo'q</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge text={product.badge} />
          </div>
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); showToast(isWishlisted ? "Istaklar ro'yxatidan o'chirildi" : "Istaklar ro'yxatiga qo'shildi ♡", isWishlisted ? "error" : "success"); }}
            className={`absolute top-3 right-3 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/92 border-none cursor-pointer flex items-center justify-center shadow-md transition-transform hover:scale-110`}
          >
            <FiHeart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"} />
          </button>
        </div>
        <div className="p-3 md:p-4 pb-4 md:pb-5 flex-1 flex flex-col">
          <p className="text-[10px] md:text-[11px] text-accent font-semibold tracking-[0.08em] uppercase mb-1">{product.category}</p>
          <h3 className="text-sm md:text-base font-semibold text-dark mb-1.5 md:mb-2 font-serif">{product.name}</h3>
          <Stars rating={product.rating || 0} />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base md:text-lg font-bold text-dark font-serif">
              ${(product.price || 0).toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-xs md:text-sm text-gray-300 line-through">
                ${product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); showToast(`${product.name} savatga qo'shildi!`); }}
            className="mt-3 bg-dark text-white border-none rounded-xl py-2 text-[11px] md:text-[13px] font-semibold cursor-pointer tracking-wide transition-all hover:bg-accent w-full flex items-center justify-center gap-1"
          >
            <FiShoppingCart size={12} /> Savatga Qo'shish
          </button>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;