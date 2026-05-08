import React from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Footer from '../components/Footer';

function CartPage({ setPage }) {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const { showToast } = useToast();

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-lightBg flex flex-col items-center justify-center gap-5">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h2 className="font-serif text-dark text-[28px]">Savatingiz Bo'sh</h2>
        <p className="text-gray-500">Boshlash uchun chiroyli buyumlarni qo'shing</p>
        <button onClick={() => setPage("Products")} className="bg-accent text-white border-none rounded-full px-8 py-3.5 text-sm font-bold cursor-pointer">
          Hoziroq Xarid Qiling
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="max-w-[1100px] mx-auto px-8 py-12">
        <h1 className="text-4xl font-serif font-normal text-dark mb-9">Savat</h1>
        
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="flex flex-col gap-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-center shadow-sm">
                <div className="w-[100px] h-[100px] rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-accent font-semibold tracking-[0.08em] uppercase mb-1">{item.category}</p>
                  <h3 className="text-lg font-semibold text-dark font-serif mb-3">{item.name}</h3>
                  <div className="flex items-center border-[1.5px] border-gray-100 rounded-full w-fit">
                    <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="w-9 h-9 bg-transparent border-none cursor-pointer text-lg text-dark">−</button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="w-9 h-9 bg-transparent border-none cursor-pointer text-lg text-dark">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-dark mb-3">${(item.price * item.qty).toLocaleString()}</div>
                  <button onClick={() => { removeFromCart(item.id); showToast("Buyum o'chirildi", "error"); }} className="bg-transparent border-none text-gray-300 cursor-pointer text-[13px] hover:text-red-500">
                    O'chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-2xl p-7 h-fit shadow-md">
            <h2 className="text-xl font-serif font-semibold text-dark mb-6">Buyurtma Xulosasi</h2>
            <div className="flex flex-col gap-3.5 mb-6 pb-6 border-b border-gray-50">
              {cart.map(i => (
                <div key={i.id} className="flex justify-between text-sm text-gray-600">
                  <span>{i.name} ×{i.qty}</span>
                  <span className="font-medium text-dark">${(i.price * i.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Yetkazib berish</span><span className="text-green-600 font-semibold">Bepul</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-dark pt-4 border-t border-gray-50 mt-2 mb-6">
              <span>Jami</span><span>${total.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => showToast("To'lovga o'tish...")}
              className="w-full bg-accent text-white border-none rounded-full py-4 text-sm font-bold cursor-pointer tracking-[0.06em] uppercase"
            >
              To'lovga O'tish
            </button>
            <button onClick={() => setPage("Products")} className="w-full bg-transparent border-none text-gray-500 text-[13px] cursor-pointer mt-3.5">
              Xarid Qilishni Davom Ettirish
            </button>
          </div>
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

export default CartPage;