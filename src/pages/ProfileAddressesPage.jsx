import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiMapPin, FiPlus, FiEdit2, FiTrash2, FiHome } from 'react-icons/fi';

function ProfileAddressesPage() {
  const { user, getSavedAddresses, addAddress, updateAddress, deleteAddress } = useAuth();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: 'Toshkent',
    district: '',
    is_default: false
  });

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    setLoading(true);
    const data = await getSavedAddresses();
    setAddresses(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.phone || !formData.address) {
      showToast("Barcha majburiy maydonlarni to'ldiring!", "error");
      return;
    }

    let result;
    if (editingAddress) {
      result = await updateAddress(editingAddress.id, formData);
    } else {
      result = await addAddress(formData);
    }
    
    if (result) {
      showToast(editingAddress ? "Manzil yangilandi" : "Manzil qo'shildi", "success");
      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        full_name: '',
        phone: '',
        address: '',
        city: 'Toshkent',
        district: '',
        is_default: false
      });
      loadAddresses();
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      full_name: address.full_name || '',
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || 'Toshkent',
      district: address.district || '',
      is_default: address.is_default || false
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Manzilni o\'chirmoqchimisiz?')) {
      await deleteAddress(id);
      showToast("Manzil o'chirildi", "success");
      loadAddresses();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-lightBg flex items-center justify-center pt-[72px]">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Iltimos, avval kiring</p>
          <Link to="/" className="bg-accent text-white px-6 py-2 rounded-full">Bosh sahifaga o'tish</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightBg pt-[72px]">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-serif text-dark">Manzillarim</h1>
          <button
            onClick={() => {
              setEditingAddress(null);
              setFormData({
                full_name: '',
                phone: '',
                address: '',
                city: 'Toshkent',
                district: '',
                is_default: false
              });
              setShowForm(true);
            }}
            className="bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1"
          >
            <FiPlus size={16} /> Yangi manzil
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <FiMapPin size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Hali hech qanday manzil qo'shilmagan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map(address => (
              <div key={address.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-accent" />
                      <h3 className="font-semibold text-dark">{address.full_name}</h3>
                      {address.is_default && (
                        <span className="bg-accent/10 text-accent text-xs px-2 py-0.5 rounded-full">Asosiy</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{address.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {address.address}, {address.district}, {address.city}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Manzil qo'shish/tahrirlash modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif text-dark">
                  {editingAddress ? "Manzilni tahrirlash" : "Yangi manzil qo'shish"}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-dark text-2xl">&times;</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">To'liq ism *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Telefon *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Shahar</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-accent"
                  >
                    <option value="Toshkent">Toshkent</option>
                    <option value="Samarqand">Samarqand</option>
                    <option value="Buxoro">Buxoro</option>
                    <option value="Andijon">Andijon</option>
                    <option value="Farg'ona">Farg'ona</option>
                    <option value="Namangan">Namangan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Tuman</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Masalan: Chilonzor"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Manzil *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Ko'cha, uy raqami"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-accent resize-none"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                  />
                  <label className="text-sm text-gray-600">Asosiy manzil qilib belgilash</label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent text-white rounded-full py-2 font-semibold hover:bg-accent-dark transition-all"
                >
                  {editingAddress ? "Saqlash" : "Qo'shish"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileAddressesPage;