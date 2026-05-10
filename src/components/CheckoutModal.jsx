import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

function CheckoutModal({ onClose, onSuccess }) {
  const { addOrder } = useAdmin();
  const { cart, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    paymentMethod: 'cash'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone || !formData.customerAddress) {
      showToast("Barcha maydonlarni to'ldiring!", "error");
      return;
    }

    setLoading(true);
    console.log('📦 Buyurtma yuborilmoqda...');

    try {
      const order = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        paymentMethod: formData.paymentMethod,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty
        })),
        total: total
      };

      await addOrder(order);
      clearCart();
      showToast("Buyurtma qabul qilindi! Admin tez orada bog'lanadi.", "success");
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Xatolik:', error);
      showToast("Xatolik yuz berdi. Qayta urinib ko'ring.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Agar savat bo'sh bo'lsa
  if (cart.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
          <p className="text-gray-500 mb-4">Savatingiz bo'sh</p>
          <button onClick={onClose} className="bg-accent text-white px-6 py-2 rounded-full">Yopish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] animate-fadeIn overflow-y-auto py-8">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-dark">Buyurtma Rasmiylashtirish</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-dark text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Ismingiz <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-accent"
              placeholder="Ism familiyangiz"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Telefon raqam <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-accent"
              placeholder="+998 xx xxx xx xx"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Yetkazib berish manzili <span className="text-red-500">*</span>
            </label>
            <textarea
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              required
              rows={2}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-accent resize-none"
              placeholder="To'liq manzilingiz"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 mb-2">To'lov turi</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-accent"
            >
              <option value="cash">Naqd (Yetkazib berishda)</option>
              <option value="card">Plastik karta</option>
              <option value="click">Click</option>
              <option value="payme">Payme</option>
            </select>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Mahsulotlar soni:</span>
              <span className="font-semibold">{cart.length} ta</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Jami summa:</span>
              <span className="text-xl font-bold text-accent">${total.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white rounded-full py-3 font-semibold hover:bg-accent-dark transition-all disabled:opacity-50"
          >
            {loading ? "Yuborilmoqda..." : "Buyurtma Yuborish"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutModal;