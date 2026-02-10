import { AuthSlice } from '@/types';

const initialState: AuthSlice = {
  user: null,
  isAuthenticated: false,
  session: null,
  status: {},
};

export default initialState;
