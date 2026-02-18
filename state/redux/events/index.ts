import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './initialState';
import extraReducersEvents from './extraReducers';
import { EventFilters } from '@/types';

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEventFilters: (state, action: PayloadAction<EventFilters>) => {
      state.filters = action.payload;
    },
    clearEventFilters: (state) => {
      state.filters = {};
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    resetEventsState: (state) => {
      state.events = [];
      state.upcomingEvents = [];
      state.currentEvent = null;
      state.pagination = { page: 1, limit: 10, total: 0, totalPages: 0 };
      state.filters = {};
      state.lastFetched = {};
      state.status = {};
    },
    clearEventsStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && state.status[action.payload]) {
        delete state.status[action.payload];
      } else {
        state.status = {};
      }
    },
  },
  extraReducers(builder) {
    extraReducersEvents(builder);
  },
});

export const {
  setEventFilters,
  clearEventFilters,
  setCurrentEvent,
  clearCurrentEvent,
  resetEventsState,
  clearEventsStatus,
} = eventsSlice.actions;

export default eventsSlice.reducer;

// Re-export thunks
export {
  getEventsAsync,
  getMonthEventsAsync,
  getUpcomingEventsAsync,
  getEventByIdAsync,
  getEventBySlugAsync,
  createEventAsync,
  updateEventAsync,
  deleteEventAsync,
} from './thunk';
