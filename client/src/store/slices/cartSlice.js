// cart slice configuration for CampusEats Experiment 3

import { createSlice } from '@reduxjs/toolkit';

const cartFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const initialPickupFromStorage = localStorage.getItem('pickupLocation')
  || 'Main Canteen Counter A';

const calculateTotals = (cartItems) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + taxes;
  return { subtotal, taxes, total };
};

const initialTotals = calculateTotals(cartFromStorage);

const initialState = {
  cartItems: cartFromStorage,
  pickupLocation: initialPickupFromStorage,
  specialInstructions: '',
  subtotal: initialTotals.subtotal,
  taxes: initialTotals.taxes,
  total: initialTotals.total,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? { ...x, quantity: x.quantity + (item.quantity || 1) } : x
        );
      } else {
        state.cartItems.push({ ...item, quantity: item.quantity || 1 });
      }

      const totals = calculateTotals(state.cartItems);
      state.subtotal = totals.subtotal;
      state.taxes = totals.taxes;
      state.total = totals.total;

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((x) => x._id !== itemId);

      const totals = calculateTotals(state.cartItems);
      state.subtotal = totals.subtotal;
      state.taxes = totals.taxes;
      state.total = totals.total;

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.cartItems = state.cartItems.filter((x) => x._id !== id);
      } else {
        state.cartItems = state.cartItems.map((x) =>
          x._id === id ? { ...x, quantity } : x
        );
      }

      const totals = calculateTotals(state.cartItems);
      state.subtotal = totals.subtotal;
      state.taxes = totals.taxes;
      state.total = totals.total;

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    setPickupLocation: (state, action) => {
      state.pickupLocation = action.payload;
      localStorage.setItem('pickupLocation', action.payload);
    },

    setSpecialInstructions: (state, action) => {
      state.specialInstructions = action.payload;
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.subtotal = 0;
      state.taxes = 0;
      state.total = 0;
      state.specialInstructions = '';
      localStorage.removeItem('cartItems');
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setPickupLocation,
  setSpecialInstructions,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
