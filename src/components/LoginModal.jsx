import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiLock, FiUser, FiPhone, FiX, FiLogIn, FiUserPlus } from 'react-icons/fi';

function LoginModal({ onClose, onSuccess }) {
  const { signIn, signUp } = useAuth();
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    // Faqat raqamlar va + qoldirish
    value = value.replace(/[^0-9+]/g, '');
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.phone || formData.phone.length < 12) {
      showToast("Telefon raqamni to'liq kiriting! Masalan: +998901234567", "error");
      setLoading(false);
      return;
    }

    if (isLogin) {
      const result = await signIn(formData.phone, formData.password);
      if (result.success) {
        showToast("Xush kelibsiz!", "success");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        showToast(result.error, "error");
      }
    } else {
      if (formData.password.length < 6) {
        showToast("Parol kamida 6 belgidan iborat bo'lishi kerak", "error");
        setLoading(false);
        return;
      }
      if (!formData.fullName || formData.fullName.trim() === '') {
        showToast("Ism familiyangizni kiriting!", "error");
        setLoading(false);
        return;
      }
      
      const result = await signUp(formData.phone, formData.password, formData.fullName);
      if (result.success) {
        showToast("Ro'yxatdan o'tish muvaffaqiyatli! Hisobingizga kiring.", "success");
        setIsLogin(true);
        setFormData({ phone: '', password: '', fullName: '' });
      } else {
        showToast(result.error, "error");
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-dark">
          <FiX size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {isLogin ? <FiLogIn className="text-accent" size={28} /> : <FiUserPlus className="text-accent" size={28} />}
          </div>
          <h2 className="text-2xl font-serif text-dark">{isLogin ? "Kirish" : "Ro'yxatdan o'tish"}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? "Telefon raqam va parol bilan kiring" : "Telefon raqam orqali ro'yxatdan o'ting"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">To'liq ism</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent" placeholder="Ism familiyangiz" required />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Telefon raqam</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" name="phone" value={formData.phone} onChange={handlePhoneChange} className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent" placeholder="+998901234567" required />
            </div>
            <p className="text-xs text-gray-400 mt-1">Masalan: +998901234567</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Parol</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent" placeholder="********" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-accent text-white rounded-full py-3 font-semibold hover:bg-accent-dark transition-all disabled:opacity-50">
            {loading ? "Yuborilmoqda..." : (isLogin ? "Kirish" : "Ro'yxatdan o'tish")}
          </button>
        </form>

        <div className="text-center mt-4">
          <button onClick={() => { setIsLogin(!isLogin); setFormData({ phone: '', password: '', fullName: '' }); }} className="text-accent text-sm hover:underline">
            {isLogin ? "Hisobingiz yo'qmi? Ro'yxatdan o'ting" : "Hisobingiz bormi? Kirish"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;