import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { FiMapPin, FiPhone, FiUser, FiDollarSign, FiSend, FiLoader } from 'react-icons/fi';

function CheckoutModal({ onClose, onSuccess }) {
  const { addOrder } = useAdmin();
  const { cart, total, clearCart } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationText, setLocationText] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [address, setAddress] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    paymentMethod: 'cash'
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Koordinatadan manzil olish (reverse geocoding)
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=uz`
      );
      const data = await response.json();
      if (data.display_name) {
        return data.display_name;
      }
      return `${lat}, ${lng}`;
    } catch (error) {
      console.error('Manzil olishda xatolik:', error);
      return `${lat}, ${lng}`;
    }
  };

  // Mijozning joylashuvini olish
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      showToast("Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi", "error");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
        
        // Google Maps link yaratish
        const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
        setLocationText(mapsLink);
        
        // Koordinatadan manzil olish
        const addressFromCoords = await getAddressFromCoords(lat, lng);
        setAddress(addressFromCoords);
        setFormData(prev => ({ ...prev, customerAddress: addressFromCoords }));
        
        showToast("Joylashuv muvaffaqiyatli olindi!", "success");
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Geolokatsiya xatosi:", error);
        let errorMessage = "Joylashuvni olishda xatolik!";
        if (error.code === 1) {
          errorMessage = "Joylashuvga ruxsat berilmadi! Iltimos, manzilni qo'lda yozing.";
        } else if (error.code === 2) {
          errorMessage = "Joylashuv aniqlanmadi! Qayta urinib ko'ring.";
        } else if (error.code === 3) {
          errorMessage = "Ulanish vaqti tugadi! Internet tezligingizni tekshiring.";
        }
        showToast(errorMessage, "error");
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.customerPhone) {
      showToast("Ism va telefon raqamni kiriting!", "error");
      return;
    }

    if (!formData.customerAddress && !locationText) {
      showToast("Manzilni kiriting yoki joylashuvni yuboring!", "error");
      return;
    }

    setLoading(true);

    try {
      const order = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress || address,
        paymentMethod: formData.paymentMethod,
        location: location,
        locationLink: locationText,
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] animate-fadeIn overflow-y-auto py-8">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-dark">Buyurtma Rasmiylashtirish</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-dark text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ism */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Ismingiz <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent transition-all"
                placeholder="Ism familiyangiz"
              />
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Telefon raqam <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent transition-all"
                placeholder="+998 xx xxx xx xx"
              />
            </div>
          </div>

          {/* Manzil va Joylashuv */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Yetkazib berish manzili
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <textarea
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent transition-all resize-none"
                placeholder="To'liq manzilingiz (ko'cha, uy, kvartira)"
              />
            </div>
            
            <div className="mt-3">
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="w-full bg-blue-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGettingLocation ? (
                  <>
                    <FiLoader className="animate-spin" size={18} />
                    Joylashuv olinmoqda...
                  </>
                ) : (
                  <>
                    <FiMapPin size={18} />
                    📍 Hozirgi joylashuvimni yuborish
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400 mt-2">
                💡 Tugmani bosing, brauzer joylashuvingizni so'raydi. Ruxsat bering!
              </p>
            </div>

            {locationText && (
              <div className="mt-3 bg-green-50 rounded-xl p-3">
                <p className="text-xs text-green-700 flex items-center gap-1">
                  ✅ Joylashuv olindi!
                </p>
                <a 
                  href={locationText} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline break-all mt-1 inline-block"
                >
                  📍 Xaritada ko'rish
                </a>
              </div>
            )}
          </div>

          {/* To'lov turi */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">To'lov turi</label>
            <div className="relative">
              <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent transition-all"
              >
                <option value="cash">Naqd (Yetkazib berishda)</option>
                <option value="card">Plastik karta</option>
                <option value="click">Click</option>
                <option value="payme">Payme</option>
              </select>
            </div>
          </div>

          {/* Jami summa */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Mahsulotlar soni:</span>
              <span className="font-semibold">{cart.length} ta</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Jami summa:</span>
              <span className="text-xl font-bold text-accent">{total.toLocaleString()} so'm</span>
            </div>
          </div>

          {/* Yuborish tugmasi */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white rounded-full py-3 font-semibold hover:bg-accent-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Yuborilmoqda...
              </>
            ) : (
              <>
                <FiSend size={16} />
                Buyurtma Yuborish
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutModal;