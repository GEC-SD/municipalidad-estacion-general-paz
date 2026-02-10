import { createAsyncThunk } from '@reduxjs/toolkit';
import { NewsFormData, NewsFilters } from '@/types';
import {
  getNewsApi,
  getPublishedNewsApi,
  getFeaturedNewsApi,
  getNewsByIdApi,
  getNewsBySlugApi,
  createNewsApi,
  updateNewsApi,
  deleteNewsApi,
  createNewsAttachmentApi,
  deleteNewsAttachmentApi,
} from './api';

/**
 * Obtener todas las noticias (admin)
 */
export const getNewsAsync = createAsyncThunk(
  'news/getNews',
  async (
    params: { page?: number; limit?: number; filters?: NewsFilters },
    { rejectWithValue }
  ) => {
    try {
      const { page = 1, limit = 10, filters } = params;
      const response = await getNewsApi(page, limit, filters);
      return {
        data: response.data,
        count: response.count,
        page,
        limit,
      };
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener noticias',
      });
    }
  }
);

/**
 * Obtener noticias publicadas (público)
 */
export const getPublishedNewsAsync = createAsyncThunk(
  'news/getPublishedNews',
  async (
    params: { page?: number; limit?: number; category?: string },
    { rejectWithValue }
  ) => {
    try {
      const { page = 1, limit = 10, category } = params;
      const response = await getPublishedNewsApi(page, limit, category);
      return {
        data: response.data,
        count: response.count,
        page,
        limit,
      };
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener noticias publicadas',
      });
    }
  }
);

/**
 * Obtener noticias destacadas
 */
export const getFeaturedNewsAsync = createAsyncThunk(
  'news/getFeaturedNews',
  async (limit: number = 4, { rejectWithValue }) => {
    try {
      const data = await getFeaturedNewsApi(limit);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener noticias destacadas',
      });
    }
  }
);

/**
 * Obtener noticia por ID
 */
export const getNewsByIdAsync = createAsyncThunk(
  'news/getNewsById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await getNewsByIdApi(id);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al obtener noticia',
      });
    }
  }
);

/**
 * Obtener noticia por slug
 */
export const getNewsBySlugAsync = createAsyncThunk(
  'news/getNewsBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const data = await getNewsBySlugApi(slug);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Noticia no encontrada',
      });
    }
  }
);

/**
 * Crear nueva noticia
 */
export const createNewsAsync = createAsyncThunk(
  'news/createNews',
  async (newsData: NewsFormData, { rejectWithValue }) => {
    try {
      const data = await createNewsApi(newsData);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al crear noticia',
      });
    }
  }
);

/**
 * Actualizar noticia
 */
export const updateNewsAsync = createAsyncThunk(
  'news/updateNews',
  async (
    params: { id: string; data: Partial<NewsFormData> },
    { rejectWithValue }
  ) => {
    try {
      const data = await updateNewsApi(params.id, params.data);
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al actualizar noticia',
      });
    }
  }
);

/**
 * Eliminar noticia
 */
export const deleteNewsAsync = createAsyncThunk(
  'news/deleteNews',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteNewsApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al eliminar noticia',
      });
    }
  }
);

/**
 * Crear attachment de noticia
 */
export const createNewsAttachmentAsync = createAsyncThunk(
  'news/createNewsAttachment',
  async (
    params: {
      newsId: string;
      attachmentData: {
        file_name: string;
        file_url: string;
        file_type?: string;
        file_size?: number;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await createNewsAttachmentApi(
        params.newsId,
        params.attachmentData
      );
      return data;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al crear adjunto',
      });
    }
  }
);

/**
 * Eliminar attachment de noticia
 */
export const deleteNewsAttachmentAsync = createAsyncThunk(
  'news/deleteNewsAttachment',
  async (attachmentId: string, { rejectWithValue }) => {
    try {
      await deleteNewsAttachmentApi(attachmentId);
      return attachmentId;
    } catch (error: any) {
      return rejectWithValue({
        error: error?.message || 'Error al eliminar adjunto',
      });
    }
  }
);
