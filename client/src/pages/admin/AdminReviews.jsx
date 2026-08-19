import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Star, Trash2, RefreshCw } from 'lucide-react';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/ratings/admin/all');
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/ratings/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Food Ratings & Reviews
        </h1>
        <p className="text-xs text-slate-500 mt-1">Monitor feedback submitted by college students</p>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-sm font-bold text-slate-600">No ratings or reviews submitted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-sm">
                    {rev.menuItem?.name || 'Food Item'}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {rev.rating}/5
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  "{rev.comment || 'No comment provided'}"
                </p>

                <div className="text-[10px] text-slate-400">
                  By: <strong className="text-slate-700">{rev.user?.name || 'Student'}</strong> ({rev.user?.email}) • {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={() => handleDelete(rev._id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                title="Delete Review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
