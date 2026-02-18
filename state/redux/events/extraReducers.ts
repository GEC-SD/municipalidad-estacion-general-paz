import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { EventsSlice } from '@/types';
import {
  getEventsAsync,
  getMonthEventsAsync,
  getUpcomingEventsAsync,
  getEventByIdAsync,
  getEventBySlugAsync,
  createEventAsync,
  updateEventAsync,
  deleteEventAsync,
} from './thunk';

const extraReducersEvents = (builder: ActionReducerMapBuilder<EventsSlice>) => {
  // GET EVENTS
  builder
    .addCase(getEventsAsync.pending, (state) => {
      state.status.getEventsAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getEventsAsync.fulfilled, (state, action) => {
      state.events = action.payload.data;
      state.pagination = {
        page: action.payload.page,
        limit: action.payload.limit,
        total: action.payload.count,
        totalPages: Math.ceil(action.payload.count / action.payload.limit),
      };
      state.lastFetched['events'] = Date.now();
      state.status.getEventsAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getEventsAsync.rejected, (state, action: any) => {
      state.status.getEventsAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener eventos',
        loading: false,
      };
    });

  // GET MONTH EVENTS (calendar)
  builder
    .addCase(getMonthEventsAsync.pending, (state) => {
      state.status.getMonthEventsAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getMonthEventsAsync.fulfilled, (state, action) => {
      state.monthEvents = action.payload;
      state.lastFetched['monthEvents'] = Date.now();
      state.status.getMonthEventsAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getMonthEventsAsync.rejected, (state, action: any) => {
      state.status.getMonthEventsAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener eventos del mes',
        loading: false,
      };
    });

  // GET UPCOMING EVENTS
  builder
    .addCase(getUpcomingEventsAsync.pending, (state) => {
      state.status.getUpcomingEventsAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getUpcomingEventsAsync.fulfilled, (state, action) => {
      state.upcomingEvents = action.payload;
      state.lastFetched['upcomingEvents'] = Date.now();
      state.status.getUpcomingEventsAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getUpcomingEventsAsync.rejected, (state, action: any) => {
      state.status.getUpcomingEventsAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener eventos próximos',
        loading: false,
      };
    });

  // GET EVENT BY ID
  builder
    .addCase(getEventByIdAsync.pending, (state) => {
      state.status.getEventByIdAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getEventByIdAsync.fulfilled, (state, action) => {
      state.currentEvent = action.payload;
      state.status.getEventByIdAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getEventByIdAsync.rejected, (state, action: any) => {
      state.currentEvent = null;
      state.status.getEventByIdAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener evento',
        loading: false,
      };
    });

  // GET EVENT BY SLUG
  builder
    .addCase(getEventBySlugAsync.pending, (state) => {
      state.status.getEventBySlugAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getEventBySlugAsync.fulfilled, (state, action) => {
      state.currentEvent = action.payload;
      state.status.getEventBySlugAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getEventBySlugAsync.rejected, (state, action: any) => {
      state.currentEvent = null;
      state.status.getEventBySlugAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Evento no encontrado',
        loading: false,
      };
    });

  // CREATE EVENT
  builder
    .addCase(createEventAsync.pending, (state) => {
      state.status.createEventAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(createEventAsync.fulfilled, (state, action) => {
      state.events.unshift(action.payload);
      state.monthEvents = [];
      state.lastFetched = {};
      state.status.createEventAsync = {
        response: 'fulfilled',
        message: 'Evento creado correctamente',
        loading: false,
      };
    })
    .addCase(createEventAsync.rejected, (state, action: any) => {
      state.status.createEventAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al crear evento',
        loading: false,
      };
    });

  // UPDATE EVENT
  builder
    .addCase(updateEventAsync.pending, (state) => {
      state.status.updateEventAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(updateEventAsync.fulfilled, (state, action) => {
      const index = state.events.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
      if (state.currentEvent?.id === action.payload.id) {
        state.currentEvent = action.payload;
      }
      state.monthEvents = [];
      state.lastFetched = {};
      state.status.updateEventAsync = {
        response: 'fulfilled',
        message: 'Evento actualizado correctamente',
        loading: false,
      };
    })
    .addCase(updateEventAsync.rejected, (state, action: any) => {
      state.status.updateEventAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al actualizar evento',
        loading: false,
      };
    });

  // DELETE EVENT
  builder
    .addCase(deleteEventAsync.pending, (state) => {
      state.status.deleteEventAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(deleteEventAsync.fulfilled, (state, action) => {
      state.events = state.events.filter((e) => e.id !== action.payload);
      state.monthEvents = state.monthEvents.filter((e) => e.id !== action.payload);
      if (state.currentEvent?.id === action.payload) {
        state.currentEvent = null;
      }
      state.lastFetched = {};
      state.status.deleteEventAsync = {
        response: 'fulfilled',
        message: 'Evento eliminado correctamente',
        loading: false,
      };
    })
    .addCase(deleteEventAsync.rejected, (state, action: any) => {
      state.status.deleteEventAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al eliminar evento',
        loading: false,
      };
    });
};

export default extraReducersEvents;
