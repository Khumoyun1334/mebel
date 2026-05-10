import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import ProductFormModal from './ProductFormModal';
import { 
  FiPackage, FiShoppingCart, FiCheckCircle, FiXCircle, 
  FiDollarSign, FiMail, FiMessageSquare, FiEye, FiTrash2,
  FiClock, FiUser, FiPhone, FiMail as FiMailIcon, FiTag,
  FiEdit2, FiPlus
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

  // contactMessages undefined bo'lsa, default qiymat
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
            <div className="flex gap-2">
              <button
                onClick={handleAddProduct}
                className="bg-success text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-green-700 transition-all flex items-center gap-1"
              >
                <FiPlus size={14} /> Yangi Mahsulot
              </button>
              <button
                onClick={handleLogout}
                className="border border-red-500 text-red-500 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-red-500 hover:text-white transition-all"
              >
                Chiqish
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-dark text-2xl">&times;</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-100 px-4 md:px-6 gap-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                activeTab === 'orders' 
                  ? 'text-accent border-b-2 border-accent' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📦 Buyurtmalar ({orders?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                activeTab === 'products' 
                  ? 'text-accent border-b-2 border-accent' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🛋️ Mahsulotlar ({products?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                activeTab === 'messages' 
                  ? 'text-accent border-b-2 border-accent' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📨 Xabarlar ({messages.filter(m => m.status === 'unread').length})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium transition-all whitespace-nowrap ${
                activeTab === 'stats' 
                  ? 'text-accent border-b-2 border-accent' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Statistika
            </button>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="p-4 md:p-6">
            {!orders || orders.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <FiPackage size={48} className="mx-auto mb-3 text-gray-300" />
                <p>Hali hech qanday buyurtma yo'q</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border border-gray-100 rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                      <div>
                        <span className="text-xs text-gray-400">#{order.id}</span>
                        <p className="font-semibold text-dark flex items-center gap-1">
                          <FiUser size={12} /> {order.customerName}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <FiPhone size={10} /> {order.customerPhone}
                        </p>
                        <p className="text-xs text-gray-400">{order.customerAddress}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-accent">${order.total.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <FiClock size={10} /> {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-3 mt-2">
                      <p className="text-xs text-gray-500 mb-2">Mahsulotlar:</p>
                      <div className="space-y-1">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="text-sm flex justify-between">
                            <span>{item.name} x{item.qty}</span>
                            <span className="text-dark">${(item.price * item.qty).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                      <div className="flex gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]} border-none outline-none cursor-pointer`}
                        >
                          <option value="pending">Kutilmoqda</option>
                          <option value="processing">Jarayonda</option>
                          <option value="completed">Bajarildi</option>
                          <option value="cancelled">Bekor qilingan</option>
                        </select>
                      </div>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-500 text-xs hover:underline flex items-center gap-1"
                      >
                        <FiTrash2 size={12} /> O'chirish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="p-4 md:p-6">
            <div className="flex flex-wrap gap-3 mb-6 justify-between items-center">
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 md:px-4 py-1 rounded-full text-xs md:text-sm transition-all ${
                      categoryFilter === cat 
                        ? 'bg-accent text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {categoryNames[cat]}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Mahsulot qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-full px-4 py-1.5 text-sm outline-none focus:border-accent w-48"
              />
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
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3">
                        <img src={product.img || product.images?.[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                      </td>
                      <td className="py-3 px-3 font-medium text-dark">{product.name}</td>
                      <td className="py-3 px-3 text-gray-500 text-xs">{product.category}</td>
                      <td className="py-3 px-3 font-semibold text-dark">${product.price.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1"
                          >
                            <FiEdit2 size={12} /> Tahrirlash
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                          >
                            <FiTrash2 size={12} /> O'chirish
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                Hech qanday mahsulot topilmadi
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="p-4 md:p-6">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Jami: {messages.length} ta xabar | 
                O'qilmagan: <span className="text-accent font-semibold">{messages.filter(m => m.status === 'unread').length}</span>
              </p>
            </div>
            
            {messages.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <div className="text-5xl mb-3">📭</div>
                <p>Hali hech qanday xabar yo'q</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`border rounded-xl p-5 transition-all ${
                      msg.status === 'unread' ? 'border-accent bg-accent/5 shadow-sm' : 'border-gray-100 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-dark">{msg.name}</h3>
                          {msg.status === 'unread' && (
                            <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">Yangi</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <FiMailIcon size={10} /> {msg.email}
                          </p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <FiPhone size={10} /> {msg.phone}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <FiClock size={10} /> {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <FiTag size={12} /> Mavzu: {msg.subject}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-gray-600 text-sm leading-relaxed">{msg.message}</p>
                    </div>
                    
                    <div className="flex gap-3">
                      {msg.status === 'unread' && (
                        <button
                          onClick={() => handleMarkAsRead(msg.id)}
                          className="text-accent text-sm hover:underline flex items-center gap-1"
                        >
                          <FiEye size={12} /> O'qilgan deb belgilash
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-red-500 text-sm hover:underline flex items-center gap-1"
                      >
                        <FiTrash2 size={12} /> O'chirish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
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
                <p className="text-2xl font-bold text-accent">${(stats.totalRevenue || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-500">Umumiy Daromad</p>
              </div>
            </div>

            <div className="bg-accent/10 rounded-xl p-4 md:p-5 mb-6">
              <h3 className="font-semibold text-dark mb-3 flex items-center gap-2">
                <FiMessageSquare size={18} /> Xabarlar statistikasi
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-accent">{messages.length}</p>
                  <p className="text-xs text-gray-500">Jami Xabarlar</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-500">{messages.filter(m => m.status === 'unread').length}</p>
                  <p className="text-xs text-gray-500">O'qilmagan Xabarlar</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 md:p-5 mb-6">
              <h3 className="font-semibold text-dark mb-3">So'nggi Buyurtmalar</h3>
              <div className="space-y-2">
                {(orders || []).slice(0, 5).map(order => (
                  <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-dark">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-accent">${order.total.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                        {statusNames[order.status]}
                      </span>
                    </div>
                  </div>
                ))}
                {(orders || []).length === 0 && (
                  <p className="text-center text-gray-400 py-4">Hali buyurtmalar yo'q</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 md:p-5">
              <h3 className="font-semibold text-dark mb-3">So'nggi Xabarlar</h3>
              <div className="space-y-2">
                {messages.slice(0, 5).map(msg => (
                  <div key={msg.id} className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-dark">{msg.name}</p>
                      <p className="text-xs text-gray-400">{msg.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                      {msg.status === 'unread' && (
                        <span className="text-xs text-accent font-semibold">Yangi</span>
                      )}
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-center text-gray-400 py-4">Hali xabarlar yo'q</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminPanel;