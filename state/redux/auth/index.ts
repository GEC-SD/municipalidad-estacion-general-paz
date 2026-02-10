import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';
import extraReducersAuth from './extraReducers';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Resetear el estado de autenticación
     */
    resetAuth: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.status = {};
    },
    /**
     * Limpiar el estado de un thunk específico
     */
    clearAuthStatus: (state, action) => {
      if (action.payload && state.status[action.payload]) {
        delete state.status[action.payload];
      } else {
        state.status = {};
      }
    },
  },
  extraReducers(builder) {
    extraReducersAuth(builder);
  },
});

export const { resetAuth, clearAuthStatus } = authSlice.actions;
export default authSlice.reducer;

// Re-export thunks
export {
  loginAsync,
  logoutAsync,
  checkSessionAsync,
  getCurrentUserAsync,
} from './thunk';
