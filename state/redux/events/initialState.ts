import { EventsSlice } from '@/types';

const initialState: EventsSlice = {
  events: [],
  upcomingEvents: [],
  currentEvent: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  lastFetched: {},
  status: {},
};

export default initialState;
