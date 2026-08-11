import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    role: "user",
    user: null,
    isLoggingOut: false,
    lastLogoutTime: null,
    authChecked: false, // ✅ ensures initial auth check completed
  },
  reducers: {
    // Login user and set role/user
    login(state, action) {
      state.isLoggedIn = true;
      state.isLoggingOut = false;
      state.lastLogoutTime = null;
      // Preserve existing user data if payload doesn't have user
      if (action.payload?.user) {
        state.user = action.payload.user;
      }
      if (action.payload?.role) {
        state.role = action.payload.role;
      }
      state.authChecked = true; // ✅ mark auth check done
    },

    // Logout user safely - completely reset all state
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.role = "user";
      state.isLoggingOut = false;
      state.lastLogoutTime = Date.now();
      state.authChecked = false; // Reset to false so auth check can run again if needed
    },

    // Temporarily set logging out flag (to block API calls)
    setLoggingOut(state, action) {
      state.isLoggingOut = action.payload;
    },

    // Change role dynamically
    changeRole(state, action) {
      state.role = action.payload;
    },

    // Set user data directly
    setUser(state, action) {
      state.user = action.payload;
    },

    // Update user safely (merge with existing data)
    updateUser(state, action) {
      state.user = { ...(state.user || {}), ...action.payload };
    },

    // Mark that initial auth check is complete
    setAuthChecked(state, action) {
      state.authChecked = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
