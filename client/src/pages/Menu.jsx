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

