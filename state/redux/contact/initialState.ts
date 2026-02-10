import { ContactSlice } from '@/types';

const initialState: ContactSlice = {
  contacts: [],
  emergencyContacts: [],
  administrativeContacts: [],
  serviceContacts: [],
  lastFetched: {},
  status: {},
};

export default initialState;
