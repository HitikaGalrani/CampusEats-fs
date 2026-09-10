//order slice configuration for CampusEats Experiment 3

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentOrder: null,
  orderHistory: [],
  activeLiveOrder: null,
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
      state.activeLiveOrder = action.payload;
    },
    updateLiveOrderStatus: (state, action) => {
      const { orderId, status, estimatedTime } = action.payload;

      if (state.activeLiveOrder && state.activeLiveOrder._id === orderId) {
        state.activeLiveOrder.status = status;
        if (estimatedTime) {
          state.activeLiveOrder.estimatedTime = estimatedTime;
        }
      }

      state.orderHistory = state.orderHistory.map((order) =>
        order._id === orderId ? { ...order, status } : order
      );
    },
    setOrderHistory: (state, action) => {
      state.orderHistory = action.payload;
    },
    setOrderLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setOrderError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setCurrentOrder,
  updateLiveOrderStatus,
  setOrderHistory,
  setOrderLoading,
  setOrderError,
} = orderSlice.actions;

export default orderSlice.reducer;
