import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './initialState';
import extraReducersPublicWorks from './extraReducers';

const publicWorksSlice = createSlice({
  name: 'publicWorks',
  initialState,
  reducers: {
    setCurrentPublicWork: (state, action) => {
      state.currentPublicWork = action.payload;
    },
    clearCurrentPublicWork: (state) => {
      state.currentPublicWork = null;
    },
    resetPublicWorksState: (state) => {
      state.publicWorks = [];
      state.currentPublicWork = null;
      state.lastFetched = {};
      state.status = {};
    },
    clearPublicWorksStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && state.status[action.payload]) {
        delete state.status[action.payload];
      } else {
        state.status = {};
      }
    },
  },
  extraReducers(builder) {
    extraReducersPublicWorks(builder);
  },
});

export const {
  setCurrentPublicWork,
  clearCurrentPublicWork,
  resetPublicWorksState,
  clearPublicWorksStatus,
} = publicWorksSlice.actions;

export default publicWorksSlice.reducer;

// Re-export thunks
export {
  getPublicWorksAsync,
  getAllPublicWorksAsync,
  getPublicWorkByIdAsync,
  createPublicWorkAsync,
  updatePublicWorkAsync,
  deletePublicWorkAsync,
} from './thunk';
