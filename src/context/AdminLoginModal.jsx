import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';

function AdminLoginModal({ onClose }) {
  const [password, setPassword] = useState('');
  const { loginAdmin } = useAdmin();
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      showToast("Admin panelga xush kelibsiz!", "success");
      onClose();
    } else {
      showToast("Noto'g'ri parol!", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif text-dark">Admin Kirish</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-dark text-2xl">&times;</button>
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
            <p className="text-xs text-gray-400 mt-2">Demo parol: <span className="text-accent">admin123</span></p>
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

export default AdminLoginModal;