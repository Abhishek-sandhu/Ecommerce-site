import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getToken = () => localStorage.getItem('token');

export const createOrder = createAsyncThunk('orders/createOrder', async (orderData, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/orders', orderData, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMyOrders', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/orders/myorders', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const createPaymentOrder = createAsyncThunk('orders/createPaymentOrder', async (amount, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/orders/payment/create', { amount }, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    paymentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.paymentOrder = action.payload;
      });
  },
});

export default orderSlice.reducer;