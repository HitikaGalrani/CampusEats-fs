import React from 'react';
import { CheckCircle2, Clock, ChefHat, Sparkles, PackageCheck, AlertCircle } from 'lucide-react';

const STAGES = [
  { key: 'PLACED', label: 'Order Placed', icon: Clock, desc: 'Received by Canteen System' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2, desc: 'Kitchen acknowledged order' },
  { key: 'PREPARING', label: 'Preparing', icon: ChefHat, desc: 'Chef is cooking fresh food' },
  { key: 'READY', label: 'Ready for Pickup', icon: Sparkles, desc: 'Hot & fresh at canteen counter' },
  { key: 'COMPLETED', label: 'Completed', icon: PackageCheck, desc: 'Picked up by student' },
];

export const OrderStatusTracker = ({ order }) => {
  if (!order) return null;

  const currentStatus = order.status || 'PLACED';
  const getStageIndex = (status) => STAGES.findIndex((s) => s.key === status);
  const currentIndex = getStageIndex(currentStatus);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-8">
      
      {/* Ready Banner Notification */}
      {currentStatus === 'READY' && (
        <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white rounded-2xl p-5 shadow-lg shadow-emerald-500/25 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">
                🎉 Your order is ready for pickup!
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Head over to <span className="font-bold underline">{order.pickupLocation || 'Main Canteen Counter'}</span> with Order ID #{order._id.toString().slice(-6)}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Order ID
            </span>
            <span className="text-sm font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
              #{order._id}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} • {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80 text-right">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Est. Prep Time</span>
            <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              {order.estimatedTime || '15 mins'}
            </span>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80 text-right">
            <span className="block text-[10px] font-bold text-slate-400 uppercase">Total Paid</span>
            <span className="text-base font-extrabold text-amber-800">
              ₹{order.totalAmount}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Stepper Tracker */}
      <div className="relative pt-4 pb-2">
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1.5 bg-slate-100 -translate-y-1/2 rounded-full z-0">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${(currentIndex / (STAGES.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Stepper Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative z-10">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isPassed = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div
                key={stage.key}
                className={`flex md:flex-col items-center gap-4 md:gap-3 text-left md:text-center transition-all ${
                  isPassed ? 'opacity-100' : 'opacity-40'
                }`}
              >
                {/* Node Circle */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 shrink-0 ${
                    isCurrent
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40 ring-4 ring-amber-100 scale-110'
                      : isPassed
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isCurrent && stage.key === 'PREPARING' ? 'animate-bounce' : ''}`} />
                </div>

                {/* Node Label & Description */}
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      isCurrent
                        ? 'text-amber-800'
                        : isPassed
                        ? 'text-slate-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5 hidden md:block">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pickup Location & Items Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        
        {/* Pickup Info */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Pickup Details
          </h4>
          <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
            📍 {order.pickupLocation || 'Main Canteen Counter'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Payment Method: <span className="font-semibold text-slate-700">{order.paymentMethod || 'Pay at Canteen'}</span>
          </p>
          {order.specialInstructions && (
            <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60 mt-2 font-medium">
              Note: "{order.specialInstructions}"
            </p>
          )}
        </div>

        {/* Ordered Items Summary */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Items ({order.items?.length || 0})
          </h4>
          <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-2">
            {order.items?.map((item, i) => (
              <li key={i} className="flex items-center justify-between text-xs text-slate-700">
                <span className="font-medium">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};
