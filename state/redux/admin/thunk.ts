import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAdminStatsApi } from './api';

/**
 * Obtener estadísticas del dashboard
 */
export const getAdminStatsAsync = createAsyncThunk(
  'admin/getAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      return await getAdminStatsApi();
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener estadísticas',
      });
    }
  }
);
