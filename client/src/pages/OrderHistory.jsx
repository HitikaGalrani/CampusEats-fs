import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { History, Eye, Clock, ChevronRight, RefreshCw } from 'lucide-react';

export const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch order history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'READY':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PREPARING':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'COMPLETED':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Your Order History
        </h1>
        <p className="text-xs text-slate-500 mt-1">View past canteen orders and track live status</p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
            🛍️
          </div>
          <h3 className="text-lg font-bold text-slate-800">No previous orders yet</h3>
          <p className="text-xs text-slate-500">You haven't placed any orders in CampusEats canteen.</p>
          <Link to="/menu" className="px-5 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl inline-block">
            Order Food Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-slate-900">
                    Order #{order._id.toString().slice(-6)}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span>📍 {order.pickupLocation}</span>
                  <span>•</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                <div className="text-right">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Total Paid</span>
                  <span className="text-base font-black text-slate-900">₹{order.totalAmount}</span>
                </div>

                <Link
                  to={`/live-tracking?orderId=${order._id}`}
                  className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-200 flex items-center gap-1 transition-colors"
                >
                  Track / Details
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
