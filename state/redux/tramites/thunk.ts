import { createAsyncThunk } from '@reduxjs/toolkit';
import { TramiteFormData } from '@/types';
import {
  getTramitesApi,
  getActiveTramitesApi,
  getTramiteByIdApi,
  createTramiteApi,
  updateTramiteApi,
  deleteTramiteApi,
} from './api';

export const getTramitesAsync = createAsyncThunk(
  'tramites/getTramites',
  async (
    params: { page?: number; limit?: number; search?: string },
    { rejectWithValue }
  ) => {
    try {
      const { page = 1, limit = 10, search } = params;
      const response = await getTramitesApi(page, limit, search);
      return { ...response, page, limit };
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener trámites',
      });
    }
  }
);

export const getActiveTramitesAsync = createAsyncThunk(
  'tramites/getActiveTramites',
  async (_, { rejectWithValue }) => {
    try {
      return await getActiveTramitesApi();
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener trámites',
      });
    }
  }
);

export const getTramiteByIdAsync = createAsyncThunk(
  'tramites/getTramiteById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getTramiteByIdApi(id);
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener trámite',
      });
    }
  }
);

export const createTramiteAsync = createAsyncThunk(
  'tramites/createTramite',
  async (tramiteData: TramiteFormData, { rejectWithValue }) => {
    try {
      return await createTramiteApi(tramiteData);
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al crear trámite',
      });
    }
  }
);

export const updateTramiteAsync = createAsyncThunk(
  'tramites/updateTramite',
  async (
    params: { id: string; data: Partial<TramiteFormData> },
    { rejectWithValue }
  ) => {
    try {
      return await updateTramiteApi(params.id, params.data);
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al actualizar trámite',
      });
    }
  }
);

export const deleteTramiteAsync = createAsyncThunk(
  'tramites/deleteTramite',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTramiteApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al eliminar trámite',
      });
    }
  }
);
