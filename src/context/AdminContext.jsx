import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendTelegramMessage, formatOrderMessage, formatContactMessage } from '../services/telegramService';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  // loading o'chirildi !!!!!!!!!!!!!!!!!
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('luxehome_admin') === 'true';
  });
  const [showAdminModal, setShowAdminModal] = useState(false);

  const supabaseUrl = 'https://hxrwrhbbijfntbrntpxk.supabase.co';
  const supabaseKey = 'sb_publishable_qnJTSPaIOR5tn0dZw2RdgA_w6WOjvsJ';

  // Ma'lumotlarni yuklash - loading'siz
  const loadData = async () => {
    try {
      console.log('🔍 Ma\'lumotlar yuklanmoqda...');
      
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
      console.error('❌ Ma\'lumotlarni yuklashda xatolik:', error);
      setProducts([]);
      setOrders([]);
      setContactMessages([]);
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

  // ============ MAHSULOTLAR ============
  
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

  // ============ BUYURTMALAR ============
  
  // Buyurtma qo'shish
  const addOrder = async (orderData) => {
    try {
      const now = new Date();
      const newOrder = {
        id: Date.now(),
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.customerAddress,
        payment_method: orderData.paymentMethod,
        items: orderData.items,
        total: orderData.total,
        status: 'pending',
        created_at: now.toISOString()
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
      
      // Telegramga xabar yuborish
      const message = formatOrderMessage({
        id: newOrder.id,
        customerName: newOrder.customer_name,
        customerPhone: newOrder.customer_phone,
        customerAddress: newOrder.customer_address,
        paymentMethod: newOrder.payment_method,
        items: newOrder.items,
        total: newOrder.total,
        status: newOrder.status,
        created_at: newOrder.created_at
      });
      await sendTelegramMessage(message);
      
      return newOrder;
    } catch (error) {
      console.error('❌ addOrder xatosi:', error);
      throw error;
    }
  };

  // Buyurtma holatini yangilash
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&apikey=${supabaseKey}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
      });
      
      if (!response.ok) throw new Error('Holatni yangilashda xatolik');
      
      await loadData();
      
      // Holat o'zgarishi haqida Telegramga xabar yuborish
      const order = orders.find(o => o.id === orderId);
      if (order) {
        const statusMessage = `
🔄 <b>BUYURTMA HOLATI O'ZGARDI</b> 🔄

<b>📋 Buyurtma #${orderId}</b>
<b>👤 Mijoz:</b> ${order.customer_name}
<b>📊 Yangi holat:</b> ${getStatusName(newStatus)}

🔗 <a href="${window.location.origin}/admin">Admin panelga o'tish</a>
        `;
        await sendTelegramMessage(statusMessage);
      }
      
      return true;
    } catch (error) {
      console.error('❌ updateOrderStatus xatosi:', error);
      throw error;
    }
  };

  // Buyurtmani o'chirish
  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/orders?id=eq.${orderId}&apikey=${supabaseKey}`, {
        method: 'DELETE',
        headers: { 'apikey': supabaseKey }
      });
      
      if (!response.ok) throw new Error('O\'chirishda xatolik');
      
      await loadData();
      return true;
    } catch (error) {
      console.error('❌ deleteOrder xatosi:', error);
      throw error;
    }
  };

  // ============ XABARLAR ============
  
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
      
      // Telegramga xabar yuborish
      const message = formatContactMessage(newMessage);
      await sendTelegramMessage(message);
      
      return newMessage;
    } catch (error) {
      console.error('❌ addContactMessage xatosi:', error);
      throw error;
    }
  };

  // Xabar statusini yangilash (o'qilgan/read)
  const updateMessageStatus = async (messageId, status) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/messages?id=eq.${messageId}&apikey=${supabaseKey}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: status,
          read_at: status === 'read' ? new Date().toISOString() : null
        })
      });
      
      if (!response.ok) throw new Error('Xabar statusini yangilashda xatolik');
      
      await loadData();
      return true;
    } catch (error) {
      console.error('❌ updateMessageStatus xatosi:', error);
      throw error;
    }
  };

  // Xabarni o'chirish
  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/messages?id=eq.${messageId}&apikey=${supabaseKey}`, {
        method: 'DELETE',
        headers: { 'apikey': supabaseKey }
      });
      
      if (!response.ok) throw new Error('Xabarni o\'chirishda xatolik');
      
      await loadData();
      return true;
    } catch (error) {
      console.error('❌ deleteMessage xatosi:', error);
      throw error;
    }
  };

  // ============ STATISTIKA ============
  
  const getStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const processingOrders = orders.filter(o => o.status === 'processing').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const unreadMessages = contactMessages.filter(m => m.status === 'unread').length;
    
    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      unreadMessages
    };
  };

  // Yordamchi funksiya
  const getStatusName = (status) => {
    const names = {
      pending: 'Kutilmoqda',
      processing: 'Jarayonda',
      completed: 'Bajarildi',
      cancelled: 'Bekor qilingan'
    };
    return names[status] || status;
  };

  return (
    <AdminContext.Provider value={{
      products,
      orders,
      contactMessages,
      // loading o'chirildi !!!!!!!!!!!!!!!!!
      isAdmin,
      showAdminModal,
      setShowAdminModal,
      loginAdmin,
      logoutAdmin,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      addContactMessage,
      updateMessageStatus,
      deleteMessage,
      getStats,
      refreshData: loadData
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);