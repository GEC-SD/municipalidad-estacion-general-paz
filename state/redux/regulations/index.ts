import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './initialState';
import extraReducersRegulations from './extraReducers';
import { RegulationFilters } from '@/types';

const regulationsSlice = createSlice({
  name: 'regulations',
  initialState,
  reducers: {
    setRegulationFilters: (state, action: PayloadAction<RegulationFilters>) => {
      state.filters = action.payload;
    },
    clearRegulationFilters: (state) => {
      state.filters = {};
    },
    resetRegulationsState: (state) => {
      state.regulations = [];
      state.currentRegulation = null;
      state.pagination = { page: 1, limit: 10, total: 0, totalPages: 0 };
      state.filters = {};
      state.lastFetched = {};
      state.status = {};
    },
    clearCurrentRegulation: (state) => {
      state.currentRegulation = null;
    },
    clearRegulationsStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && state.status[action.payload]) {
        delete state.status[action.payload];
      } else {
        state.status = {};
      }
    },
  },
  extraReducers(builder) {
    extraReducersRegulations(builder);
  },
});

export const {
  setRegulationFilters,
  clearRegulationFilters,
  resetRegulationsState,
  clearRegulationsStatus,
  clearCurrentRegulation,
} = regulationsSlice.actions;

export default regulationsSlice.reducer;

export {
  getRegulationsAsync,
  getRegulationByIdAsync,
  createRegulationAsync,
  updateRegulationAsync,
  deleteRegulationAsync,
} from './thunk';
