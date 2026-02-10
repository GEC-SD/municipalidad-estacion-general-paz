import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './initialState';
import extraReducersAuthorities from './extraReducers';

const authoritiesSlice = createSlice({
  name: 'authorities',
  initialState,
  reducers: {
    /**
     * Resetear estado de authorities
     */
    resetAuthoritiesState: (state) => {
      state.authorities = [];
      state.currentAuthority = null;
      state.intendente = null;
      state.gabinete = [];
      state.concejo = [];
      state.lastFetched = {};
      state.status = {};
    },
    clearCurrentAuthority: (state) => {
      state.currentAuthority = null;
    },
    /**
     * Limpiar el estado de un thunk específico
     */
    clearAuthoritiesStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && state.status[action.payload]) {
        delete state.status[action.payload];
      } else {
        state.status = {};
      }
    },
  },
  extraReducers(builder) {
    extraReducersAuthorities(builder);
  },
});

export const { resetAuthoritiesState, clearAuthoritiesStatus, clearCurrentAuthority } =
  authoritiesSlice.actions;

export default authoritiesSlice.reducer;

// Re-export thunks
export {
  getAuthoritiesAsync,
  getAuthoritiesByCategoryAsync,
  getAuthorityByIdAsync,
  createAuthorityAsync,
  updateAuthorityAsync,
  deleteAuthorityAsync,
} from './thunk';
