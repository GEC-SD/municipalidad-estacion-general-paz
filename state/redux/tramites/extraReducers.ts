import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { TramitesSlice } from '@/types';
import {
  getTramitesAsync,
  getActiveTramitesAsync,
  getTramiteByIdAsync,
  createTramiteAsync,
  updateTramiteAsync,
  deleteTramiteAsync,
} from './thunk';

const extraReducersTramites = (
  builder: ActionReducerMapBuilder<TramitesSlice>
) => {
  // Get tramites (admin, paginated)
  builder
    .addCase(getTramitesAsync.pending, (state) => {
      state.status.getTramitesAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getTramitesAsync.fulfilled, (state, action) => {
      state.tramites = action.payload.data;
      state.pagination = {
        page: action.payload.page,
        limit: action.payload.limit,
        total: action.payload.count,
        totalPages: Math.ceil(action.payload.count / action.payload.limit),
      };
      state.lastFetched['tramites'] = Date.now();
      state.status.getTramitesAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getTramitesAsync.rejected, (state, action: any) => {
      state.status.getTramitesAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener trámites',
        loading: false,
      };
    });

  // Get active tramites (public)
  builder
    .addCase(getActiveTramitesAsync.pending, (state) => {
      state.status.getActiveTramitesAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getActiveTramitesAsync.fulfilled, (state, action) => {
      state.tramites = action.payload;
      state.lastFetched['activeTramites'] = Date.now();
      state.status.getActiveTramitesAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getActiveTramitesAsync.rejected, (state, action: any) => {
      state.status.getActiveTramitesAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener trámites',
        loading: false,
      };
    });

  // Get by id
  builder
    .addCase(getTramiteByIdAsync.pending, (state) => {
      state.status.getTramiteByIdAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getTramiteByIdAsync.fulfilled, (state, action) => {
      state.currentTramite = action.payload;
      state.status.getTramiteByIdAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getTramiteByIdAsync.rejected, (state, action: any) => {
      state.status.getTramiteByIdAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener trámite',
        loading: false,
      };
    });

  // Create
  builder
    .addCase(createTramiteAsync.pending, (state) => {
      state.status.createTramiteAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(createTramiteAsync.fulfilled, (state, action) => {
      state.tramites.unshift(action.payload);
      state.lastFetched = {};
      state.status.createTramiteAsync = {
        response: 'fulfilled',
        message: 'Trámite creado correctamente',
        loading: false,
      };
    })
    .addCase(createTramiteAsync.rejected, (state, action: any) => {
      state.status.createTramiteAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al crear trámite',
        loading: false,
      };
    });

  // Update
  builder
    .addCase(updateTramiteAsync.pending, (state) => {
      state.status.updateTramiteAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(updateTramiteAsync.fulfilled, (state, action) => {
      const index = state.tramites.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tramites[index] = action.payload;
      }
      state.lastFetched = {};
      state.status.updateTramiteAsync = {
        response: 'fulfilled',
        message: 'Trámite actualizado correctamente',
        loading: false,
      };
    })
    .addCase(updateTramiteAsync.rejected, (state, action: any) => {
      state.status.updateTramiteAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al actualizar trámite',
        loading: false,
      };
    });

  // Delete
  builder
    .addCase(deleteTramiteAsync.pending, (state) => {
      state.status.deleteTramiteAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(deleteTramiteAsync.fulfilled, (state, action) => {
      state.tramites = state.tramites.filter((t) => t.id !== action.payload);
      state.lastFetched = {};
      state.status.deleteTramiteAsync = {
        response: 'fulfilled',
        message: 'Trámite eliminado correctamente',
        loading: false,
      };
    })
    .addCase(deleteTramiteAsync.rejected, (state, action: any) => {
      state.status.deleteTramiteAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al eliminar trámite',
        loading: false,
      };
    });
};

export default extraReducersTramites;
