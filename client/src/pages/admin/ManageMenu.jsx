import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Search, RefreshCw, Star } from 'lucide-react';

export const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchMenu = async () => {
    try {
      const res = await api.get('/menu');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleToggleAvailability = async (id) => {
    try {
      const res = await api.patch(`/menu/${id}/toggle-availability`);
      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isAvailable: res.data.isAvailable } : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/menu/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Manage Canteen Menu
          </h1>
          <p className="text-xs text-slate-500 mt-1">Add, edit, delete, or toggle food item availability</p>
        </div>

        <Link
          to="/admin/menu/add"
          className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Menu Item
        </Link>
      </div>

      {/* Search Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search food item by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-amber-500"
          />
        </div>
      </div>

      {/* Items Table / Cards */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Loading menu items...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Item</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price (INR)</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Availability</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{item.name}</span>
                          <span className="text-[10px] text-slate-400 line-clamp-1">{item.description}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-700">
                      {item.category?.name || 'Uncategorized'}
                    </td>

                    <td className="py-4 px-6 font-black text-slate-900">
                      ₹{item.price}
                    </td>

                    <td className="py-4 px-6 font-bold text-amber-600">
                      ⭐ {item.rating?.toFixed(1)}
                    </td>

                    {/* Availability Toggle */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleAvailability(item._id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 transition-all ${
                          item.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {item.isAvailable ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-600" /> Available 🟢
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-red-600" /> SOLD OUT 🔴
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        to={`/admin/menu/edit/${item._id}`}
                        className="p-2 text-slate-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg inline-block"
                        title="Edit Item"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(item._id, item.name)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg inline-block"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
