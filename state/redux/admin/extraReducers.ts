import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { AdminSlice } from '@/types';
import { getAdminStatsAsync } from './thunk';

const extraReducersAdmin = (builder: ActionReducerMapBuilder<AdminSlice>) => {
  // GET ADMIN STATS
  builder
    .addCase(getAdminStatsAsync.pending, (state) => {
      state.status.getAdminStatsAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getAdminStatsAsync.fulfilled, (state, action) => {
      state.stats = action.payload;
      state.status.getAdminStatsAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getAdminStatsAsync.rejected, (state, action: any) => {
      state.status.getAdminStatsAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener estadísticas',
        loading: false,
      };
    });
};

export default extraReducersAdmin;
