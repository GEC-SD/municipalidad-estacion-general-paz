import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './initialState';
import extraReducersSettings from './extraReducers';

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    resetSettingsState: (state) => {
      state.municipalityInfo = null;
      state.settings = [];
      state.lastFetched = {};
      state.status = {};
    },
    clearSettingsStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && state.status[action.payload]) {
        delete state.status[action.payload];
      } else {
        state.status = {};
      }
    },
  },
  extraReducers(builder) {
    extraReducersSettings(builder);
  },
});

export const { resetSettingsState, clearSettingsStatus } = settingsSlice.actions;

export default settingsSlice.reducer;

export {
  getSettingAsync,
  getAllSettingsAsync,
  getMunicipalityInfoAsync,
  updateSettingAsync,
  updateMunicipalityInfoAsync,
} from './thunk';
