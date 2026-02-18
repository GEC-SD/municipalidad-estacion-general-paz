import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './initialState';
import extraReducersTramites from './extraReducers';

const tramitesSlice = createSlice({
  name: 'tramites',
  initialState,
  reducers: {
    resetTramitesState: (state) => {
      state.tramites = [];
      state.currentTramite = null;
      state.pagination = { page: 1, limit: 10, total: 0, totalPages: 0 };
      state.lastFetched = {};
      state.status = {};
    },
    clearCurrentTramite: (state) => {
      state.currentTramite = null;
    },
    clearTramitesStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && state.status[action.payload]) {
        delete state.status[action.payload];
      } else {
        state.status = {};
      }
    },
  },
  extraReducers(builder) {
    extraReducersTramites(builder);
  },
});

export const {
  resetTramitesState,
  clearCurrentTramite,
  clearTramitesStatus,
} = tramitesSlice.actions;

export default tramitesSlice.reducer;

export {
  getTramitesAsync,
  getActiveTramitesAsync,
  getTramiteByIdAsync,
  createTramiteAsync,
  updateTramiteAsync,
  deleteTramiteAsync,
} from './thunk';
