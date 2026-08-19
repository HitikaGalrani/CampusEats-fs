import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Edit, Trash2, Save, X, AlertCircle } from 'lucide-react';

export const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, { name, description });
      } else {
        await api.post('/categories', { name, description });
      }
      setName('');
      setDescription('');
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setDescription(cat.description || '');
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Manage Food Categories
        </h1>
        <p className="text-xs text-slate-500 mt-1">Create and manage canteen menu classifications</p>
      </div>

      {/* Category Creation / Edit Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          {editingId ? 'Edit Category' : 'Create New Category'}
        </h2>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-4">
            <input
              type="text"
              required
              placeholder="Category Name (e.g. Breakfast)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-6">
            <input
              type="text"
              placeholder="Short Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2 flex items-center gap-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              {editingId ? 'Update' : 'Add'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName('');
                  setDescription('');
                }}
                className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="divide-y divide-slate-100">
          {categories.map((cat) => (
            <div key={cat._id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{cat.description || 'No description provided'}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-2 text-slate-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg"
                  title="Edit Category"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
