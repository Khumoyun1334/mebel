import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import ProductFormModal from './ProductFormModal';
import * as XLSX from 'xlsx';
import { formatPrice } from '../utils/formatPrice';
import { 
  FiPackage, FiShoppingCart, FiCheckCircle, FiXCircle, 
  FiDollarSign, FiMail, FiMessageSquare, FiEye, FiTrash2,
  FiClock, FiUser, FiPhone, FiMail as FiMailIcon, FiTag,
  FiEdit2, FiPlus, FiCalendar, FiPrinter, FiStar, FiStar as FiStarOutline,
  FiDownload, FiBarChart2
} from 'react-icons/fi';

function AdminPanel({ onClose }) {
  const { 
    products, 
    orders, 
    contactMessages,
    logoutAdmin, 
    updateOrderStatus, 
    deleteOrder,
    deleteProduct,
    updateMessageStatus,
    deleteMessage,
    getStats 
  } = useAdmin();
  
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [allReviews, setAllReviews] = useState([]);

  // Barcha baholarni yuklash
  useEffect(() => {
    loadAllReviews();
  }, []);

  const loadAllReviews = () => {
    const reviews = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('reviews_')) {
        const productId = key.replace('reviews_', '');
        const productReviews = JSON.parse(localStorage.getItem(key));
        productReviews.forEach(review => {
          reviews.push({
            ...review,
            productId: parseInt(productId)
          });
        });
      }
    }
    setAllReviews(reviews.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const deleteReview = (reviewId, productId) => {
    if (window.confirm('Fikrni o\'chirmoqchimisiz?')) {
      const key = `reviews_${productId}`;
      const reviews = JSON.parse(localStorage.getItem(key));
      const updatedReviews = reviews.filter(r => r.id !== reviewId);
      localStorage.setItem(key, JSON.stringify(updatedReviews));
      loadAllReviews();
      showToast("Fikr o'chirildi", "success");
    }
  };

  // Vaqtni formatlash
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Noma\'lum';
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      full: date.toLocaleString('uz-UZ')
    };
  };

  // Excel eksport (so'mda)
  const exportToExcel = () => {
    try {
      const exportData = orders.map(order => ({
        'ID': order.id,
        'Mijoz Ismi': order.customer_name || order.customerName,
        'Telefon': order.customer_phone || order.customerPhone,
        'Manzil': order.customer_address || order.customerAddress,
        'To\'lov Turi': order.payment_method === 'cash' ? 'Naqd pul' : 
                       order.payment_method === 'card' ? 'Plastik karta' :
                       order.payment_method === 'click' ? 'Click' :
                       order.payment_method === 'payme' ? 'Payme' : order.payment_method,
        'Mahsulotlar': (order.items || []).map(item => `${item.name} x${item.qty}`).join(', '),
        'Jami Summa (so\'m)': (order.total || 0).toLocaleString(),
        'Holat': order.status === 'pending' ? 'Kutilmoqda' :
                 order.status === 'processing' ? 'Jarayonda' :
                 order.status === 'completed' ? 'Bajarildi' :
                 order.status === 'cancelled' ? 'Bekor qilingan' : order.status,
        'Buyurtma Vaqti': formatDateTime(order.created_at || order.createdAt).full
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Buyurtmalar');
      
      const fileName = `buyurtmalar_${new Date().toLocaleDateString('uz-UZ')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      showToast(`${orders.length} ta buyurtma Excel faylga yuklandi`, "success");
    } catch (error) {
      console.error('Excel eksport xatosi:', error);
      showToast("Excel fayl yaratishda xatolik", "error");
    }
  };

  // Chop etish (so'mda)
  const printOrders = () => {
    const ordersToPrint = selectedOrders.length > 0 
      ? orders.filter(o => selectedOrders.includes(o.id))
      : orders;
    
    if (ordersToPrint.length === 0) {
      showToast("Chop etish uchun buyurtma yo'q", "error");
      return;
    }

    const printWindow = window.open('', '_blank');
    
    const statusNames = {
      pending: 'Kutilmoqda',
      processing: 'Jarayonda',
      completed: 'Bajarildi',
      cancelled: 'Bekor qilingan'
    };

    const paymentNames = {
      cash: 'Naqd pul',
      card: 'Plastik karta',
      click: 'Click',
      payme: 'Payme'
    };

    let totalSum = 0;
    let ordersHtml = '';

    ordersToPrint.forEach((order) => {
      const orderTotal = order.total || 0;
      totalSum += orderTotal;
      
      const orderItems = (order.items || []).map(item => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatPrice(item.price * item.qty)}</td>
        </tr>
      `).join('');

      ordersHtml += `
        <div style="page-break-after: always; margin-bottom: 30px;">
          <div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <div style="border-bottom: 2px solid #C89B6D; padding-bottom: 10px; margin-bottom: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 style="color: #C89B6D; margin: 0;">Buyurtma #${order.id}</h2>
                <span style="background: ${order.status === 'pending' ? '#fef3c7' : order.status === 'completed' ? '#d1fae5' : '#fee2e2'}; padding: 4px 12px; border-radius: 20px; font-size: 12px;">
                  ${statusNames[order.status] || order.status}
                </span>
              </div>
            </div>
            
            <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 20px;">
              <div style="flex: 1; background: #f9f9f9; padding: 15px; border-radius: 8px;">
                <h3 style="margin-top: 0; color: #666;">👤 Mijoz ma'lumotlari</h3>
                <p><strong>Ism:</strong> ${order.customer_name || order.customerName}</p>
                <p><strong>Telefon:</strong> ${order.customer_phone || order.customerPhone}</p>
                <p><strong>Manzil:</strong> ${order.customer_address || order.customerAddress}</p>
              </div>
              <div style="flex: 1; background: #f9f9f9; padding: 15px; border-radius: 8px;">
                <h3 style="margin-top: 0; color: #666;">📅 Buyurtma vaqti</h3>
                <p><strong>Sana:</strong> ${new Date(order.created_at || order.createdAt).toLocaleDateString('uz-UZ')}</p>
                <p><strong>Vaqt:</strong> ${new Date(order.created_at || order.createdAt).toLocaleTimeString('uz-UZ')}</p>
                <p><strong>To'lov:</strong> ${paymentNames[order.payment_method] || order.payment_method}</p>
              </div>
            </div>
            
            <div>
              <h3 style="color: #666;">🛒 Mahsulotlar</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f0f0f0;">
                    <th style="padding: 10px; text-align: left;">Mahsulot</th>
                    <th style="padding: 10px; text-align: center;">Soni</th>
                    <th style="padding: 10px; text-align: right;">Bir narxi</th>
                    <th style="padding: 10px; text-align: right;">Jami</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItems}
                </tbody>
                <tfoot>
                  <tr style="background: #f9f9f9;">
                    <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">JAMI:</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold; color: #C89B6D;">${formatPrice(orderTotal)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      `;
    });

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Buyurtmalar ro'yxati</title>
        <meta charset="UTF-8">
        <style>
          @media print { body { margin: 0; padding: 20px; } .no-print { display: none; } }
          body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #fff; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #C89B6D; }
          .header h1 { color: #C89B6D; margin: 0; }
          .summary { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏠 Azizbek Mebellari</h1>
          <p>Buyurtmalar ro'yxati</p>
          <p>Sana: ${new Date().toLocaleDateString('uz-UZ')} | Vaqt: ${new Date().toLocaleTimeString('uz-UZ')}</p>
        </div>
        <div class="summary">
          <span><strong>📊 Jami buyurtmalar:</strong> ${ordersToPrint.length} ta</span>
          <span><strong>💰 Umumiy summa:</strong> ${formatPrice(totalSum)}</span>
        </div>
        ${ordersHtml}
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print();">🖨️ Chop etish</button>
          <button onclick="window.close();" style="margin-left: 10px; background: #666;">❌ Yopish</button>
        </div>
        <script>setTimeout(() => window.print(), 500);</script>
      </body>
      </html>
    `;

    printWindow.document.write(printHtml);
    printWindow.document.close();
    showToast(`${ordersToPrint.length} ta buyurtma chop etishga yuborildi`, "success");
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders?.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o.id));
    }
  };

  const messages = contactMessages || [];
  const stats = getStats ? getStats() : { 
    totalOrders: 0, pendingOrders: 0, completedOrders: 0, 
    cancelledOrders: 0, totalRevenue: 0, unreadMessages: 0 
  };
  
  const categories = ['all', 'Oshxona Mebellari', 'Yotoqxona Mebellari', 'Mehmonxona Mebellari', 'Yumshoq Mebellar', 'Ofis Mebellari'];
  const categoryNames = {
    'all': 'Barchasi',
    'Oshxona Mebellari': 'Oshxona Mebellari',
    'Yotoqxona Mebellari': 'Yotoqxona Mebellari',
    'Mehmonxona Mebellari': 'Mehmonxona Mebellari',
    'Yumshoq Mebellar': 'Yumshoq Mebellar',
    'Ofis Mebellari': 'Ofis Mebellari'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  const statusNames = {
    pending: 'Kutilmoqda',
    processing: 'Jarayonda',
    completed: 'Bajarildi',
    cancelled: 'Bekor qilingan'
  };

  const filteredProducts = (products || []).filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`"${name}" mahsulotini o'chirmoqchimisiz?`)) {
      deleteProduct(id);
      showToast(`${name} o'chirildi`, "error");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Buyurtma holati "${statusNames[newStatus]}" ga o'zgartirildi`, "success");
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Buyurtmani o\'chirmoqchimisiz?')) {
      deleteOrder(orderId);
      showToast("Buyurtma o'chirildi", "error");
    }
  };

  const handleMarkAsRead = (messageId) => {
    updateMessageStatus(messageId, 'read');
    showToast("Xabar o'qilgan deb belgilandi", "success");
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Xabarni o\'chirmoqchimisiz?')) {
      deleteMessage(messageId);
      showToast("Xabar o'chirildi", "error");
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    showToast("Admin paneldan chiqildi", "info");
    onClose();
  };

  // Statistikada daromadni so'mda ko'rsatish
  const formatRevenue = (revenue) => {
    if (!revenue) return '0 so\'m';
    if (revenue >= 1000000) {
      return (revenue / 1000000).toFixed(1) + ' mln so\'m';
    }
    return revenue.toLocaleString() + ' so\'m';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[2000] overflow-y-auto py-8 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-6xl w-full mx-4 my-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
          <div className="flex flex-wrap justify-between items-center p-4 md:p-6 gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-serif text-dark">Admin Panel</h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Mahsulotlar, buyurtmalar va xabarlarni boshqaring</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={handleAddProduct} className="bg-success text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-green-700 transition-all flex items-center gap-1">
                <FiPlus size={14} /> Yangi Mahsulot
              </button>
              <button onClick={handleLogout} className="border border-red-500 text-red-500 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-red-500 hover:text-white transition-all">
                Chiqish
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-dark text-2xl">&times;</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-100 px-4 md:px-6 gap-1">
            <button onClick={() => setActiveTab('orders')} className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${activeTab === 'orders' ? 'text-accent border-b-2 border-accent' : 'text-gray-500 hover:text-gray-700'}`}>
              📦 Buyurtmalar ({orders?.length || 0})
            </button>
            <button onClick={() => setActiveTab('products')} className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${activeTab === 'products' ? 'text-accent border-b-2 border-accent' : 'text-gray-500 hover:text-gray-700'}`}>
              🛋️ Mahsulotlar ({products?.length || 0})
            </button>
            <button onClick={() => setActiveTab('messages')} className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${activeTab === 'messages' ? 'text-accent border-b-2 border-accent' : 'text-gray-500 hover:text-gray-700'}`}>
              📨 Xabarlar ({messages.filter(m => m.status === 'unread').length})
            </button>
            <button onClick={() => setActiveTab('reviews')} className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${activeTab === 'reviews' ? 'text-accent border-b-2 border-accent' : 'text-gray-500 hover:text-gray-700'}`}>
              ⭐ Baholar ({allReviews.length})
            </button>
            <button onClick={() => setActiveTab('stats')} className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${activeTab === 'stats' ? 'text-accent border-b-2 border-accent' : 'text-gray-500 hover:text-gray-700'}`}>
              📊 Statistika
            </button>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="p-4 md:p-6">
            <div className="flex flex-wrap gap-3 mb-6 justify-between items-center">
              <div className="flex gap-2">
                <button onClick={printOrders} className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent-dark transition-all flex items-center gap-2">
                  <FiPrinter size={16} /> Chop etish ({selectedOrders.length > 0 ? selectedOrders.length : orders?.length || 0} ta)
                </button>
                <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-all flex items-center gap-2">
                  <FiDownload size={16} /> Excel
                </button>
                {selectedOrders.length > 0 && (
                  <button onClick={() => setSelectedOrders([])} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all">
                    Tanlovni bekor qilish
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={selectedOrders.length === orders?.length && orders?.length > 0} onChange={toggleSelectAll} className="w-4 h-4 rounded border-gray-300 text-accent" />
                  Hammasini tanlash
                </label>
                <p className="text-sm text-gray-500">Jami: {orders?.length || 0} ta buyurtma</p>
              </div>
            </div>
            
            {!orders || orders.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <FiPackage size={48} className="mx-auto mb-3 text-gray-300" />
                <p>Hali hech qanday buyurtma yo'q</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => {
                  const dateTime = formatDateTime(order.created_at || order.createdAt);
                  const isSelected = selectedOrders.includes(order.id);
                  return (
                    <div key={order.id} className={`border rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow ${isSelected ? 'border-accent bg-accent/5' : 'border-gray-100'}`}>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleOrderSelection(order.id)} className="mt-1 w-4 h-4 rounded border-gray-300 text-accent" />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400">#{order.id}</span>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1"><FiCalendar size={10} /> {dateTime.date}</span>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1"><FiClock size={10} /> {dateTime.time}</span>
                          </div>
                          <p className="font-semibold text-dark flex items-center gap-1"><FiUser size={12} /> {order.customer_name || order.customerName}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><FiPhone size={10} /> {order.customer_phone || order.customerPhone}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{order.customer_address || order.customerAddress}</p>
                          <div className="border-t border-gray-100 pt-3 mt-3">
                            <p className="text-xs text-gray-500 mb-2">Mahsulotlar:</p>
                            <div className="space-y-1">
                              {(order.items || []).map((item, idx) => (
                                <div key={idx} className="text-sm flex justify-between">
                                  <span>{item.name} x{item.qty}</span>
                                  <span className="text-dark">{formatPrice(item.price * item.qty)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-wrap justify-between items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                            <div className="flex gap-2">
                              <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]} border-none outline-none cursor-pointer`}>
                                <option value="pending">Kutilmoqda</option>
                                <option value="processing">Jarayonda</option>
                                <option value="completed">Bajarildi</option>
                                <option value="cancelled">Bekor qilingan</option>
                              </select>
                              <span className="text-sm font-semibold text-accent">{formatPrice(order.total || 0)}</span>
                            </div>
                            <button onClick={() => handleDeleteOrder(order.id)} className="text-red-500 text-xs hover:underline flex items-center gap-1">
                              <FiTrash2 size={12} /> O'chirish
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Products Tab - Narx so'mda */}
        {activeTab === 'products' && (
          <div className="p-4 md:p-6">
            <div className="flex flex-wrap gap-3 mb-6 justify-between items-center">
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 md:px-4 py-1 rounded-full text-xs md:text-sm transition-all ${categoryFilter === cat ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {categoryNames[cat]}
                  </button>
                ))}
              </div>
              <input type="text" placeholder="Mahsulot qidirish..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border border-gray-300 rounded-full px-4 py-1.5 text-sm outline-none focus:border-accent w-48" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Rasm</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Nomi</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Kategoriya</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Narxi</th>
                    <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3"><img src={product.img || product.images?.[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" /></td>
                      <td className="py-3 px-3 font-medium text-dark">{product.name}</td>
                      <td className="py-3 px-3 text-gray-500 text-xs">{product.category}</td>
                      <td className="py-3 px-3 font-semibold text-dark">{formatPrice(product.price)}</td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEditProduct(product)} className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1"><FiEdit2 size={12} /> Tahrirlash</button>
                          <button onClick={() => handleDeleteProduct(product.id, product.name)} className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"><FiTrash2 size={12} /> O'chirish</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && <div className="text-center py-8 text-gray-500 text-sm">Hech qanday mahsulot topilmadi</div>}
          </div>
        )}

        {/* Messages Tab */}
{activeTab === 'messages' && (
  <div className="p-4 md:p-6">
    <div className="mb-4 flex justify-between items-center">
      <p className="text-sm text-gray-500">
        Jami: {contactMessages?.length || 0} ta xabar | 
        O'qilmagan: <span className="text-accent font-semibold">{contactMessages?.filter(m => m.status === 'unread').length || 0}</span>
      </p>
      <button
        onClick={() => {
          window.location.reload();
        }}
        className="text-accent text-sm hover:underline flex items-center gap-1"
      >
        🔄 Yangilash
      </button>
    </div>
    
    {!contactMessages || contactMessages.length === 0 ? (
      <div className="text-center py-10 text-gray-500">
        <div className="text-5xl mb-3">📭</div>
        <p>Hali hech qanday xabar yo'q</p>
      </div>
    ) : (
      <div className="space-y-4">
        {contactMessages.map((msg, index) => {
          const dateTime = formatDateTime(msg.created_at || msg.createdAt);
          return (
            <div 
              key={msg.id || index} 
              className={`border rounded-xl p-5 transition-all ${
                msg.status === 'unread' ? 'border-accent bg-accent/5 shadow-sm' : 'border-gray-100 bg-white'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-dark text-base">{msg.name || "Noma'lum"}</h3>
                    {msg.status === 'unread' && (
                      <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">Yangi</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <FiMailIcon size={12} /> {msg.email || "Email yo'q"}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <FiPhone size={12} /> {msg.phone || "Telefon yo'q"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 flex flex-col items-end gap-0.5">
                    <span className="flex items-center gap-1">
                      <FiCalendar size={12} /> {dateTime.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock size={12} /> {dateTime.time}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-3 mt-2">
                <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                  <FiTag size={14} /> Mavzu: 
                  <span className="font-normal">{msg.subject || "Mavzu yo'q"}</span>
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {msg.message || "Xabar matni yo'q"}
                </p>
              </div>
              
              <div className="flex gap-3">
                {msg.status === 'unread' && (
                  <button
                    onClick={async () => {
                      await updateMessageStatus(msg.id, 'read');
                      showToast("Xabar o'qilgan deb belgilandi", "success");
                      // Refresh page to update message status
                      window.location.reload();
                    }}
                    className="text-accent text-sm hover:underline flex items-center gap-1"
                  >
                    <FiEye size={14} /> O'qilgan deb belgilash
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (window.confirm('Xabarni o\'chirmoqchimisiz?')) {
                      await deleteMessage(msg.id);
                      showToast("Xabar o'chirildi", "error");
                      window.location.reload();
                    }
                  }}
                  className="text-red-500 text-sm hover:underline flex items-center gap-1"
                >
                  <FiTrash2 size={14} /> O'chirish
                </button>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
)}

        {/* Stats Tab - Daromad so'mda */}
        {activeTab === 'stats' && (
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-3 md:p-4 text-center">
                <FiShoppingCart size={24} className="mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-blue-600">{stats.totalOrders || 0}</p>
                <p className="text-xs text-gray-500">Jami Buyurtmalar</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-3 md:p-4 text-center">
                <FiClock size={24} className="mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders || 0}</p>
                <p className="text-xs text-gray-500">Kutilayotgan</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 md:p-4 text-center">
                <FiCheckCircle size={24} className="mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold text-green-600">{stats.completedOrders || 0}</p>
                <p className="text-xs text-gray-500">Bajarilgan</p>
              </div>
              <div className="bg-red-50 rounded-xl p-3 md:p-4 text-center">
                <FiXCircle size={24} className="mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold text-red-600">{stats.cancelledOrders || 0}</p>
                <p className="text-xs text-gray-500">Bekor qilingan</p>
              </div>
              <div className="bg-accent/10 rounded-xl p-3 md:p-4 text-center">
                <FiDollarSign size={24} className="mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold text-accent">{formatRevenue(stats.totalRevenue || 0)}</p>
                <p className="text-xs text-gray-500">Umumiy Daromad</p>
              </div>
            </div>
            {/* Qolgan statistikalar o'zgarishsiz */}
          </div>
        )}

        {/* Qolgan tablar (messages, reviews) o'zgarishsiz */}
      </div>

      {/* Product Form Modal */}
      {showProductForm && <ProductFormModal product={editingProduct} onClose={() => { setShowProductForm(false); setEditingProduct(null); }} />}
    </div>
  );
}

export default AdminPanel;