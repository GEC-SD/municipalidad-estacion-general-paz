import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { SettingsSlice } from '@/types';
import {
  getSettingAsync,
  getAllSettingsAsync,
  getMunicipalityInfoAsync,
  updateSettingAsync,
  updateMunicipalityInfoAsync,
} from './thunk';

const extraReducersSettings = (builder: ActionReducerMapBuilder<SettingsSlice>) => {
  builder
    .addCase(getSettingAsync.pending, (state) => {
      state.status.getSettingAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getSettingAsync.fulfilled, (state, action) => {
      state.settings[action.payload.key] = action.payload.value;
      state.status.getSettingAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getSettingAsync.rejected, (state, action: any) => {
      state.status.getSettingAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener configuración',
        loading: false,
      };
    });

  builder
    .addCase(getAllSettingsAsync.pending, (state) => {
      state.status.getAllSettingsAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getAllSettingsAsync.fulfilled, (state, action) => {
      action.payload.forEach((setting) => {
        state.settings[setting.key] = setting.value;
      });
      state.lastFetched['settings'] = Date.now();
      state.status.getAllSettingsAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getAllSettingsAsync.rejected, (state, action: any) => {
      state.status.getAllSettingsAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener configuraciones',
        loading: false,
      };
    });

  builder
    .addCase(getMunicipalityInfoAsync.pending, (state) => {
      state.status.getMunicipalityInfoAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getMunicipalityInfoAsync.fulfilled, (state, action) => {
      state.municipalityInfo = action.payload;
      state.lastFetched['municipalityInfo'] = Date.now();
      state.status.getMunicipalityInfoAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getMunicipalityInfoAsync.rejected, (state, action: any) => {
      state.status.getMunicipalityInfoAsync = {
        response: 'rejected',
        message:
          action.payload?.error || 'Error al obtener información de la municipalidad',
        loading: false,
      };
    });

  builder
    .addCase(updateSettingAsync.pending, (state) => {
      state.status.updateSettingAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(updateSettingAsync.fulfilled, (state, action) => {
      state.settings[action.payload.key] = action.payload.value;
      state.lastFetched = {};
      state.status.updateSettingAsync = {
        response: 'fulfilled',
        message: 'Configuración actualizada correctamente',
        loading: false,
      };
    })
    .addCase(updateSettingAsync.rejected, (state, action: any) => {
      state.status.updateSettingAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al actualizar configuración',
        loading: false,
      };
    });

  builder
    .addCase(updateMunicipalityInfoAsync.pending, (state) => {
      state.status.updateMunicipalityInfoAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(updateMunicipalityInfoAsync.fulfilled, (state, action) => {
      state.municipalityInfo = {
        ...state.municipalityInfo,
        ...action.payload,
      } as any;
      state.lastFetched = {};
      state.status.updateMunicipalityInfoAsync = {
        response: 'fulfilled',
        message: 'Información actualizada correctamente',
        loading: false,
      };
    })
    .addCase(updateMunicipalityInfoAsync.rejected, (state, action: any) => {
      state.status.updateMunicipalityInfoAsync = {
        response: 'rejected',
        message:
          action.payload?.error || 'Error al actualizar información de la municipalidad',
        loading: false,
      };
    });
};

export default extraReducersSettings;
