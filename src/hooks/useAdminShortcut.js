// src/hooks/useAdminShortcut.js
import { useEffect } from "react";
import { useAdmin } from "../context/AdminContext";

export const useAdminShortcut = () => {
  const { setShowAdminModal } = useAdmin();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Alt + A (Google Chrome bilan to'qnashmaydi)
      if (e.ctrlKey && e.altKey && e.key === "a") {
        e.preventDefault();
        console.log("🔑 Admin panel ochilmoqda... (Ctrl+Alt+A)");
        setShowAdminModal(true);
      }

      // Yoki Ctrl + Shift + X
      // if (e.ctrlKey && e.shiftKey && e.key === 'X') {
      //   e.preventDefault();
      //   console.log('🔑 Admin panel ochilmoqda... (Ctrl+Shift+X)');
      //   setShowAdminModal(true);
      // }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShowAdminModal]);
};
