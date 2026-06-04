import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import Stars from "./Stars";
import Badge from "./Badge";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { formatPrice, getDiscountPercent } from "../utils/formatPrice";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, hasInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [hovered, setHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Faqat state orqali tekshirish, har safar yangilanadi
  const isWishlisted = hasInWishlist(product?.id);
  const discountPercent = getDiscountPercent(product?.oldPrice, product?.price);

  if (!product || !product.id) {
    console.error("ProductCard: product ma'lumoti topilmadi", product);
    return null;
  }

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding) return;

    setIsAdding(true);
    try {
      addToCart(product);
      showToast(`${product.name} savatga qo'shildi!`, "success");
    } catch (error) {
      console.error("Savatga qo'shishda xatolik:", error);
      showToast("Xatolik yuz berdi. Qayta urinib ko'ring.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      toggleWishlist(product);
      // Toast xabarini ko'rsatish (sahifa qayta yuklanmaydi)
      showToast(
        isWishlisted
          ? "Istaklar ro'yxatidan o'chirildi"
          : "Istaklar ro'yxatiga qo'shildi ♡",
        isWishlisted ? "error" : "success",
      );
    } catch (error) {
      console.error("Wishlistga qo'shishda xatolik:", error);
      showToast("Xatolik yuz berdi. Qayta urinib ko'ring.", "error");
    }
  };

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
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x300?text=No+Image";
            }}
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
            onClick={handleToggleWishlist}
            className={`absolute bottom-3 right-3 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 border-none cursor-pointer flex items-center justify-center shadow-md transition-all hover:scale-110 ${hovered ? "opacity-100" : "opacity-0"}`}
          >
            <FiHeart
              size={16}
              className={
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
              }
            />
          </button>
        </div>
        <div className="p-3 md:p-4 pb-4 md:pb-5">
          <p className="text-[10px] md:text-[11px] text-accent font-semibold tracking-wider uppercase mb-1">
            {product.category}
          </p>
          <h3 className="text-sm md:text-base font-semibold text-dark mb-1.5 md:mb-2 font-serif line-clamp-1">
            {product.name}
          </h3>
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
            onClick={handleAddToCart}
            disabled={isAdding}
            className="mt-3 bg-dark text-white border-none rounded-xl py-2 text-[11px] md:text-[13px] font-semibold cursor-pointer transition-all duration-300 hover:bg-accent w-full flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-waiting"
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Qo'shilmoqda...
              </>
            ) : (
              <>
                <FiShoppingCart size={12} /> Savatga Qo'shish
              </>
            )}
          </button>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
