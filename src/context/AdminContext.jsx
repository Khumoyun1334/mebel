import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const supabaseUrl = 'https://hxrwrhbbijfntbrntpxk.supabase.co';
  const supabaseKey = 'sb_publishable_qnJTSPaIOR5tn0dZw2RdgA_w6WOjvsJ';

  const loadData = async () => {
    setLoading(true);
    try {
      console.log('🔍 Yuklash boshlandi...');
      
      const response = await fetch(`${supabaseUrl}/rest/v1/products?apikey=${supabaseKey}`, {
        headers: { 'apikey': supabaseKey }
      });
      
      const data = await response.json();
      console.log('✅ Kelgan data:', data);
      console.log('📦 Soni:', data?.length);
      
      setProducts(data || []);
    } catch (error) {
      console.error('❌ Xatolik:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loginAdmin = (password) => {
    if (password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('luxehome_admin', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.setItem('luxehome_admin', 'false');
  };

  return (
    <AdminContext.Provider value={{
      products,
      loading,
      isAdmin,
      showAdminModal,
      setShowAdminModal,
      loginAdmin,
      logoutAdmin,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);