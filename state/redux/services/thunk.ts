import { createAsyncThunk } from '@reduxjs/toolkit';
import { ServiceFormData, ServiceCategory } from '@/types';
import { translateError } from '@/utils/translateError';
import {
  getServicesApi,
  getServicesByCategoryApi,
  getServiceByIdApi,
  getServiceBySlugApi,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
  getAreaResenaApi,
  upsertAreaResenaApi,
} from './api';

export const getServicesAsync = createAsyncThunk(
  'services/getServices',
  async (_, { rejectWithValue }) => {
    try {
      return await getServicesApi();
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener servicios'),
      });
    }
  }
);

export const getServicesByCategoryAsync = createAsyncThunk(
  'services/getServicesByCategory',
  async (category: ServiceCategory, { rejectWithValue }) => {
    try {
      const data = await getServicesByCategoryApi(category);
      return { category, data };
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener servicios por categoría'),
      });
    }
  }
);

export const getServiceByIdAsync = createAsyncThunk(
  'services/getServiceById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getServiceByIdApi(id);
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener servicio'),
      });
    }
  }
);

export const getServiceBySlugAsync = createAsyncThunk(
  'services/getServiceBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      return await getServiceBySlugApi(slug);
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Servicio no encontrado'),
      });
    }
  }
);

export const createServiceAsync = createAsyncThunk(
  'services/createService',
  async (serviceData: ServiceFormData, { rejectWithValue }) => {
    try {
      return await createServiceApi(serviceData);
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al crear servicio'),
      });
    }
  }
);

export const updateServiceAsync = createAsyncThunk(
  'services/updateService',
  async (
    params: { id: string; data: Partial<ServiceFormData> },
    { rejectWithValue }
  ) => {
    try {
      return await updateServiceApi(params.id, params.data);
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al actualizar servicio'),
      });
    }
  }
);

export const deleteServiceAsync = createAsyncThunk(
  'services/deleteService',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteServiceApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al eliminar servicio'),
      });
    }
  }
);

export const getAreaResenaAsync = createAsyncThunk(
  'services/getAreaResena',
  async (area: ServiceCategory, { rejectWithValue }) => {
    try {
      const data = await getAreaResenaApi(area);
      return { area, data };
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener reseña'),
      });
    }
  }
);

export const upsertAreaResenaAsync = createAsyncThunk(
  'services/upsertAreaResena',
  async (params: { area: ServiceCategory; content: string }, { rejectWithValue }) => {
    try {
      return await upsertAreaResenaApi(params.area, params.content);
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al guardar reseña'),
      });
    }
  }
);
