import { TramitesSlice } from '@/types';

const initialState: TramitesSlice = {
  tramites: [],
  currentTramite: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  lastFetched: {},
  status: {},
};

export default initialState;
