import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('luxehome_admin') === 'true';
  });
  const [showAdminModal, setShowAdminModal] = useState(false);

  const supabaseUrl = 'https://hxrwrhbbijfntbrntpxk.supabase.co';
  const supabaseKey = 'sb_publishable_qnJTSPaIOR5tn0dZw2RdgA_w6WOjvsJ';

  // Mahsulotlarni yuklash
  const loadData = async () => {
    setLoading(true);
    try {
      console.log('🔍 Yuklash boshlandi...');
      
      // Mahsulotlar
      const productsResponse = await fetch(`${supabaseUrl}/rest/v1/products?apikey=${supabaseKey}`, {
        headers: { 'apikey': supabaseKey }
      });
      const productsData = await productsResponse.json();
      console.log('✅ Mahsulotlar:', productsData?.length);
      setProducts(productsData || []);
      
      // Buyurtmalar
      const ordersResponse = await fetch(`${supabaseUrl}/rest/v1/orders?apikey=${supabaseKey}`, {
        headers: { 'apikey': supabaseKey }
      });
      const ordersData = await ordersResponse.json();
      console.log('✅ Buyurtmalar:', ordersData?.length);
      setOrders(ordersData || []);
      
      // Xabarlar
      const messagesResponse = await fetch(`${supabaseUrl}/rest/v1/messages?apikey=${supabaseKey}`, {
        headers: { 'apikey': supabaseKey }
      });
      const messagesData = await messagesResponse.json();
      console.log('✅ Xabarlar:', messagesData?.length);
      setContactMessages(messagesData || []);
      
    } catch (error) {
      console.error('❌ Xatolik:', error);
      setProducts([]);
      setOrders([]);
      setContactMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Admin login
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

  // Mahsulot qo'shish
  const addProduct = async (product) => {
    try {
      const newProduct = {
        id: Date.now(),
        name: product.name,
        category: product.category,
        price: product.price,
        old_price: product.oldPrice || null,
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        badge: product.badge || '',
        img: product.img,
        description: product.desc,
        colors: product.colors || [],
        images: product.images || [],
        created_at: new Date().toISOString()
      };
      
      const response = await fetch(`${supabaseUrl}/rest/v1/products?apikey=${supabaseKey}`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });
      
      if (!response.ok) throw new Error('Qo\'shishda xatolik');
      
      await loadData();
      return newProduct;
    } catch (error) {
      console.error('❌ addProduct xatosi:', error);
      throw error;
    }
  };

  // Mahsulot tahrirlash
  const updateProduct = async (id, updates) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${id}&apikey=${supabaseKey}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updates.name,
          category: updates.category,
          price: updates.price,
          old_price: updates.oldPrice,
          badge: updates.badge,
          img: updates.img,
          description: updates.desc,
          colors: updates.colors,
          images: updates.images
        })
      });
      
      if (!response.ok) throw new Error('Tahrirlashda xatolik');
      
      await loadData();
      return true;
    } catch (error) {
      console.error('❌ updateProduct xatosi:', error);
      throw error;
    }
  };

  // Mahsulot o'chirish
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${id}&apikey=${supabaseKey}`, {
        method: 'DELETE',
        headers: { 'apikey': supabaseKey }
      });
      
      if (!response.ok) throw new Error('O\'chirishda xatolik');
      
      await loadData();
      return true;
    } catch (error) {
      console.error('❌ deleteProduct xatosi:', error);
      throw error;
    }
  };

  // Buyurtma qo'shish
  const addOrder = async (orderData) => {
    try {
      const newOrder = {
        id: Date.now(),
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.customerAddress,
        payment_method: orderData.paymentMethod,
        items: orderData.items,
        total: orderData.total,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      const response = await fetch(`${supabaseUrl}/rest/v1/orders?apikey=${supabaseKey}`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
      });
      
      if (!response.ok) throw new Error('Buyurtma qo\'shishda xatolik');
      
      await loadData();
      return newOrder;
    } catch (error) {
      console.error('❌ addOrder xatosi:', error);
      throw error;
    }
  };

  // Xabar qo'shish
  const addContactMessage = async (messageData) => {
    try {
      const newMessage = {
        id: Date.now(),
        name: messageData.name,
        email: messageData.email,
        phone: messageData.phone,
        subject: messageData.subject,
        message: messageData.message,
        status: 'unread',
        created_at: new Date().toISOString()
      };
      
      const response = await fetch(`${supabaseUrl}/rest/v1/messages?apikey=${supabaseKey}`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
      });
      
      if (!response.ok) throw new Error('Xabar yuborishda xatolik');
      
      await loadData();
      return newMessage;
    } catch (error) {
      console.error('❌ addContactMessage xatosi:', error);
      throw error;
    }
  };

  // Statistikalar
  const getStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const unreadMessages = contactMessages.filter(m => m.status === 'unread').length;
    
    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      unreadMessages
    };
  };

  return (
    <AdminContext.Provider value={{
      products,
      orders,
      contactMessages,
      loading,
      isAdmin,
      showAdminModal,
      setShowAdminModal,
      loginAdmin,
      logoutAdmin,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      addContactMessage,
      getStats,
      refreshData: loadData
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);