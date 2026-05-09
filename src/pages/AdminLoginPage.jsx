import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';

function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const { loginAdmin } = useAdmin();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      showToast("Admin panelga xush kelibsiz!", "success");
      navigate('/admin');
    } else {
      showToast("Noto'g'ri parol!", "error");
    }
  };

  return (
    <div className="min-h-screen bg-lightBg flex items-center justify-center pt-[72px]">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center mb-6 md:mb-8">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl md:text-2xl">🔐</span>
          </div>
          <h1 className="text-xl md:text-2xl font-serif text-dark">Admin Panel</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-2">Kirish uchun parolni kiriting</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin parolini kiriting"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all"
              autoFocus
            />

          </div>
          
          <button
            type="submit"
            className="w-full bg-accent text-white rounded-full py-3 font-semibold hover:bg-accent-dark transition-all"
          >
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;