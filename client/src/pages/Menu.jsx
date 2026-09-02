import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { FoodCard } from '../components/food/FoodCard';
import {
  Search,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

// Demo data used when MongoDB/API is unavailable
const demoCategories = [
  { _id: 'breakfast', name: 'Breakfast' },
  { _id: 'snacks', name: 'Snacks' },
  { _id: 'beverages', name: 'Beverages' },
  { _id: 'meals', name: 'Meals' },
];

const demoItems = [
  {
    _id: 'food-1',
    name: 'Masala Dosa',
    description: 'Crispy South Indian dosa filled with spicy potato masala, served with sambar and chutney.',
    price: 80,
    rating: 4.7,
    isAvailable: true,
    isSpecial: true,
    category: { _id: 'breakfast', name: 'Breakfast' },
    image:
      'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
  },

  {
    _id: 'food-2',
    name: 'Veg Sandwich',
    description: 'Fresh grilled sandwich loaded with vegetables, cheese and delicious sauces.',
    price: 60,
    rating: 4.5,
    isAvailable: true,
    category: { _id: 'snacks', name: 'Snacks' },
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
  },

  {
    _id: 'food-3',
    name: 'Samosa',
    description: 'Crispy golden samosa stuffed with spicy potatoes and peas.',
    price: 25,
    rating: 4.6,
    isAvailable: true,
    category: { _id: 'snacks', name: 'Snacks' },
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
  },

  {
    _id: 'food-4',
    name: 'Cold Coffee',
    description: 'Chilled creamy cold coffee, perfect for a refreshing campus break.',
    price: 70,
    rating: 4.8,
    isAvailable: true,
    isSpecial: true,
    category: { _id: 'beverages', name: 'Beverages' },
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80',
  },

  {
    _id: 'food-5',
    name: 'Veg Biryani',
    description: 'Aromatic basmati rice cooked with fresh vegetables and Indian spices.',
    price: 120,
    rating: 4.6,
    isAvailable: true,
    category: { _id: 'meals', name: 'Meals' },
    image:
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
  },

  {
    _id: 'food-6',
    name: 'Pav Bhaji',
    description: 'Mumbai-style spicy vegetable bhaji served with buttery toasted pav.',
    price: 90,
    rating: 4.7,
    isAvailable: true,
    category: { _id: 'meals', name: 'Meals' },
    image:
      'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=600&auto=format&fit=crop&q=80',
  },

  {
    _id: 'food-7',
    name: 'French Fries',
    description: 'Crispy golden potato fries seasoned perfectly for a quick snack.',
    price: 50,
    rating: 4.4,
    isAvailable: true,
    category: { _id: 'snacks', name: 'Snacks' },
    image:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
  },

  {
    _id: 'food-8',
    name: 'Mango Shake',
    description: 'Thick, creamy and refreshing mango milkshake.',
    price: 80,
    rating: 4.5,
    isAvailable: false,
    category: { _id: 'beverages', name: 'Beverages' },
    image:
      'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80',
  },

  {
    _id: 'food-9',
    name: 'Vada Pav',
    description: 'Classic Mumbai street food with crispy batata vada, soft pav and chutneys.',
    price: 40,
    rating: 4.9,
    isAvailable: true,
    isSpecial: true,
    category: { _id: 'snacks', name: 'Snacks' },
    image: 'https://stat.ameba.jp/user_images/20190824/08/maruyamashu/f8/cd/j/o0940062614548956782.jpg',
  },

  {
    _id: 'food-10',
    name: 'Schezwan Rice',
    description: 'Spicy Indo-Chinese fried rice tossed with vegetables and Schezwan sauce.',
    price: 100,
    rating: 4.6,
    isAvailable: true,
    category: { _id: 'meals', name: 'Meals' },
    image:
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
  },

  {
    _id: 'food-11',
    name: 'Schezwan Noodles',
    description: 'Stir-fried noodles tossed with crunchy vegetables and spicy Schezwan sauce.',
    price: 100,
    rating: 4.7,
    isAvailable: true,
    isSpecial: true,
    category: { _id: 'meals', name: 'Meals' },
    image:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
  },

  {
    _id: 'food-12',
    name: 'Veg Frankie',
    description: 'Soft Indian flatbread wrapped around spicy vegetables, onions and tasty sauces.',
    price: 80,
    rating: 4.5,
    isAvailable: true,
    category: { _id: 'snacks', name: 'Snacks' },
    image:
      'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80',
  },
];

export const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';

  const [items, setItems] = useState(demoItems);
  const [categories, setCategories] = useState(demoCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('default');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Try API first.
  // If MongoDB is unavailable, continue with demo data.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');

        if (Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch (err) {
        console.log('Using demo categories because API is unavailable.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (searchQuery) {
          params.append('search', searchQuery);
        }

        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }

        if (sortBy !== 'default') {
          params.append('sort', sortBy);
        }

        if (availableOnly) {
          params.append('availableOnly', 'true');
        }

        const res = await api.get(`/menu?${params.toString()}`);

        if (Array.isArray(res.data)) {
          setItems(res.data);
        } else {
          throw new Error('Invalid menu response');
        }
      } catch (err) {
        // Use demo data if backend/MongoDB is unavailable
        console.log('API unavailable. Using demo menu data.');

        let filteredItems = [...demoItems];

        // Search
        if (searchQuery) {
          filteredItems = filteredItems.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Category
        if (selectedCategory !== 'all') {
          filteredItems = filteredItems.filter(
            (item) => item.category?._id === selectedCategory
          );
        }

        // Available only
        if (availableOnly) {
          filteredItems = filteredItems.filter(
            (item) => item.isAvailable
          );
        }

        // Sorting
        if (sortBy === 'price-asc') {
          filteredItems.sort((a, b) => a.price - b.price);
        }

        if (sortBy === 'price-desc') {
          filteredItems.sort((a, b) => b.price - a.price);
        }

        if (sortBy === 'rating-desc') {
          filteredItems.sort((a, b) => b.rating - a.rating);
        }

        setItems(filteredItems);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchMenu, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, selectedCategory, sortBy, availableOnly]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);

    const newParams = new URLSearchParams(searchParams);

    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }

    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('default');
    setAvailableOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">

          <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-extrabold uppercase tracking-wider border border-amber-500/30">
            Fresh Canteen Menu
          </span>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Explore Campus Menu
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            All prices in Indian Rupees (₹). Order fresh snacks,
            beverages, and meals delivered straight to your pickup counter.
          </p>

        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">

          {/* Search */}
          <div className="md:col-span-6 relative">

            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

            <input
              type="text"
              placeholder="Search food by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-medium transition-all"
            />

          </div>

          {/* Sort */}
          <div className="md:col-span-3">

            <div className="relative">

              <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 text-sm font-semibold text-slate-700 bg-white"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-asc">
                  Price: Low to High (₹)
                </option>
                <option value="price-desc">
                  Price: High to Low (₹)
                </option>
                <option value="rating-desc">
                  Rating: Highest Rated ⭐
                </option>
              </select>

            </div>

          </div>

          {/* Available Only */}
          <div className="md:col-span-3 flex items-center justify-end">

            <label className="flex items-center gap-2 cursor-pointer select-none">

              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />

              <span className="text-xs font-bold text-slate-700">
                Available Only 🟢
              </span>

            </label>

          </div>

        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-none">

          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Items
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat._id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat._id
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}

        </div>

      </div>

      {/* Menu */}
      {loading ? (
        <div className="py-20 text-center space-y-3">

          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />

          <p className="text-sm font-semibold text-slate-500">
            Fetching delicious menu items...
          </p>

        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center space-y-2">

          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />

          <p className="font-bold">{error}</p>

        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">

          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
            🔍
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            No food items found
          </h3>

          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or selecting a different category filter.
          </p>

          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-amber-50 text-amber-800 font-bold text-xs rounded-xl hover:bg-amber-100"
          >
            Reset Filters
          </button>

        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {items.map((item) => (
            <FoodCard key={item._id} item={item} />
          ))}

        </div>
      )}

    </div>
  );
};