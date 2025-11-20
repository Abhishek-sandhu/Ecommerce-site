import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const validateCoupon = createAsyncThunk('coupons/validateCoupon', async (code, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/coupons/validate', { code });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const applyCoupon = createAsyncThunk('coupons/applyCoupon', async ({ code, orderTotal }, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/coupons/apply', { code, orderTotal });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    coupon: null,
    discount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload.coupon;
        state.discount = action.payload.discount;
        state.error = null;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.coupon = null;
        state.discount = 0;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.discount = action.payload.discount;
      });
  },
});

export const { clearCoupon } = couponSlice.actions;
export default couponSlice.reducer;