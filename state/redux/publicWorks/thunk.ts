import { createAsyncThunk } from '@reduxjs/toolkit';
import { PublicWorkFormData } from '@/types';
import {
  getPublicWorksApi,
  getAllPublicWorksApi,
  getPublicWorkByIdApi,
  createPublicWorkApi,
  updatePublicWorkApi,
  deletePublicWorkApi,
} from './api';

export const getPublicWorksAsync = createAsyncThunk(
  'publicWorks/getPublicWorks',
  async (_, { rejectWithValue }) => {
    try {
      return await getPublicWorksApi();
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener obras públicas',
      });
    }
  }
);

export const getAllPublicWorksAsync = createAsyncThunk(
  'publicWorks/getAllPublicWorks',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllPublicWorksApi();
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener obras públicas',
      });
    }
  }
);

export const getPublicWorkByIdAsync = createAsyncThunk(
  'publicWorks/getPublicWorkById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await getPublicWorkByIdApi(id);
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener obra pública',
      });
    }
  }
);

export const createPublicWorkAsync = createAsyncThunk(
  'publicWorks/createPublicWork',
  async (workData: PublicWorkFormData, { rejectWithValue }) => {
    try {
      return await createPublicWorkApi(workData);
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al crear obra pública',
      });
    }
  }
);

export const updatePublicWorkAsync = createAsyncThunk(
  'publicWorks/updatePublicWork',
  async (
    params: { id: string; data: Partial<PublicWorkFormData> },
    { rejectWithValue }
  ) => {
    try {
      return await updatePublicWorkApi(params.id, params.data);
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al actualizar obra pública',
      });
    }
  }
);

export const deletePublicWorkAsync = createAsyncThunk(
  'publicWorks/deletePublicWork',
  async (id: string, { rejectWithValue }) => {
    try {
      await deletePublicWorkApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al eliminar obra pública',
      });
    }
  }
);
