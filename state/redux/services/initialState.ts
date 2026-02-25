import { ServicesSlice } from '@/types';

const initialState: ServicesSlice = {
  services: [],
  servicesByCategory: {
    salud: [],
    cultura: [],
    obras: [],
    educacion: [],
    registro: [],
  },
  resenas: {
    salud: null,
    cultura: null,
    obras: null,
    educacion: null,
    registro: null,
  },
  currentService: null,
  lastFetched: {},
  status: {},
};

export default initialState;
