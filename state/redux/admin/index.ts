import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './initialState';
import extraReducersAdmin from './extraReducers';
import { UploadProgress } from '@/types';

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    /**
     * Actualizar progreso de upload
     */
    setUploadProgress: (state, action: PayloadAction<UploadProgress | null>) => {
      state.uploadProgress = action.payload;
    },
    /**
     * Resetear estado de admin
     */
    resetAdminState: (state) => {
      state.stats = null;
      state.uploadProgress = null;
      state.recentActivity = [];
      state.status = {};
    },
    /**
     * Limpiar el estado de un thunk específico
     */
    clearAdminStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && state.status[action.payload]) {
        delete state.status[action.payload];
      } else {
        state.status = {};
      }
    },
  },
  extraReducers(builder) {
    extraReducersAdmin(builder);
  },
});

export const { setUploadProgress, resetAdminState, clearAdminStatus } =
  adminSlice.actions;

export default adminSlice.reducer;

// Re-export thunks
export { getAdminStatsAsync } from './thunk';
