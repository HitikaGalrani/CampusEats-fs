import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Heart, Clock, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold shadow-md shadow-amber-500/20">
                <Utensils className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                CampusEats
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Good Food. Less Waiting. Order directly from your campus canteen and track your fresh meal live from kitchen to table.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/menu" className="hover:text-amber-400 transition-colors">Explore Canteen Menu</Link>
              </li>
              <li>
                <Link to="/live-tracking" className="hover:text-amber-400 transition-colors">Live Order Tracker</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-amber-400 transition-colors">Order History</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-amber-400 transition-colors">View Cart</Link>
              </li>
            </ul>
          </div>

          {/* Canteen Hours & Location */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Canteen Details</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>Mon – Sat: 8:00 AM – 7:30 PM</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>Main Food Court, Central Block A, College Campus</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>Helpline: +91 (080) 4567-8900</span>
              </li>
            </ul>
          </div>

          {/* Technology & Security */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Real-Time Tech</h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-3">
              Powered by Node.js, Express, MongoDB Mongoose, React Redux Toolkit & Socket.IO real-time WebSockets.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-amber-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              Role-based JWT Protected
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CampusEats – Smart College Canteen. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for college foodies.
          </p>
        </div>
      </div>
    </footer>
  );
};
