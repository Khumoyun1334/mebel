import { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';

export function useAdminShortcut() {
  const { setShowAdminModal, isAdmin } = useAdmin();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdminModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowAdminModal]);
}