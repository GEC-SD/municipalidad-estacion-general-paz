import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {},
});

export default appSlice.reducer;
