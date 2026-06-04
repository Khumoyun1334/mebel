import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { formatPrice } from "../utils/formatPrice";

function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (item) => {
    console.log("🛒 Wishlistdan savatga qo'shish:", item.name);
    try {
      addToCart(item, 1);
      showToast(`${item.name} savatga qo'shildi!`, "success");
    } catch (error) {
      console.error("Savatga qo'shishda xatolik:", error);
      showToast("Xatolik yuz berdi. Qayta urinib ko'ring.", "error");
    }
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-lightBg flex flex-col items-center justify-center gap-4 md:gap-5 px-4 pt-[72px]">
        <FiHeart size={64} className="text-gray-300" />
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-dark">
          Istaklar Ro'yxatingiz Bo'sh
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          Sevimli mahsulotlarni keyinroq uchun saqlang
        </p>
        <Link
          to="/products"
          className="bg-accent text-white border-none px-6 md:px-8 py-3 rounded-lg text-sm md:text-base font-serif cursor-pointer"
        >
          Mahsulotlarni Ko'rish
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightBg pt-[72px]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
        <h1 className="font-serif text-2xl md:text-4xl font-normal text-dark mb-6 md:mb-10">
          Istaklar Ro'yxati{" "}
          <span className="text-sm text-gray-500 font-sans">
            ({wishlist.length} mahsulot)
          </span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative h-56 bg-cream">
                <img
                  src={
                    item.img ||
                    "https://via.placeholder.com/300x300?text=No+Image"
                  }
                  alt={item.name}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105 duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x300?text=No+Image";
                  }}
                />
                <button
                  onClick={() => {
                    toggleWishlist(item);
                    showToast(
                      `${item.name} istaklar ro'yxatidan o'chirildi`,
                      "error",
                    );
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                >
                  <FiHeart size={16} className="fill-red-500 text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-[10px] text-accent font-semibold tracking-wider uppercase mb-1">
                  {item.category}
                </p>
                <h3 className="font-serif text-sm md:text-base font-normal text-dark mb-2">
                  {item.name}
                </h3>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-serif text-lg font-bold text-accent">
                    {formatPrice(item.price)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-dark text-white border-none px-4 py-2 rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1 hover:bg-accent transition-all"
                  >
                    <FiShoppingCart size={12} /> Savatga
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;
