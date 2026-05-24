import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi';

function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await updateProfile(formData);
    if (result.success) {
      showToast("Ma'lumotlar yangilandi", "success");
    } else {
      showToast(result.error, "error");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-lightBg flex items-center justify-center pt-[72px]">
        <div className="text-center">
          <p className="text-gray-500">Iltimos, avval kiring</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightBg pt-[72px]">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-serif text-dark mb-8">Shaxsiy kabinet</h1>
        
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 bg-gray-50 text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Emailni o'zgartirish mumkin emas</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">To'liq ism</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent"
                  placeholder="Ism familiyangiz"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Telefon</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-accent"
                  placeholder="+998 xx xxx xx xx"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white rounded-full py-3 font-semibold hover:bg-accent-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FiSave size={16} />
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;