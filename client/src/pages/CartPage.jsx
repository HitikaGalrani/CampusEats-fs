import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../store/slices/cartSlice';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';

export const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, subtotal, taxes, total } = useSelector((state) => state.cart);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-3xl shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Looks like you haven't added any canteen items yet. Browse our menu to satisfy your cravings!
          </p>
        </div>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20"
        >
          Browse Menu Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Your Food Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review items before placing your canteen order</p>
        </div>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100"
        >
          <Trash2 className="w-4 h-4" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
          <div className="divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-slate-100 shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                    <span className="text-xs font-extrabold text-slate-700">₹{item.price} each</span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() =>
                        dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))
                      }
                      className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-extrabold text-xs text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))
                      }
                      className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal Item Price */}
                  <div className="text-right min-w-[70px]">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Subtotal</span>
                    <span className="text-sm font-black text-slate-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>

                  {/* Remove Item */}
                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link to="/menu" className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 hover:text-amber-900">
              <ArrowLeft className="w-4 h-4" /> Add More Canteen Food
            </Link>
          </div>
        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6">
          <h2 className="text-lg font-black text-slate-900 pb-4 border-b border-slate-100">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs font-semibold text-slate-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="text-slate-900 font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Taxes (5% GST)</span>
              <span className="text-slate-900 font-bold">₹{taxes}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Canteen Counter Pickup</span>
              <span className="font-bold uppercase text-[10px] bg-emerald-100 px-2 py-0.5 rounded">FREE</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-sm font-black text-slate-900">Total Amount</span>
            <span className="text-2xl font-black text-amber-800">
              ₹{total}
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
