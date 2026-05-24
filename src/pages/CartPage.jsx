import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import CheckoutModal from '../components/CheckoutModal';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);

  // Bepul yetkazib berish chegarasi 500,000 so'm
  const freeShippingThreshold = 500000;
  const shipping = total >= freeShippingThreshold ? 0 : 49000;
  const tax = Math.round(total * 0.08);
  const grandTotal = total + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-lightBg flex flex-col items-center justify-center gap-4 md:gap-5 px-4 pt-[72px]">
        <FiShoppingCart size={64} className="text-gray-300" />
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-dark">Savatingiz Bo'sh</h2>
        <p className="text-gray-500 text-sm md:text-base">Boshlash uchun chiroyli mebellarni qo'shing</p>
        <Link to="/products" className="bg-accent text-white border-none px-6 md:px-8 py-3 rounded-lg text-sm md:text-base font-serif cursor-pointer">
          Mahsulotlarni Ko'rish
        </Link>
      </div>
    );
  }

  const handleCheckoutSuccess = () => {
    clearCart();
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-lightBg pt-[72px]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
        <h1 className="font-serif text-2xl md:text-4xl font-normal text-dark mb-6 md:mb-10">
          Savat <span className="text-sm text-gray-500 font-sans">({cart.length} {cart.length === 1 ? "mahsulot" : "mahsulot"})</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
          <div className="flex-1 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row gap-4 shadow-sm">
                <img
                  src={item.img}
                  alt={item.name}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-[10px] text-accent font-semibold tracking-wider uppercase mb-1">{item.category}</p>
                  <h3 className="font-serif text-base md:text-lg font-normal text-dark mb-2">{item.name}</h3>
                  <div className="flex items-center bg-cream rounded-full w-fit">
                    <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="w-8 h-8 border-none bg-transparent cursor-pointer flex items-center justify-center rounded-l-full">
                      <FiMinus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="w-8 h-8 border-none bg-transparent cursor-pointer flex items-center justify-center rounded-r-full">
                      <FiPlus size={12} />
                    </button>
                  </div>
                </div>
                <div className="text-right flex sm:flex-col justify-between items-center sm:items-end gap-3">
                  <span className="font-serif text-lg md:text-xl text-dark font-normal">
                    {formatPrice(item.price * item.qty)} so'm
                  </span>
                  <button onClick={() => { removeFromCart(item.id); showToast("Buyum o'chirildi", "error"); }} className="text-red-500 text-xs flex items-center gap-1 hover:underline">
                    <FiTrash2 size={14} /> O'chirish
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-[380px]">
            <div className="bg-white rounded-2xl p-5 md:p-7 shadow-sm sticky top-24">
              <h2 className="font-serif text-xl md:text-2xl font-normal mb-5 md:mb-6 text-dark">Buyurtma Xulosasi</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Umumiy narx</span>
                  <span className="font-semibold text-dark">{formatPrice(total)} so'm</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Yetkazib berish</span>
                  <span className="font-semibold text-dark">{shipping === 0 ? "Bepul" : `${formatPrice(shipping)} so'm`}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Soliq (8%)</span>
                  <span className="font-semibold text-dark">{formatPrice(tax)} so'm</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between font-serif text-base md:text-lg">
                  <span>Jami</span>
                  <span className="text-accent">{formatPrice(grandTotal)} so'm</span>
                </div>
              </div>
              {shipping > 0 && (
                <p className="text-center text-accent text-xs bg-accent-light py-2 rounded-lg mt-4">
                  Bepul yetkazib berish uchun yana {formatPrice(freeShippingThreshold - total)} so'm xarid qiling!
                </p>
              )}
              <button 
                onClick={() => setShowCheckout(true)}
                className="w-full bg-accent text-white border-none py-3 rounded-xl text-sm font-serif font-semibold cursor-pointer mt-5 hover:bg-accent-dark transition-all"
              >
                Buyurtma Qilish →
              </button>
              <Link to="/products" className="block text-center text-gray-500 text-xs mt-3 hover:text-accent transition-all">
                Mahsulotlarni Ko'rishni Davom Ettirish
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}

export default CartPage;