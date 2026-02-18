import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { PublicWorksSlice } from '@/types';
import {
  getPublicWorksAsync,
  getAllPublicWorksAsync,
  getPublicWorkByIdAsync,
  createPublicWorkAsync,
  updatePublicWorkAsync,
  deletePublicWorkAsync,
} from './thunk';

const extraReducersPublicWorks = (
  builder: ActionReducerMapBuilder<PublicWorksSlice>
) => {
  // GET PUBLIC WORKS (active only)
  builder
    .addCase(getPublicWorksAsync.pending, (state) => {
      state.status.getPublicWorksAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getPublicWorksAsync.fulfilled, (state, action) => {
      state.publicWorks = action.payload;
      state.lastFetched['publicWorks'] = Date.now();
      state.status.getPublicWorksAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getPublicWorksAsync.rejected, (state, action: any) => {
      state.status.getPublicWorksAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener obras públicas',
        loading: false,
      };
    });

  // GET ALL PUBLIC WORKS (admin)
  builder
    .addCase(getAllPublicWorksAsync.pending, (state) => {
      state.status.getAllPublicWorksAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getAllPublicWorksAsync.fulfilled, (state, action) => {
      state.publicWorks = action.payload;
      state.lastFetched['publicWorks'] = Date.now();
      state.status.getAllPublicWorksAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getAllPublicWorksAsync.rejected, (state, action: any) => {
      state.status.getAllPublicWorksAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener obras públicas',
        loading: false,
      };
    });

  // GET PUBLIC WORK BY ID
  builder
    .addCase(getPublicWorkByIdAsync.pending, (state) => {
      state.status.getPublicWorkByIdAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getPublicWorkByIdAsync.fulfilled, (state, action) => {
      state.currentPublicWork = action.payload;
      state.status.getPublicWorkByIdAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getPublicWorkByIdAsync.rejected, (state, action: any) => {
      state.status.getPublicWorkByIdAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener obra pública',
        loading: false,
      };
    });

  // CREATE PUBLIC WORK
  builder
    .addCase(createPublicWorkAsync.pending, (state) => {
      state.status.createPublicWorkAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(createPublicWorkAsync.fulfilled, (state, action) => {
      state.publicWorks.push(action.payload);
      state.lastFetched = {};
      state.status.createPublicWorkAsync = {
        response: 'fulfilled',
        message: 'Obra pública creada correctamente',
        loading: false,
      };
    })
    .addCase(createPublicWorkAsync.rejected, (state, action: any) => {
      state.status.createPublicWorkAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al crear obra pública',
        loading: false,
      };
    });

  // UPDATE PUBLIC WORK
  builder
    .addCase(updatePublicWorkAsync.pending, (state) => {
      state.status.updatePublicWorkAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(updatePublicWorkAsync.fulfilled, (state, action) => {
      const index = state.publicWorks.findIndex((w) => w.id === action.payload.id);
      if (index !== -1) {
        state.publicWorks[index] = action.payload;
      }
      if (state.currentPublicWork?.id === action.payload.id) {
        state.currentPublicWork = action.payload;
      }
      state.lastFetched = {};
      state.status.updatePublicWorkAsync = {
        response: 'fulfilled',
        message: 'Obra pública actualizada correctamente',
        loading: false,
      };
    })
    .addCase(updatePublicWorkAsync.rejected, (state, action: any) => {
      state.status.updatePublicWorkAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al actualizar obra pública',
        loading: false,
      };
    });

  // DELETE PUBLIC WORK
  builder
    .addCase(deletePublicWorkAsync.pending, (state) => {
      state.status.deletePublicWorkAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(deletePublicWorkAsync.fulfilled, (state, action) => {
      state.publicWorks = state.publicWorks.filter((w) => w.id !== action.payload);
      if (state.currentPublicWork?.id === action.payload) {
        state.currentPublicWork = null;
      }
      state.lastFetched = {};
      state.status.deletePublicWorkAsync = {
        response: 'fulfilled',
        message: 'Obra pública eliminada correctamente',
        loading: false,
      };
    })
    .addCase(deletePublicWorkAsync.rejected, (state, action: any) => {
      state.status.deletePublicWorkAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al eliminar obra pública',
        loading: false,
      };
    });
};

export default extraReducersPublicWorks;
