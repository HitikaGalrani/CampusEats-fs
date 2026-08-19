import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { updateLiveOrderStatus } from '../store/slices/orderSlice';
import { OrderStatusTracker } from '../components/order/OrderStatusTracker';
import { Clock, RefreshCw, Sparkles, ArrowLeft, History, BellAlert } from 'lucide-react';

export const LiveOrderTracking = () => {
  const [searchParams] = useSearchParams();
  const orderIdQuery = searchParams.get('orderId');
  const dispatch = useDispatch();

  const activeLiveOrder = useSelector((state) => state.order.activeLiveOrder);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const { joinOrderRoom, leaveOrderRoom, onEvent, offEvent } = useSocket();

  // Fetch target order details
  const fetchOrder = async (targetId) => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${targetId}`);
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order for tracking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let targetId = orderIdQuery;

    if (!targetId && activeLiveOrder) {
      targetId = activeLiveOrder._id;
    }

    if (targetId) {
      fetchOrder(targetId);
      joinOrderRoom(targetId);
    } else {
      // If no query parameter, attempt to get latest active user order
      api.get('/orders')
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const latest = res.data[0];
            setOrder(latest);
            joinOrderRoom(latest._id);
          } else {
            setError('No active order found to track.');
          }
        })
        .catch((err) => setError('Failed to retrieve active order.'))
        .finally(() => setLoading(false));
    }

    return () => {
      if (targetId) {
        leaveOrderRoom(targetId);
      }
    };
  }, [orderIdQuery]);

  // Socket.IO event listeners for live order status changes
  useEffect(() => {
    const handleStatusUpdate = (payload) => {
      console.log('⚡ [Socket.IO] Received orderStatusUpdated:', payload);
      if (order && order._id === payload.orderId) {
        setOrder((prev) => ({
          ...prev,
          status: payload.status,
          estimatedTime: payload.estimatedTime || prev.estimatedTime,
        }));
        dispatch(updateLiveOrderStatus(payload));

        if (payload.status === 'READY') {
          setToastMessage('🎉 Your order is ready for pickup!');
        } else {
          setToastMessage(`Order status updated to: ${payload.status}`);
          setTimeout(() => setToastMessage(null), 4000);
        }
      }
    };

    const handleOrderReady = (payload) => {
      console.log('⚡ [Socket.IO] Received orderReady event!');
      setToastMessage(payload.message || '🎉 Your order is ready for pickup!');
    };

    onEvent('orderStatusUpdated', handleStatusUpdate);
    onEvent('orderReady', handleOrderReady);

    return () => {
      offEvent('orderStatusUpdated', handleStatusUpdate);
      offEvent('orderReady', handleOrderReady);
    };
  }, [order?._id]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      
      {/* Toast Banner for Live Updates */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold shrink-0">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">
              Real-Time Socket Event
            </span>
            <p className="text-xs font-bold text-slate-100">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Live WebSockets Sync Connected
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Real-Time Order Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            This page updates automatically when the kitchen staff updates your food status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {order && (
            <button
              onClick={() => fetchOrder(order._id)}
              className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              title="Manual Refresh"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          )}
          <Link
            to="/orders"
            className="px-4 py-2.5 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <History className="w-4 h-4" />
            All Orders
          </Link>
        </div>
      </div>

      {/* Main Order Tracker Card Component */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">Loading live order status...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
            📋
          </div>
          <h3 className="text-lg font-bold text-slate-900">{error}</h3>
          <Link
            to="/menu"
            className="px-6 py-3 bg-amber-500 text-white font-bold text-xs rounded-xl inline-block"
          >
            Order Food Now
          </Link>
        </div>
      ) : (
        <OrderStatusTracker order={order} />
      )}

    </div>
  );
};
