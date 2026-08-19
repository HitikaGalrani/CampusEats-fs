import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { clearCart, setPickupLocation, setSpecialInstructions } from '../store/slices/cartSlice';
import { setCurrentOrder } from '../store/slices/orderSlice';
import { MapPin, Phone, CreditCard, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export const CheckoutPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, subtotal, taxes, total, pickupLocation, specialInstructions } = useSelector(
    (state) => state.cart
  );

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(pickupLocation || 'Main Canteen Counter A');
  const [instructions, setInstructions] = useState(specialInstructions || '');
  const [paymentMethod, setPaymentMethod] = useState('Pay at Canteen');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!name || !phone || !location) {
      setError('Please fill in your name, phone number, and pickup location.');
      setSubmitting(false);
      return;
    }

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        pickupLocation: location,
        specialInstructions: instructions,
        paymentMethod,
      };

      const res = await api.post('/orders', orderPayload);
      const createdOrder = res.data;

      // Update Redux state
      dispatch(setCurrentOrder(createdOrder));
      dispatch(clearCart());

      // Redirect to Live Order Tracking
      navigate(`/live-tracking?orderId=${createdOrder._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Canteen Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">Specify pickup details to complete your food order</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <h2 className="text-lg font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Pickup & Contact Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Student Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number (for SMS & counter call)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Campus Pickup Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    dispatch(setPickupLocation(e.target.value));
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 bg-white focus:border-amber-500"
                >
                  <option value="Main Canteen Counter A">Main Canteen Counter A (Central Block)</option>
                  <option value="Main Canteen Counter B">Main Canteen Counter B (Express Drinks)</option>
                  <option value="Library Block Canteen">Library Block Mini Canteen</option>
                  <option value="Science Block Canteen">Science Block Food Court</option>
                  <option value="Hostel Block Counter">Hostel Block Dining Counter</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Special Chef Instructions (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Extra spicy, less sugar in cold coffee, no mayo in burger..."
                value={instructions}
                onChange={(e) => {
                  setInstructions(e.target.value);
                  dispatch(setSpecialInstructions(e.target.value));
                }}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                onClick={() => setPaymentMethod('Pay at Canteen')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMethod === 'Pay at Canteen'
                    ? 'border-amber-500 bg-amber-50/60'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Pay at Canteen'}
                  onChange={() => setPaymentMethod('Pay at Canteen')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="block text-xs font-black text-slate-900">Pay at Canteen</span>
                  <span className="text-[10px] text-slate-500">Pay cash or UPI at pickup counter</span>
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('UPI Mock')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  paymentMethod === 'UPI Mock'
                    ? 'border-amber-500 bg-amber-50/60'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI Mock'}
                  onChange={() => setPaymentMethod('UPI Mock')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="block text-xs font-black text-slate-900">UPI / QR Code (Mock)</span>
                  <span className="text-[10px] text-slate-500">Google Pay / PhonePe / Paytm</span>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Order Review Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <h2 className="text-lg font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Order Breakdown
          </h2>

          <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item._id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {item.quantity}x
                  </span>
                  <span className="font-bold text-slate-800">{item.name}</span>
                </div>
                <span className="font-extrabold text-slate-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs font-semibold text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-slate-900 font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="text-slate-900 font-bold">₹{taxes}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>Grand Total</span>
              <span className="text-xl text-amber-800">₹{total}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              'Placing Order...'
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Confirm & Place Order (₹{total})
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Socket.IO Real-Time Tracking enabled for this order
          </p>
        </div>

      </form>
    </div>
  );
};
