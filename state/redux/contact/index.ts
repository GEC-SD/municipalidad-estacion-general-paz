import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './initialState';
import extraReducersContact from './extraReducers';

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetContactState: (state) => {
      state.contacts = [];
      state.emergencyContacts = [];
      state.administrativeContacts = [];
      state.serviceContacts = [];
      state.lastFetched = {};
      state.status = {};
    },
    clearContactStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && state.status[action.payload]) {
        delete state.status[action.payload];
      } else {
        state.status = {};
      }
    },
  },
  extraReducers(builder) {
    extraReducersContact(builder);
  },
});

export const { resetContactState, clearContactStatus } = contactSlice.actions;

export default contactSlice.reducer;

export {
  getContactsAsync,
  getContactsByCategoryAsync,
  getContactByIdAsync,
  createContactAsync,
  updateContactAsync,
  deleteContactAsync,
} from './thunk';
