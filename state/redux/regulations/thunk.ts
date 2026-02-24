import { createAsyncThunk } from '@reduxjs/toolkit';
import { RegulationFormData, RegulationFilters } from '@/types';
import { translateError } from '@/utils/translateError';
import {
  getRegulationsApi,
  getRegulationByIdApi,
  createRegulationApi,
  updateRegulationApi,
  deleteRegulationApi,
} from './api';

export const getRegulationsAsync = createAsyncThunk(
  'regulations/getRegulations',
  async (
    params: { page?: number; limit?: number; filters?: RegulationFilters },
    { rejectWithValue }
  ) => {
    try {
      const { page = 1, limit = 10, filters } = params;
      const response = await getRegulationsApi(page, limit, filters);
      return { ...response, page, limit };
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener normativa'),
      });
    }
  }
);

export const getRegulationByIdAsync = createAsyncThunk(
  'regulations/getRegulationById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getRegulationByIdApi(id);
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener normativa'),
      });
    }
  }
);

export const createRegulationAsync = createAsyncThunk(
  'regulations/createRegulation',
  async (regulationData: RegulationFormData, { rejectWithValue }) => {
    try {
      return await createRegulationApi(regulationData);
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al crear normativa'),
      });
    }
  }
);

export const updateRegulationAsync = createAsyncThunk(
  'regulations/updateRegulation',
  async (
    params: { id: string; data: Partial<RegulationFormData> },
    { rejectWithValue }
  ) => {
    try {
      return await updateRegulationApi(params.id, params.data);
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al actualizar normativa'),
      });
    }
  }
);

export const deleteRegulationAsync = createAsyncThunk(
  'regulations/deleteRegulation',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteRegulationApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al eliminar normativa'),
      });
    }
  }
);
