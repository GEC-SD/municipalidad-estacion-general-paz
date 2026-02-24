import { createAsyncThunk } from '@reduxjs/toolkit';
import { EventFormData, EventFilters } from '@/types';
import { translateError } from '@/utils/translateError';
import {
  getEventsApi,
  getFeaturedEventsApi,
  getUpcomingEventsApi,
  getMonthEventsApi,
  getEventByIdApi,
  getEventBySlugApi,
  createEventApi,
  updateEventApi,
  deleteEventApi,
} from './api';

export const getFeaturedEventsAsync = createAsyncThunk(
  'events/getFeaturedEvents',
  async (limit: number = 3, { rejectWithValue }) => {
    try {
      return await getFeaturedEventsApi(limit);
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener eventos destacados'),
      });
    }
  }
);

export const getEventsAsync = createAsyncThunk(
  'events/getEvents',
  async (
    params: { page?: number; limit?: number; filters?: EventFilters },
    { rejectWithValue }
  ) => {
    try {
      const { page = 1, limit = 10, filters } = params;
      const response = await getEventsApi(page, limit, filters);
      return {
        data: response.data,
        count: response.count,
        page,
        limit,
      };
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener eventos'),
      });
    }
  }
);

export const getMonthEventsAsync = createAsyncThunk(
  'events/getMonthEvents',
  async (params: { year: number; month: number }, { rejectWithValue }) => {
    try {
      const data = await getMonthEventsApi(params.year, params.month);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener eventos del mes'),
      });
    }
  }
);

export const getUpcomingEventsAsync = createAsyncThunk(
  'events/getUpcomingEvents',
  async (limit: number = 6, { rejectWithValue }) => {
    try {
      const data = await getUpcomingEventsApi(limit);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener eventos próximos'),
      });
    }
  }
);

export const getEventByIdAsync = createAsyncThunk(
  'events/getEventById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await getEventByIdApi(id);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al obtener evento'),
      });
    }
  }
);

export const getEventBySlugAsync = createAsyncThunk(
  'events/getEventBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const data = await getEventBySlugApi(slug);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Evento no encontrado'),
      });
    }
  }
);

export const createEventAsync = createAsyncThunk(
  'events/createEvent',
  async (eventData: EventFormData, { rejectWithValue }) => {
    try {
      const data = await createEventApi(eventData);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al crear evento'),
      });
    }
  }
);

export const updateEventAsync = createAsyncThunk(
  'events/updateEvent',
  async (
    params: { id: string; data: Partial<EventFormData> },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateEventApi(params.id, params.data);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al actualizar evento'),
      });
    }
  }
);

export const deleteEventAsync = createAsyncThunk(
  'events/deleteEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteEventApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue({
        error: translateError(error, 'Error al eliminar evento'),
      });
    }
  }
);
