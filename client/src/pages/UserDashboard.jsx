import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { ShoppingBag, History, Sparkles, Utensils, Clock, ChevronRight } from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const activeOrder = orders.find((o) => ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-3xl p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider">
            Student Dashboard
          </span>
          <h1 className="text-3xl font-black tracking-tight">
            Hello, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs text-amber-100">
            Welcome to CampusEats. What are you craving for today?
          </p>
        </div>

        <Link
          to="/menu"
          className="px-6 py-3.5 bg-white text-slate-900 font-extrabold text-xs rounded-2xl shadow-md hover:bg-slate-50 transition-all shrink-0"
        >
          Explore Canteen Menu
        </Link>
      </div>

      {/* Active Live Order Alert Banner */}
      {activeOrder && (
        <div className="bg-gradient-to-r from-slate-900 to-amber-950 text-white rounded-3xl p-6 shadow-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shrink-0 animate-pulse">
              ⚡
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                Live Active Order
              </span>
              <h3 className="text-base font-extrabold text-white">
                Order #{activeOrder._id.toString().slice(-6)} is currently {activeOrder.status}
              </h3>
            </div>
          </div>

          <Link
            to={`/live-tracking?orderId=${activeOrder._id}`}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all shrink-0"
          >
            Track Real-Time Status →
          </Link>
        </div>
      )}

      {/* Quick Action Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
          <span className="text-3xl font-black text-slate-900">{orders.length}</span>
          <p className="text-[11px] text-slate-500">Orders placed on CampusEats</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Spent</span>
          <span className="text-3xl font-black text-amber-800">
            ₹{orders.reduce((acc, o) => acc + o.totalAmount, 0)}
          </span>
          <p className="text-[11px] text-slate-500">Saved queue waiting time</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Default Pickup</span>
          <span className="text-sm font-extrabold text-slate-900 block truncate">Main Canteen Counter A</span>
          <p className="text-[11px] text-slate-500">Central College Block</p>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Recent Orders</h2>
          <Link to="/orders" className="text-xs font-bold text-amber-800 hover:underline">
            View All History →
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500">Loading recent orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No orders placed yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">#{order._id.toString().slice(-6)}</span>
                  <span className="text-slate-400 ml-2">({order.items?.length} items)</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900">₹{order.totalAmount}</span>
                  <Link
                    to={`/live-tracking?orderId=${order._id}`}
                    className="p-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-lg font-bold"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
