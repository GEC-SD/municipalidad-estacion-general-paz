import { createAsyncThunk } from '@reduxjs/toolkit';
import { LoginCredentials } from '@/types';
import { loginApi, logoutApi, checkSessionApi, getCurrentUserApi } from './api';

/**
 * Login async thunk
 * Inicia sesión con email y contraseña
 */
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al iniciar sesión',
      });
    }
  }
);

/**
 * Logout async thunk
 * Cierra la sesión del usuario
 */
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      return true;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al cerrar sesión',
      });
    }
  }
);

/**
 * Check session async thunk
 * Verifica si hay una sesión activa
 */
export const checkSessionAsync = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkSessionApi();
      return response;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al verificar sesión',
      });
    }
  }
);

/**
 * Get current user async thunk
 * Obtiene el usuario actual
 */
export const getCurrentUserAsync = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserApi();
      return response;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener usuario',
      });
    }
  }
);
