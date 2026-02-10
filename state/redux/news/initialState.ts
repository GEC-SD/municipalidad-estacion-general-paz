import { NewsSlice } from '@/types';

const initialState: NewsSlice = {
  newsList: [],
  featuredNews: [],
  currentNews: null,
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
