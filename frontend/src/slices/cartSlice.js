import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getToken = () => localStorage.getItem('token');

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/cart', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (item, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/cart/add', item, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/api/cart/item/${itemId}`, { quantity }, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`/api/cart/item/${itemId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: { items: [] },
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { items: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;