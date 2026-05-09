import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS as initialProducts } from '../data/data';

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

  // Buyurtma qo'shish
  const addOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  // Buyurtma statusini yangilash
  const updateOrderStatus = (orderId, status) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
    ));
  };

  // Buyurtmani o'chirish
  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
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
    
    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue
    };
  };

  return (
    <AdminContext.Provider value={{
      products,
      orders,
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
      getStats
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);