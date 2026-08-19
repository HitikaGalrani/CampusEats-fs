import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { Star, Plus, Check, ShoppingBag, Eye } from 'lucide-react';

export const FoodCard = ({ item }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!item.isAvailable) return;

    dispatch(addToCart({ ...item, quantity: 1 }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1">
      
      {/* Food Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 rounded-lg shadow-sm">
            {item.category?.name || 'Canteen Special'}
          </span>
          {item.isSpecial && (
            <span className="px-2 py-1 text-[11px] font-extrabold uppercase bg-amber-500 text-white rounded-lg shadow-md shadow-amber-500/30">
              ⭐ Special
            </span>
          )}
        </div>

        {/* Availability Badge if Sold Out */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-2 bg-red-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg border border-red-500/40">
              SOLD OUT
            </span>
          </div>
        )}

        {/* View Details Quick Action */}
        <Link
          to={`/food/${item._id}`}
          className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <Link to={`/food/${item._id}`}>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-700 transition-colors line-clamp-1">
                {item.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 text-xs font-bold text-amber-800 shrink-0">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{item.rating ? item.rating.toFixed(1) : '4.5'}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-extrabold text-slate-900">
              ₹{item.price}
            </span>
          </div>

          {item.isAvailable ? (
            <button
              onClick={handleAddToCart}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white hover:shadow-md hover:shadow-amber-500/20'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  Added!
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
            >
              Unavailable
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
