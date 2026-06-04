import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiUser, FiPackage, FiMapPin, FiLogOut, FiChevronDown } from 'react-icons/fi';

function ProfileDropdown() {
  const { user, profile, signOut } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
    showToast("Hisobdan chiqildi", "info");
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-semibold text-sm">
          {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
        </div>
        <FiChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg z-50 border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <p className="font-semibold text-dark truncate">{profile?.full_name || user.email}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <div className="py-2">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiUser size={16} /> Shaxsiy kabinet
              </Link>
              <Link
                to="/profile/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiPackage size={16} /> Buyurtmalarim
              </Link>
              <Link
                to="/profile/addresses"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiMapPin size={16} /> Manzillarim
              </Link>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
              >
                <FiLogOut size={16} /> Chiqish
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileDropdown;