import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Footer from '../components/Footer';

function WishlistPage({ setPage, setDetailProduct }) {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (!wishlist.length) {
    return (
      <div className="min-h-screen bg-lightBg flex flex-col items-center justify-center gap-5">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <h2 className="font-serif text-dark text-[28px]">Istaklar Ro'yxatingiz Bo'sh</h2>
        <p className="text-gray-500">Sevimli buyumlarni keyinroq uchun saqlang</p>
        <button onClick={() => setPage("Products")} className="bg-accent text-white border-none rounded-full px-8 py-3.5 text-sm font-bold cursor-pointer">
          Mahsulotlarni Ko'rish
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-serif font-normal text-dark mb-9">Istaklar Ro'yxati ({wishlist.length})</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {wishlist.map(p => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-md">
              <div className="h-55 overflow-hidden cursor-pointer" onClick={() => { setDetailProduct(p); setPage("Detail"); }}>
                <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-serif text-dark mb-2">{p.name}</h3>
                <div className="text-xl font-bold text-dark mb-4">${p.price.toLocaleString()}</div>
                <div className="flex gap-2.5">
                  <button 
                    onClick={() => { addToCart(p); showToast(`${p.name} savatga qo'shildi!`); }} 
                    className="flex-1 bg-dark text-white border-none rounded-full py-2.5 text-[13px] font-semibold cursor-pointer hover:bg-accent transition-all"
                  >
                    Savatga Qo'shish
                  </button>
                  <button 
                    onClick={() => { toggleWishlist(p); showToast("Istaklar ro'yxatidan o'chirildi", "error"); }} 
                    className="w-10 h-10 rounded-full border-[1.5px] border-red-500 bg-transparent cursor-pointer text-red-500 flex items-center justify-center"
                  >
                    ✕
                  </button>
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

export default WishlistPage;