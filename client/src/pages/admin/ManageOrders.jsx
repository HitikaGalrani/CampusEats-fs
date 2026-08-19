import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { RefreshCw, Filter, Clock, CheckCircle2, Sparkles, ChefHat } from 'lucide-react';

const STATUS_OPTIONS = ['ALL', 'PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];

export const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { onEvent, offEvent } = useSocket();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'ALL' ? '/admin/orders' : `/admin/orders?status=${statusFilter}`;
      const res = await api.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // Listen for real-time new orders emitted via Socket.IO
  useEffect(() => {
    const handleNewOrder = (newOrder) => {
      console.log('⚡ [Socket.IO Admin Orders Page] New order arrived:', newOrder);
      setOrders((prev) => [newOrder, ...prev]);
    };

    onEvent('newOrder', handleNewOrder);
    return () => offEvent('newOrder', handleNewOrder);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: res.data.status } : o))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'PLACED':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'PREPARING':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'READY':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold animate-pulse';
      case 'COMPLETED':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Manage Canteen Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">Real-time status updates broadcast via WebSockets</p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Orders
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STATUS_OPTIONS.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === st
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <p className="text-sm font-bold text-slate-600">No orders found for this status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-slate-900">
                    Order #{order._id.toString().slice(-6)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                  <span>👤 <strong className="text-slate-900">{order.user?.name || 'Student'}</strong> ({order.user?.email})</span>
                  <span>📞 {order.user?.phone || 'No phone'}</span>
                  <span>📍 <strong className="text-amber-800">{order.pickupLocation}</strong></span>
                </div>

                {/* Items Summary */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Items ({order.items?.length})
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-800">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {item.quantity}x {item.name} (₹{item.price * item.quantity})
                      </span>
                    ))}
                  </div>
                  {order.specialInstructions && (
                    <p className="text-[11px] text-amber-800 mt-2 font-medium">
                      Note: "{order.specialInstructions}"
                    </p>
                  )}
                </div>
              </div>

              {/* Status Update Control Section */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Total Revenue</span>
                  <span className="text-2xl font-black text-slate-900">₹{order.totalAmount}</span>
                </div>

                <div className="space-y-1 text-left md:text-right w-full sm:w-auto">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Update Status</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl border-2 border-amber-400 text-xs font-extrabold bg-amber-50 text-amber-900 shadow-sm focus:outline-none"
                  >
                    <option value="PLACED">1. PLACED 🟡</option>
                    <option value="CONFIRMED">2. CONFIRMED 🔵</option>
                    <option value="PREPARING">3. PREPARING 🍳</option>
                    <option value="READY">4. READY FOR PICKUP 🎉</option>
                    <option value="COMPLETED">5. COMPLETED ✅</option>
                  </select>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
