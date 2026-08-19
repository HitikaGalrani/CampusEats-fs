import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../services/api';
import { addToCart } from '../store/slices/cartSlice';
import { useAuth } from '../hooks/useAuth';
import { Star, Plus, Minus, Check, ArrowLeft, MessageSquare, AlertCircle } from 'lucide-react';

export const FoodDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();

  const [item, setItem] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // Review form state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  const fetchDetails = async () => {
    try {
      const [itemRes, ratingsRes] = await Promise.all([
        api.get(`/menu/${id}`),
        api.get(`/ratings/menu/${id}`),
      ]);
      setItem(itemRes.data);
      setRatings(ratingsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!item || !item.isAvailable) return;
    dispatch(addToCart({ ...item, quantity }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      await api.post('/ratings', {
        menuItemId: id,
        rating: userRating,
        comment: userComment,
      });
      setReviewSuccess('Review submitted successfully!');
      setUserComment('');
      fetchDetails(); // Refresh ratings
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center font-semibold text-slate-500">
        Loading food details...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Food Item Not Found</h2>
        <Link to="/menu" className="px-4 py-2 bg-amber-500 text-white font-bold rounded-xl inline-block">
          Return to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20">
      
      {/* Back Button */}
      <Link to="/menu" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Menu
      </Link>

      {/* Main Item Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
        
        {/* Left Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-5 py-2.5 bg-red-600 text-white font-extrabold text-sm uppercase tracking-widest rounded-xl shadow-lg border border-red-500/40">
                SOLD OUT
              </span>
            </div>
          )}
        </div>

        {/* Right Info */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-bold uppercase tracking-wider">
                {item.category?.name || 'Category'}
              </span>
              <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg text-xs font-extrabold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{item.rating?.toFixed(1)}</span>
                <span className="text-amber-800 text-[10px]">({item.numReviews} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {item.name}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              {item.description}
            </p>

            <div className="text-3xl font-black text-slate-900 pt-2">
              ₹{item.price}
            </div>
          </div>

          {/* Quantity & Add to Cart Controls */}
          {item.isAvailable ? (
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-extrabold text-sm text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add {quantity} to Cart • ₹{item.price * quantity}
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-center text-xs font-bold">
              This item is currently unavailable in the canteen. Check back later!
            </div>
          )}

        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-500" />
          Customer Ratings & Reviews ({ratings.length})
        </h2>

        {/* Submit Review Form */}
        {isAuthenticated ? (
          <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Write a Review</h3>

            {reviewError && (
              <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {reviewError}
              </div>
            )}

            {reviewSuccess && (
              <div className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl font-semibold">
                {reviewSuccess}
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Your Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= userRating
                          ? 'fill-amber-500 text-amber-500'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="How was the taste, freshness, and speed of delivery?"
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              required
            />

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-500/20"
            >
              {reviewSubmitting ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        ) : (
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs font-medium text-amber-900 flex items-center justify-between">
            <span>Log in to post a rating and review for this food item.</span>
            <Link to="/login" className="px-3 py-1.5 bg-amber-500 text-white font-bold rounded-lg text-xs">
              Log In
            </Link>
          </div>
        )}

        {/* Existing Reviews List */}
        {ratings.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No reviews yet for this item. Be the first to leave feedback!</p>
        ) : (
          <div className="space-y-4">
            {ratings.map((rev) => (
              <div key={rev._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{rev.user?.name || 'Student'}</span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {rev.rating}/5
                  </div>
                </div>
                {rev.comment && (
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                )}
                <span className="text-[10px] text-slate-400 block">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
