import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { FiShield } from 'react-icons/fi';
import AdminLoginModal from './AdminLoginModal';
import AdminPanel from './AdminPanel';

function AdminButton() {
  const { isAdmin, logoutAdmin } = useAdmin();
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const handleClick = () => {
    if (isAdmin) {
      setShowPanel(true);
    } else {
      setShowLogin(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`fixed bottom-6 right-6 z-[1500] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
          isAdmin ? 'bg-success text-white' : 'bg-dark text-white'
        }`}
        title={isAdmin ? 'Admin Panel' : 'Admin Kirish'}
      >
        <FiShield size={22} />
      </button>

      {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} />}
      {showPanel && <AdminPanel onClose={() => setShowPanel(false)} />}
    </>
  );
}

export default AdminButton;