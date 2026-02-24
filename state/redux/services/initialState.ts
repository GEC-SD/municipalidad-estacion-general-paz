import { ServicesSlice } from '@/types';

const initialState: ServicesSlice = {
  services: [],
  servicesByCategory: {
    salud: [],
    cultura: [],
    obras: [],
    educacion: [],
  },
  resenas: {
    salud: null,
    cultura: null,
    obras: null,
    educacion: null,
  },
  currentService: null,
  lastFetched: {},
  status: {},
};

export default initialState;
