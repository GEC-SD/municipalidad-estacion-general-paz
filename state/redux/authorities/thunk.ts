import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthorityFormData, AuthorityCategory } from '@/types';
import { translateError } from '@/utils/translateError';
import {
  getAuthoritiesApi,
  getAuthoritiesByCategoryApi,
  getAuthorityByIdApi,
  createAuthorityApi,
  updateAuthorityApi,
  deleteAuthorityApi,
} from './api';

/**
 * Obtener todas las autoridades
 */
export const getAuthoritiesAsync = createAsyncThunk(
  'authorities/getAuthorities',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAuthoritiesApi();
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener autoridades'),
      });
    }
  }
);

/**
 * Obtener autoridades por categoría
 */
export const getAuthoritiesByCategoryAsync = createAsyncThunk(
  'authorities/getAuthoritiesByCategory',
  async (category: AuthorityCategory, { rejectWithValue }) => {
    try {
      const data = await getAuthoritiesByCategoryApi(category);
      return { category, data };
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener autoridades por categoría'),
      });
    }
  }
);

/**
 * Obtener autoridad por ID
 */
export const getAuthorityByIdAsync = createAsyncThunk(
  'authorities/getAuthorityById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await getAuthorityByIdApi(id);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener autoridad'),
      });
    }
  }
);

/**
 * Crear nueva autoridad
 */
export const createAuthorityAsync = createAsyncThunk(
  'authorities/createAuthority',
  async (authorityData: AuthorityFormData, { rejectWithValue }) => {
    try {
      const data = await createAuthorityApi(authorityData);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al crear autoridad'),
      });
    }
  }
);

/**
 * Actualizar autoridad
 */
export const updateAuthorityAsync = createAsyncThunk(
  'authorities/updateAuthority',
  async (
    params: { id: string; data: Partial<AuthorityFormData> },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateAuthorityApi(params.id, params.data);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al actualizar autoridad'),
      });
    }
  }
);

/**
 * Eliminar autoridad
 */
export const deleteAuthorityAsync = createAsyncThunk(
  'authorities/deleteAuthority',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteAuthorityApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al eliminar autoridad'),
      });
    }
  }
);
