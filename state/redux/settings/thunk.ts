import { createAsyncThunk } from '@reduxjs/toolkit';
import { MunicipalityInfo } from '@/types';
import {
  getSettingApi,
  getAllSettingsApi,
  getMunicipalityInfoApi,
  updateSettingApi,
  updateMunicipalityInfoApi,
} from './api';

export const getSettingAsync = createAsyncThunk(
  'settings/getSetting',
  async (key: string, { rejectWithValue }) => {
    try {
      return await getSettingApi(key);
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener configuración',
      });
    }
  }
);

export const getAllSettingsAsync = createAsyncThunk(
  'settings/getAllSettings',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllSettingsApi();
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener configuraciones',
      });
    }
  }
);

export const getMunicipalityInfoAsync = createAsyncThunk(
  'settings/getMunicipalityInfo',
  async (_, { rejectWithValue }) => {
    try {
      return await getMunicipalityInfoApi();
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener información de la municipalidad',
      });
    }
  }
);

export const updateSettingAsync = createAsyncThunk(
  'settings/updateSetting',
  async (params: { key: string; value: any }, { rejectWithValue }) => {
    try {
      return await updateSettingApi(params.key, params.value);
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al actualizar configuración',
      });
    }
  }
);

export const updateMunicipalityInfoAsync = createAsyncThunk(
  'settings/updateMunicipalityInfo',
  async (info: Partial<MunicipalityInfo>, { rejectWithValue }) => {
    try {
      await updateMunicipalityInfoApi(info);
      return info;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al actualizar información de la municipalidad',
      });
    }
  }
);
