import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { AuthSlice, User } from '@/types';
import {
  loginAsync,
  logoutAsync,
  checkSessionAsync,
  getCurrentUserAsync,
} from './thunk';

const extraReducersAuth = (builder: ActionReducerMapBuilder<AuthSlice>) => {
  // ============================================================================
  // LOGIN
  // ============================================================================
  builder
    .addCase(loginAsync.pending, (state) => {
      state.status.loginAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(loginAsync.fulfilled, (state, action) => {
      state.user = action.payload.user as unknown as User;
      state.session = action.payload.session;
      state.isAuthenticated = true;
      state.status.loginAsync = {
        response: 'fulfilled',
        message: 'Sesión iniciada correctamente',
        loading: false,
      };
    })
    .addCase(loginAsync.rejected, (state, action: any) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.status.loginAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al iniciar sesión',
        loading: false,
      };
    });

  // ============================================================================
  // LOGOUT
  // ============================================================================
  builder
    .addCase(logoutAsync.pending, (state) => {
      state.status.logoutAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(logoutAsync.fulfilled, (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.status.logoutAsync = {
        response: 'fulfilled',
        message: 'Sesión cerrada correctamente',
        loading: false,
      };
    })
    .addCase(logoutAsync.rejected, (state, action: any) => {
      state.status.logoutAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al cerrar sesión',
        loading: false,
      };
    });

  // ============================================================================
  // CHECK SESSION
  // ============================================================================
  builder
    .addCase(checkSessionAsync.pending, (state) => {
      state.status.checkSessionAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(checkSessionAsync.fulfilled, (state, action) => {
      if (action.payload.session) {
        state.session = action.payload.session;
        state.isAuthenticated = true;
      } else {
        state.session = null;
        state.isAuthenticated = false;
      }
      state.status.checkSessionAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(checkSessionAsync.rejected, (state, action: any) => {
      state.session = null;
      state.isAuthenticated = false;
      state.status.checkSessionAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al verificar sesión',
        loading: false,
      };
    });

  // ============================================================================
  // GET CURRENT USER
  // ============================================================================
  builder
    .addCase(getCurrentUserAsync.pending, (state) => {
      state.status.getCurrentUserAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
      state.user = action.payload.user as unknown as User;
      state.status.getCurrentUserAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getCurrentUserAsync.rejected, (state, action: any) => {
      state.user = null;
      state.status.getCurrentUserAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener usuario',
        loading: false,
      };
    });
};

export default extraReducersAuth;
