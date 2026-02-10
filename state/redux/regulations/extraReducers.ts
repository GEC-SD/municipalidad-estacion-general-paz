import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { RegulationsSlice } from '@/types';
import {
  getRegulationsAsync,
  getRegulationByIdAsync,
  createRegulationAsync,
  updateRegulationAsync,
  deleteRegulationAsync,
} from './thunk';

const extraReducersRegulations = (
  builder: ActionReducerMapBuilder<RegulationsSlice>
) => {
  builder
    .addCase(getRegulationsAsync.pending, (state) => {
      state.status.getRegulationsAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getRegulationsAsync.fulfilled, (state, action) => {
      state.regulations = action.payload.data;
      state.pagination = {
        page: action.payload.page,
        limit: action.payload.limit,
        total: action.payload.count,
        totalPages: Math.ceil(action.payload.count / action.payload.limit),
      };
      state.lastFetched['regulations'] = Date.now();
      state.status.getRegulationsAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getRegulationsAsync.rejected, (state, action: any) => {
      state.status.getRegulationsAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener normativa',
        loading: false,
      };
    });

  builder
    .addCase(getRegulationByIdAsync.pending, (state) => {
      state.status.getRegulationByIdAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getRegulationByIdAsync.fulfilled, (state, action) => {
      state.currentRegulation = action.payload;
      state.status.getRegulationByIdAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getRegulationByIdAsync.rejected, (state, action: any) => {
      state.status.getRegulationByIdAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener normativa',
        loading: false,
      };
    });

  builder
    .addCase(createRegulationAsync.pending, (state) => {
      state.status.createRegulationAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(createRegulationAsync.fulfilled, (state, action) => {
      state.regulations.unshift(action.payload);
      state.lastFetched = {};
      state.status.createRegulationAsync = {
        response: 'fulfilled',
        message: 'Normativa creada correctamente',
        loading: false,
      };
    })
    .addCase(createRegulationAsync.rejected, (state, action: any) => {
      state.status.createRegulationAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al crear normativa',
        loading: false,
      };
    });

  builder
    .addCase(updateRegulationAsync.pending, (state) => {
      state.status.updateRegulationAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(updateRegulationAsync.fulfilled, (state, action) => {
      const index = state.regulations.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.regulations[index] = action.payload;
      }
      state.lastFetched = {};
      state.status.updateRegulationAsync = {
        response: 'fulfilled',
        message: 'Normativa actualizada correctamente',
        loading: false,
      };
    })
    .addCase(updateRegulationAsync.rejected, (state, action: any) => {
      state.status.updateRegulationAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al actualizar normativa',
        loading: false,
      };
    });

  builder
    .addCase(deleteRegulationAsync.pending, (state) => {
      state.status.deleteRegulationAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(deleteRegulationAsync.fulfilled, (state, action) => {
      state.regulations = state.regulations.filter((r) => r.id !== action.payload);
      state.lastFetched = {};
      state.status.deleteRegulationAsync = {
        response: 'fulfilled',
        message: 'Normativa eliminada correctamente',
        loading: false,
      };
    })
    .addCase(deleteRegulationAsync.rejected, (state, action: any) => {
      state.status.deleteRegulationAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al eliminar normativa',
        loading: false,
      };
    });
};

export default extraReducersRegulations;
