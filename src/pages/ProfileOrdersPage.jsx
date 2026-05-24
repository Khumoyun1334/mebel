import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FiPackage, FiClock, FiEye } from 'react-icons/fi';

function ProfileOrdersPage() {
  const { user, getUserOrders } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getUserOrders();
    setOrders(data);
    setLoading(false);
  };

  const statusNames = {
    pending: 'Kutilmoqda',
    processing: 'Jarayonda',
    completed: 'Bajarildi',
    cancelled: 'Bekor qilingan'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
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
        <h1 className="text-2xl md:text-3xl font-serif text-dark mb-6">Buyurtmalarim</h1>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <FiPackage size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 mb-4">Hali hech qanday buyurtma yo'q</p>
            <Link to="/products" className="bg-accent text-white px-6 py-2 rounded-full inline-block">
              Mahsulotlarni ko'rish
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-dark">Buyurtma #{order.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                        {statusNames[order.status]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <FiClock size={12} />
                      {new Date(order.created_at).toLocaleString('uz-UZ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-accent">${order.total?.toLocaleString() || 0}</p>
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
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm">
                    <span className="text-gray-500">Yetkazib berish manzili:</span>{' '}
                    <span className="text-dark">{order.customer_address}</span>
                  </p>
                  <p className="text-sm mt-1">
                    <span className="text-gray-500">To'lov turi:</span>{' '}
                    <span className="text-dark">
                      {order.payment_method === 'cash' ? 'Naqd pul' :
                       order.payment_method === 'card' ? 'Plastik karta' :
                       order.payment_method === 'click' ? 'Click' :
                       order.payment_method === 'payme' ? 'Payme' : order.payment_method}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileOrdersPage;