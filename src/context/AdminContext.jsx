import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as initialProducts } from '../data/data';
// AdminContext.jsx da
import { sendTelegramMessage, formatOrderMessage, formatContactMessage } from '../services/telegramService';
const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('luxehome_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('luxehome_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [contactMessages, setContactMessages] = useState(() => {
    const saved = localStorage.getItem('luxehome_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('luxehome_admin') === 'true';
  });
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('luxehome_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('luxehome_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('luxehome_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem('luxehome_admin', isAdmin);
  }, [isAdmin]);

  // Admin parolini tekshirish
  const loginAdmin = (password) => {
    if (password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  // Mahsulot qo'shish
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      reviews: 0,
      rating: 0
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  // Mahsulot tahrirlash
  const updateProduct = (id, updatedData) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...updatedData } : p
    ));
  };

  // Mahsulot o'chirish
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Mahsulotni ID bo'yicha topish
  const getProductById = (id) => {
    return products.find(p => p.id === parseInt(id));
  };

  // Buyurtma qo'shish + Telegramga yuborish
  const addOrder = async (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    
    // Telegramga yuborish
    const message = formatOrderMessage(newOrder);
    await sendTelegramMessage(message);
    
    return newOrder;
  };

  // Buyurtma statusini yangilash + Telegramga yuborish
  const updateOrderStatus = async (orderId, status) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const updatedOrder = { ...order, status, updatedAt: new Date().toISOString() };
      setOrders(prev => prev.map(o => 
        o.id === orderId ? updatedOrder : o
      ));
      
      // Status o'zgarishi haqida Telegramga yuborish
      const statusMessage = `
🔄 <b>BUYURTMA HOLATI O'ZGARDI</b> 🔄

<b>📋 Buyurtma #${orderId}</b>
<b>👤 Mijoz:</b> ${order.customerName}
<b>📊 Eski holat:</b> ${getStatusName(order.status)}
<b>📊 Yangi holat:</b> ${getStatusName(status)}

🔗 <a href="${window.location.origin}/admin">Admin panelga o'tish</a>
      `;
      await sendTelegramMessage(statusMessage);
    }
  };

  // Buyurtmani o'chirish
  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Contact xabar qo'shish + Telegramga yuborish
  const addContactMessage = async (messageData) => {
    const newMessage = {
      id: Date.now(),
      ...messageData,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    setContactMessages(prev => [newMessage, ...prev]);
    
    // Telegramga yuborish
    const message = formatContactMessage(newMessage);
    await sendTelegramMessage(message);
    
    return newMessage;
  };

  // Xabar statusini yangilash
  const updateMessageStatus = (messageId, status) => {
    setContactMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status, readAt: status === 'read' ? new Date().toISOString() : undefined } : msg
    ));
  };

  // Xabarni o'chirish
  const deleteMessage = (messageId) => {
    setContactMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  // Statistikalar
  const getStats = () => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);
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
      isAdmin,
      showAdminModal,
      setShowAdminModal,
      loginAdmin,
      logoutAdmin,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      addContactMessage,
      updateMessageStatus,
      deleteMessage,
      getStats
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);