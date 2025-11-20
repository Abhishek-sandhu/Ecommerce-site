import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getToken = () => localStorage.getItem('token');

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/wishlist', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (productId, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/wishlist/add', { productId }, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (productId, { rejectWithValue }) => {
  try {
    const res = await axios.delete(`/api/wishlist/${productId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlist: { products: [] },
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.wishlist = { products: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;