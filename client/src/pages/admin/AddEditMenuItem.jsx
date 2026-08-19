import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

export const AddEditMenuItem = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSpecial, setIsSpecial] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
        if (res.data.length > 0 && !category) {
          setCategory(res.data[0]._id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();

    if (isEditMode) {
      api.get(`/menu/${id}`).then((res) => {
        const item = res.data;
        setName(item.name);
        setDescription(item.description);
        setPrice(item.price);
        setImage(item.image);
        setCategory(item.category?._id || item.category);
        setIsAvailable(item.isAvailable);
        setIsSpecial(item.isSpecial || false);
      });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name,
      description,
      price: Number(price),
      image: image || undefined,
      category,
      isAvailable,
      isSpecial,
    };

    try {
      if (isEditMode) {
        await api.put(`/menu/${id}`, payload);
      } else {
        await api.post('/menu', payload);
      }
      navigate('/admin/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-20">
      
      <Link to="/admin/menu" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" /> Back to Manage Menu
      </Link>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {isEditMode ? 'Edit Menu Item' : 'Add New Food Item'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">Configure food details, category, pricing, and availability</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Food Item Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Masala Dosa, Paneer Roll"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              required
              placeholder="Crispy crepe stuffed with spiced potato masala..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Price (in INR ₹)
              </label>
              <input
                type="number"
                required
                min={0}
                placeholder="70"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-extrabold focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                required
              >
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Image URL (Unsplash or web link)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-800">Available in Canteen 🟢</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isSpecial}
                onChange={(e) => setIsSpecial(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-800">Chef's Special ⭐</span>
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : isEditMode ? 'Update Item' : 'Create Menu Item'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
