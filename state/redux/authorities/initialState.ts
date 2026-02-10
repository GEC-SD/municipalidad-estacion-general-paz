import { AuthoritiesSlice } from '@/types';

const initialState: AuthoritiesSlice = {
  authorities: [],
  currentAuthority: null,
  intendente: null,
  gabinete: [],
  concejo: [],
  lastFetched: {},
  status: {},
};

export default initialState;
