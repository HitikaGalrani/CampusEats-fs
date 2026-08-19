import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FoodCard } from '../components/food/FoodCard';
import {
  Utensils,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  ChefHat,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [specials, setSpecials] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, menuRes] = await Promise.all([
          api.get('/categories'),
          api.get('/menu'),
        ]);

        setCategories(catRes.data);
        setSpecials(menuRes.data.filter((item) => item.isSpecial || item.rating >= 4.7).slice(0, 4));
        setPopularItems(menuRes.data.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch home page data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-slate-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Hero Text */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                #1 Campus Canteen App
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Good Food. <br />
                <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 bg-clip-text text-transparent">
                  Less Waiting.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Order from your campus canteen and track your food from kitchen to table in real time. Skip long lunch queues today!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold rounded-2xl shadow-lg shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Utensils className="w-5 h-5" />
                  Order Now
                </Link>
                <Link
                  to="/menu"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-2xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  Explore Menu
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/60 max-w-md mx-auto lg:mx-0">
                <div>
                  <span className="block text-2xl font-black text-slate-900">10+</span>
                  <span className="text-xs text-slate-500 font-medium">Fresh Items</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-slate-900">15m</span>
                  <span className="text-xs text-slate-500 font-medium">Avg Prep Time</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-slate-900">Live</span>
                  <span className="text-xs text-slate-500 font-medium">WebSocket Sync</span>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Cards */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80"
                    alt="Campus Canteen Food"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Floating Live Tracking Badge */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 animate-pulse">
                      ⚡
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">
                        Real-Time WebSockets
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900">
                        Order #8412 Status: PREPARING
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Food Categories
            </h2>
            <p className="text-xs text-slate-500 mt-1">Browse what your campus kitchen is serving today</p>
          </div>
          <Link to="/menu" className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1">
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/menu?category=${cat._id}`}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-400 transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 mx-auto flex items-center justify-center text-xl font-bold group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                🍔
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-3 group-hover:text-amber-800 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* TODAY'S SPECIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          Chef's Special Recommendations
        </div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Today's Specials
          </h2>
          <Link to="/menu" className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1">
            Explore Full Menu <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specials.map((item) => (
            <FoodCard key={item._id} item={item} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-900 text-white py-16 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-extrabold uppercase tracking-wider border border-amber-500/30">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl font-black tracking-tight">
            How CampusEats Works
          </h2>
          <p className="text-slate-400 text-sm">
            Say goodbye to standing in lines during short lecture breaks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-lg mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
              1
            </div>
            <h3 className="font-bold text-lg text-white">Browse & Add</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore digital canteen menu, filter by snacks or drinks, and customize items in your cart.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-lg mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
              2
            </div>
            <h3 className="font-bold text-lg text-white">Place & Pay</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select your pickup block location and place your order using Pay at Canteen.
            </p>
          </div>

          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-black text-lg mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              3
            </div>
            <h3 className="font-bold text-lg text-white">Live Track & Collect</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Watch real-time status updates without refreshing. Pickup your order when notified "READY"!
            </p>
          </div>

        </div>
      </section>

      {/* POPULAR FOOD GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Popular Canteen Bites
            </h2>
            <p className="text-xs text-slate-500 mt-1">Student favorites available for instant ordering</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {popularItems.map((item) => (
            <FoodCard key={item._id} item={item} />
          ))}
        </div>
      </section>

    </div>
  );
};
