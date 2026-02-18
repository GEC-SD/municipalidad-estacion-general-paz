import { PublicWorksSlice } from '@/types';

const initialState: PublicWorksSlice = {
  publicWorks: [],
  currentPublicWork: null,
  lastFetched: {},
  status: {},
};

export default initialState;