import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
    checkAuth(state) {
      state.isAuthenticated = !!localStorage.getItem('session');
    }
  },
});

export const { login, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;