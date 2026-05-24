import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import ProductFormModal from '../components/ProductFormModal';

function AdminPanelPage() {
  const navigate = useNavigate();
  const { products, deleteProduct, logoutAdmin } = useAdmin();
  const { showToast } = useToast();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', 'Oshxona Mebellari', 'Yotoqxona Mebellari', 'Mehmonxona Mebellari', 'Yumshoq Mebellar', 'Ofis Mebellari'];
  const categoryNames = {
    'all': 'Barchasi',
    'Oshxona Mebellari': 'Oshxona Mebellari',
    'Yotoqxona Mebellari': 'Yotoqxona Mebellari',
    'Mehmonxona Mebellari': 'Mehmonxona Mebellari',
    'Yumshoq Mebellar': 'Yumshoq Mebellar',
    'Ofis Mebellari': 'Ofis Mebellari'
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`"${name}" mahsulotini o'chirmoqchimisiz?`)) {
      deleteProduct(id);
      showToast(`${name} o'chirildi`, "error");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleLogout = () => {
    logoutAdmin();
    showToast("Admin paneldan chiqildi", "info");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-lightBg pt-[72px]">

      <div className="bg-dark text-white py-4 px-4 md:px-8 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-serif">Admin Panel</h1>
            <p className="text-gray-400 text-xs md:text-sm">Mahsulotlarni boshqaring</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="bg-success text-white px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-green-700 transition-all"
            >
              + Yangi Mahsulot
            </button>
            <button
              onClick={handleLogout}
              className="border border-red-500 text-red-500 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-red-500 hover:text-white transition-all"
            >
              Chiqish
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
    
        <div className="flex flex-wrap gap-3 mb-6 justify-between items-center bg-white p-3 md:p-4 rounded-xl shadow-sm">
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
            className="border border-gray-300 rounded-full px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm outline-none focus:border-accent w-48 md:w-64"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-semibold text-gray-600">Rasm</th>
                  <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-semibold text-gray-600">Nomi</th>
                  <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-semibold text-gray-600">Kategoriya</th>
                  <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-semibold text-gray-600">Narxi</th>
                  <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-semibold text-gray-600">Reyting</th>
                  <th className="text-left py-3 px-3 md:px-4 text-xs md:text-sm font-semibold text-gray-600">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 md:px-4">
                      <img src={product.img} alt={product.name} className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover" />
                    </td>
                    <td className="py-3 px-3 md:px-4 font-medium text-dark text-xs md:text-sm">{product.name}</td>
                    <td className="py-3 px-3 md:px-4 text-gray-600 text-xs md:text-sm">{product.category}</td>
                    <td className="py-3 px-3 md:px-4 font-semibold text-dark text-xs md:text-sm">${product.price.toLocaleString()}</td>
                    <td className="py-3 px-3 md:px-4 text-xs md:text-sm">
                      <span className="flex items-center gap-1">
                        ⭐ {product.rating} ({product.reviews})
                      </span>
                    </td>
                    <td className="py-3 px-3 md:px-4">
                      <div className="flex gap-2 md:gap-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-500 hover:text-blue-700 text-xs md:text-sm flex items-center gap-1"
                        >
                          ✏️ Tahrirlash
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-500 hover:text-red-700 text-xs md:text-sm flex items-center gap-1"
                        >
                          🗑️ O'chirish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 md:py-10 text-gray-500 text-sm">
              Hech qanday mahsulot topilmadi
            </div>
          )}
          
          <div className="px-3 md:px-4 py-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
            Jami: {filteredProducts.length} ta mahsulot
          </div>
        </div>
      </div>

      {showForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}

export default AdminPanelPage;