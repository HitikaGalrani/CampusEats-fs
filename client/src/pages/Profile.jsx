import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Phone, ShieldCheck, Calendar } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          User Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">Manage your account info and credentials</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-900 rounded-md uppercase">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <Mail className="w-5 h-5 text-amber-500" />
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Email Address</span>
              <span className="text-sm font-semibold text-slate-900">{user?.email}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <Phone className="w-5 h-5 text-amber-500" />
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Phone Number</span>
              <span className="text-sm font-semibold text-slate-900">{user?.phone || 'Not provided'}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Security Role</span>
              <span className="text-sm font-semibold text-slate-900">
                {user?.role === 'ADMIN' ? 'Full Canteen Admin Access' : 'Verified College Student'}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
