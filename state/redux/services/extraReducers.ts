import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { ServicesSlice, ServiceCategory } from '@/types';
import {
  getServicesAsync,
  getServicesByCategoryAsync,
  getServiceByIdAsync,
  getServiceBySlugAsync,
  createServiceAsync,
  updateServiceAsync,
  deleteServiceAsync,
  getAreaResenaAsync,
  upsertAreaResenaAsync,
} from './thunk';

const extraReducersServices = (
  builder: ActionReducerMapBuilder<ServicesSlice>
) => {
  // GET SERVICES
  builder
    .addCase(getServicesAsync.pending, (state) => {
      state.status.getServicesAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getServicesAsync.fulfilled, (state, action) => {
      state.services = action.payload;
      state.servicesByCategory = {
        salud: action.payload.filter((s) => s.category === 'salud'),
        cultura: action.payload.filter((s) => s.category === 'cultura'),
        obras: action.payload.filter((s) => s.category === 'obras'),
        educacion: action.payload.filter((s) => s.category === 'educacion'),
        registro: action.payload.filter((s) => s.category === 'registro'),
      };
      const now = Date.now();
      state.lastFetched['services'] = now;
      state.lastFetched['servicesByCategory.salud'] = now;
      state.lastFetched['servicesByCategory.cultura'] = now;
      state.lastFetched['servicesByCategory.obras'] = now;
      state.lastFetched['servicesByCategory.educacion'] = now;
      state.lastFetched['servicesByCategory.registro'] = now;
      state.status.getServicesAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getServicesAsync.rejected, (state, action: any) => {
      state.status.getServicesAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener servicios',
        loading: false,
      };
    });

  // GET SERVICES BY CATEGORY
  builder
    .addCase(getServicesByCategoryAsync.pending, (state) => {
      state.status.getServicesByCategoryAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getServicesByCategoryAsync.fulfilled, (state, action) => {
      const { category, data } = action.payload;
      state.servicesByCategory[category] = data;
      state.lastFetched[`servicesByCategory.${category}`] = Date.now();
      state.status.getServicesByCategoryAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getServicesByCategoryAsync.rejected, (state, action: any) => {
      state.status.getServicesByCategoryAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener servicios por categoría',
        loading: false,
      };
    });

  // GET SERVICE BY ID
  builder
    .addCase(getServiceByIdAsync.pending, (state) => {
      state.status.getServiceByIdAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getServiceByIdAsync.fulfilled, (state, action) => {
      state.currentService = action.payload;
      state.status.getServiceByIdAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getServiceByIdAsync.rejected, (state, action: any) => {
      state.status.getServiceByIdAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener servicio',
        loading: false,
      };
    });

  // GET SERVICE BY SLUG
  builder
    .addCase(getServiceBySlugAsync.pending, (state) => {
      state.status.getServiceBySlugAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getServiceBySlugAsync.fulfilled, (state, action) => {
      state.currentService = action.payload;
      state.status.getServiceBySlugAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getServiceBySlugAsync.rejected, (state, action: any) => {
      state.status.getServiceBySlugAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Servicio no encontrado',
        loading: false,
      };
    });

  // CREATE SERVICE
  builder
    .addCase(createServiceAsync.pending, (state) => {
      state.status.createServiceAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(createServiceAsync.fulfilled, (state, action) => {
      state.services.push(action.payload);
      const category = action.payload.category as ServiceCategory;
      if (state.servicesByCategory[category]) {
        state.servicesByCategory[category].push(action.payload);
      }
      state.lastFetched = {};
      state.status.createServiceAsync = {
        response: 'fulfilled',
        message: 'Servicio creado correctamente',
        loading: false,
      };
    })
    .addCase(createServiceAsync.rejected, (state, action: any) => {
      state.status.createServiceAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al crear servicio',
        loading: false,
      };
    });

  // UPDATE SERVICE
  builder
    .addCase(updateServiceAsync.pending, (state) => {
      state.status.updateServiceAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(updateServiceAsync.fulfilled, (state, action) => {
      const index = state.services.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = action.payload;
      }
      if (state.currentService?.id === action.payload.id) {
        state.currentService = action.payload;
      }
      state.lastFetched = {};
      state.status.updateServiceAsync = {
        response: 'fulfilled',
        message: 'Servicio actualizado correctamente',
        loading: false,
      };
    })
    .addCase(updateServiceAsync.rejected, (state, action: any) => {
      state.status.updateServiceAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al actualizar servicio',
        loading: false,
      };
    });

  // DELETE SERVICE
  builder
    .addCase(deleteServiceAsync.pending, (state) => {
      state.status.deleteServiceAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(deleteServiceAsync.fulfilled, (state, action) => {
      state.services = state.services.filter((s) => s.id !== action.payload);
      if (state.currentService?.id === action.payload) {
        state.currentService = null;
      }
      state.lastFetched = {};
      state.status.deleteServiceAsync = {
        response: 'fulfilled',
        message: 'Servicio eliminado correctamente',
        loading: false,
      };
    })
    .addCase(deleteServiceAsync.rejected, (state, action: any) => {
      state.status.deleteServiceAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al eliminar servicio',
        loading: false,
      };
    });

  // GET AREA RESENA
  builder
    .addCase(getAreaResenaAsync.pending, (state) => {
      state.status.getAreaResenaAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getAreaResenaAsync.fulfilled, (state, action) => {
      const { area, data } = action.payload;
      state.resenas[area] = data;
      state.lastFetched[`resena.${area}`] = Date.now();
      state.status.getAreaResenaAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getAreaResenaAsync.rejected, (state, action: any) => {
      state.status.getAreaResenaAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener reseña',
        loading: false,
      };
    });

  // UPSERT AREA RESENA
  builder
    .addCase(upsertAreaResenaAsync.pending, (state) => {
      state.status.upsertAreaResenaAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(upsertAreaResenaAsync.fulfilled, (state, action) => {
      const resena = action.payload;
      state.resenas[resena.area] = resena;
      state.lastFetched[`resena.${resena.area}`] = Date.now();
      state.status.upsertAreaResenaAsync = {
        response: 'fulfilled',
        message: 'Reseña guardada correctamente',
        loading: false,
      };
    })
    .addCase(upsertAreaResenaAsync.rejected, (state, action: any) => {
      state.status.upsertAreaResenaAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al guardar reseña',
        loading: false,
      };
    });
};

export default extraReducersServices;
