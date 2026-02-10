import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { AuthoritiesSlice } from '@/types';
import {
  getAuthoritiesAsync,
  getAuthoritiesByCategoryAsync,
  getAuthorityByIdAsync,
  createAuthorityAsync,
  updateAuthorityAsync,
  deleteAuthorityAsync,
} from './thunk';

const extraReducersAuthorities = (
  builder: ActionReducerMapBuilder<AuthoritiesSlice>
) => {
  // ============================================================================
  // GET ALL AUTHORITIES
  // ============================================================================
  builder
    .addCase(getAuthoritiesAsync.pending, (state) => {
      state.status.getAuthoritiesAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getAuthoritiesAsync.fulfilled, (state, action) => {
      state.authorities = action.payload;

      // Separar por categorías
      state.intendente =
        action.payload.find((a) => a.category === 'intendente') || null;
      state.gabinete = action.payload.filter((a) => a.category === 'gabinete');
      state.concejo = action.payload.filter((a) => a.category === 'concejo');

      const now = Date.now();
      state.lastFetched['intendente'] = now;
      state.lastFetched['gabinete'] = now;
      state.lastFetched['concejo'] = now;

      state.status.getAuthoritiesAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getAuthoritiesAsync.rejected, (state, action: any) => {
      state.status.getAuthoritiesAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener autoridades',
        loading: false,
      };
    });

  // ============================================================================
  // GET AUTHORITIES BY CATEGORY
  // ============================================================================
  builder
    .addCase(getAuthoritiesByCategoryAsync.pending, (state) => {
      state.status.getAuthoritiesByCategoryAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getAuthoritiesByCategoryAsync.fulfilled, (state, action) => {
      const { category, data } = action.payload;

      if (category === 'intendente') {
        state.intendente = data[0] || null;
      } else if (category === 'gabinete') {
        state.gabinete = data;
      } else if (category === 'concejo') {
        state.concejo = data;
      }

      state.lastFetched[category] = Date.now();

      state.status.getAuthoritiesByCategoryAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getAuthoritiesByCategoryAsync.rejected, (state, action: any) => {
      state.status.getAuthoritiesByCategoryAsync = {
        response: 'rejected',
        message:
          action.payload?.error || 'Error al obtener autoridades por categoría',
        loading: false,
      };
    });

  // ============================================================================
  // GET AUTHORITY BY ID
  // ============================================================================
  builder
    .addCase(getAuthorityByIdAsync.pending, (state) => {
      state.status.getAuthorityByIdAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getAuthorityByIdAsync.fulfilled, (state, action) => {
      state.currentAuthority = action.payload;
      state.status.getAuthorityByIdAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getAuthorityByIdAsync.rejected, (state, action: any) => {
      state.status.getAuthorityByIdAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener autoridad',
        loading: false,
      };
    });

  // ============================================================================
  // CREATE AUTHORITY
  // ============================================================================
  builder
    .addCase(createAuthorityAsync.pending, (state) => {
      state.status.createAuthorityAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(createAuthorityAsync.fulfilled, (state, action) => {
      state.authorities.push(action.payload);

      // Agregar a la categoría correspondiente
      if (action.payload.category === 'intendente') {
        state.intendente = action.payload;
      } else if (action.payload.category === 'gabinete') {
        state.gabinete.push(action.payload);
      } else if (action.payload.category === 'concejo') {
        state.concejo.push(action.payload);
      }

      state.lastFetched = {};
      state.status.createAuthorityAsync = {
        response: 'fulfilled',
        message: 'Autoridad creada correctamente',
        loading: false,
      };
    })
    .addCase(createAuthorityAsync.rejected, (state, action: any) => {
      state.status.createAuthorityAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al crear autoridad',
        loading: false,
      };
    });

  // ============================================================================
  // UPDATE AUTHORITY
  // ============================================================================
  builder
    .addCase(updateAuthorityAsync.pending, (state) => {
      state.status.updateAuthorityAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(updateAuthorityAsync.fulfilled, (state, action) => {
      const index = state.authorities.findIndex(
        (a) => a.id === action.payload.id
      );
      if (index !== -1) {
        state.authorities[index] = action.payload;
      }

      // Actualizar en la categoría correspondiente
      if (action.payload.category === 'intendente') {
        state.intendente = action.payload;
      } else if (action.payload.category === 'gabinete') {
        const gabIndex = state.gabinete.findIndex(
          (a) => a.id === action.payload.id
        );
        if (gabIndex !== -1) {
          state.gabinete[gabIndex] = action.payload;
        }
      } else if (action.payload.category === 'concejo') {
        const conIndex = state.concejo.findIndex(
          (a) => a.id === action.payload.id
        );
        if (conIndex !== -1) {
          state.concejo[conIndex] = action.payload;
        }
      }

      state.lastFetched = {};
      state.status.updateAuthorityAsync = {
        response: 'fulfilled',
        message: 'Autoridad actualizada correctamente',
        loading: false,
      };
    })
    .addCase(updateAuthorityAsync.rejected, (state, action: any) => {
      state.status.updateAuthorityAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al actualizar autoridad',
        loading: false,
      };
    });

  // ============================================================================
  // DELETE AUTHORITY
  // ============================================================================
  builder
    .addCase(deleteAuthorityAsync.pending, (state) => {
      state.status.deleteAuthorityAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(deleteAuthorityAsync.fulfilled, (state, action) => {
      state.authorities = state.authorities.filter(
        (a) => a.id !== action.payload
      );

      if (state.intendente?.id === action.payload) {
        state.intendente = null;
      }
      state.gabinete = state.gabinete.filter((a) => a.id !== action.payload);
      state.concejo = state.concejo.filter((a) => a.id !== action.payload);

      state.lastFetched = {};
      state.status.deleteAuthorityAsync = {
        response: 'fulfilled',
        message: 'Autoridad eliminada correctamente',
        loading: false,
      };
    })
    .addCase(deleteAuthorityAsync.rejected, (state, action: any) => {
      state.status.deleteAuthorityAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al eliminar autoridad',
        loading: false,
      };
    });
};

export default extraReducersAuthorities;
