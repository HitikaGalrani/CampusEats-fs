import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import {
  ShoppingBag,
  IndianRupee,
  Clock,
  ChefHat,
  Sparkles,
  Utensils,
  Users,
  ChevronRight,
  RefreshCw,
  Bell,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState(null);

  const { onEvent, offEvent } = useSocket();

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data);
      setRecentOrders(res.data.recentOrders || []);
    } catch (err) {
      console.error('Failed to fetch admin dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Listen for real-time new orders emitted via Socket.IO
  useEffect(() => {
    const handleNewOrder = (order) => {
      console.log('⚡ [Socket.IO Admin] New order received instantly:', order);
      setNewOrderAlert(`⚡ New Order #${order._id.toString().slice(-6)} placed by ${order.user?.name || 'Student'} (₹${order.totalAmount})`);
      
      // Update local state without full refresh
      setRecentOrders((prev) => [order, ...prev.slice(0, 9)]);
      setStats((prevStats) => {
        if (!prevStats) return prevStats;
        return {
          ...prevStats,
          todaysOrdersCount: prevStats.todaysOrdersCount + 1,
          todaysRevenue: prevStats.todaysRevenue + order.totalAmount,
          pendingOrdersCount: prevStats.pendingOrdersCount + 1,
        };
      });

      setTimeout(() => setNewOrderAlert(null), 6000);
    };

    onEvent('newOrder', handleNewOrder);
    return () => offEvent('newOrder', handleNewOrder);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchDashboardData(); // Refresh stats
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-500">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Real-time Order Notification Banner */}
      {newOrderAlert && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-white animate-spin" />
            <p className="font-extrabold text-sm">{newOrderAlert}</p>
          </div>
          <Link
            to="/admin/orders"
            className="px-4 py-1.5 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow"
          >
            Manage Orders
          </Link>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
            Canteen Control Center
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/menu/add"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
          >
            + Add Menu Item
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* 5 Technical Requirement Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Today's Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Today's Orders</span>
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 block">
            {stats?.todaysOrdersCount || 0}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Recorded today</span>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Today's Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-emerald-600 block">
            ₹{stats?.todaysRevenue || 0}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Total INR earned</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Pending</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-800 block">
            {stats?.pendingOrdersCount || 0}
          </span>
          <span className="text-[10px] text-amber-700 font-bold">Needs Confirmation</span>
        </div>

        {/* Preparing Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Preparing</span>
            <ChefHat className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-amber-600 block">
            {stats?.preparingOrdersCount || 0}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">In Kitchen</span>
        </div>

        {/* Ready Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Ready for Pickup</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-emerald-700 block">
            {stats?.readyOrdersCount || 0}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">At Counter</span>
        </div>

      </div>

      {/* Admin Navigation Quick Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          to="/admin/menu"
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Manage Menu</h3>
              <p className="text-[10px] text-slate-400">{stats?.totalMenuItemsCount || 0} items</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700" />
        </Link>

        <Link
          to="/admin/categories"
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              📁
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Categories</h3>
              <p className="text-[10px] text-slate-400">Manage Menu Types</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700" />
        </Link>

        <Link
          to="/admin/users"
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">View Users</h3>
              <p className="text-[10px] text-slate-400">{stats?.totalUsersCount || 0} students</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700" />
        </Link>

        <Link
          to="/admin/reviews"
          className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              ⭐
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs">Food Ratings</h3>
              <p className="text-[10px] text-slate-400">Reviews & Stars</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700" />
        </Link>
      </div>

      {/* Real-time Recent Incoming Orders Feed */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              Recent Orders (Live Socket Feed)
            </h2>
            <p className="text-xs text-slate-500">Updates instantly when students place new orders</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-bold text-amber-800 hover:underline">
            View All ({stats?.todaysOrdersCount || 0}) →
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentOrders.map((order) => (
            <div key={order._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    Order #{order._id.toString().slice(-6)}
                  </span>
                  <span className="text-xs text-slate-600 font-semibold">
                    • {order.user?.name || 'Student'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </p>
                <span className="text-[10px] text-slate-400 block mt-1">
                  📍 {order.pickupLocation} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                <span className="font-black text-slate-900 text-sm">₹{order.totalAmount}</span>

                {/* Quick Status Update Selector */}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-extrabold bg-slate-50 text-slate-800 focus:border-amber-500"
                >
                  <option value="PLACED">PLACED 🟡</option>
                  <option value="CONFIRMED">CONFIRMED 🔵</option>
                  <option value="PREPARING">PREPARING 🍳</option>
                  <option value="READY">READY 🎉</option>
                  <option value="COMPLETED">COMPLETED ✅</option>
                </select>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
