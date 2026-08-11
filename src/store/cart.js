import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../util/axios";

// Fetch cart from backend
const fetchCart = createAsyncThunk("cart/fetchCart", async (_, thunkAPI) => {
  try {
    const response = await api.get("/cart");
    return response.data.cart; // backend should return cart array
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data || err.message);
  }
});

// Add to cart
const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (book, thunkAPI) => {
    try {
      const res = await api.put("/cart", { bookId: book._id });
      return { book, message: res.data.message };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update quantity
const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ bookId, qty }, thunkAPI) => {
    try {
      const response = await api.put("/cart/update", { bookId, qty });
      return { bookId, qty, message: response.data.message };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Remove from cart
const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (bookId, thunkAPI) => {
    try {
      await api.delete(`/cart/${bookId}`);
      return bookId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        // Transform cart items to match frontend structure
        if (action.payload && Array.isArray(action.payload)) {
          state.items = action.payload.map(item => ({
            ...item.book,
            qty: item.qty
          }));
        } else {
          state.items = [];
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Don't update state here, let the component refetch cart
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateQty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.loading = false;
        const { bookId, qty } = action.payload;
        const item = state.items.find((i) => i._id === bookId);
        if (item) item.qty = qty;
      })
      .addCase(updateQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((i) => i._id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const cartActions = cartSlice.actions;

export const { clearCart } = cartSlice.actions;

export { addToCart, fetchCart, updateQty, removeFromCart };


