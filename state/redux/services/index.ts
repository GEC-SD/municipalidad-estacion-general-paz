import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './initialState';
import extraReducersServices from './extraReducers';

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setCurrentService: (state, action) => {
      state.currentService = action.payload;
    },
    clearCurrentService: (state) => {
      state.currentService = null;
    },
    resetServicesState: (state) => {
      state.services = [];
      state.servicesByCategory = {
        salud: [],
        cultura: [],
        obras: [],
        educacion: [],
      };
      state.currentService = null;
      state.lastFetched = {};
      state.status = {};
    },
    clearServicesStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && state.status[action.payload]) {
        delete state.status[action.payload];
      } else {
        state.status = {};
      }
    },
  },
  extraReducers(builder) {
    extraReducersServices(builder);
  },
});

export const {
  setCurrentService,
  clearCurrentService,
  resetServicesState,
  clearServicesStatus,
} = servicesSlice.actions;

export default servicesSlice.reducer;

// Re-export thunks
export {
  getServicesAsync,
  getServicesByCategoryAsync,
  getServiceByIdAsync,
  getServiceBySlugAsync,
  createServiceAsync,
  updateServiceAsync,
  deleteServiceAsync,
  getAreaResenaAsync,
  upsertAreaResenaAsync,
} from './thunk';
