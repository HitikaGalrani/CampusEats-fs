import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  categories: [],
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'default',
  availableOnly: false,
  isLoading: false,
  error: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuItems: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setAvailableOnly: (state, action) => {
      state.availableOnly = action.payload;
    },
    setMenuLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setMenuError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateMenuItemAvailability: (state, action) => {
      const { id, isAvailable } = action.payload;
      state.items = state.items.map((item) =>
        item._id === id ? { ...item, isAvailable } : item
      );
    },
  },
});

export const {
  setMenuItems,
  setCategories,
  setSelectedCategory,
  setSearchQuery,
  setSortBy,
  setAvailableOnly,
  setMenuLoading,
  setMenuError,
  updateMenuItemAvailability,
} = menuSlice.actions;

export default menuSlice.reducer;
