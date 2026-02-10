import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { NewsSlice } from '@/types';
import {
  getNewsAsync,
  getPublishedNewsAsync,
  getFeaturedNewsAsync,
  getNewsByIdAsync,
  getNewsBySlugAsync,
  createNewsAsync,
  updateNewsAsync,
  deleteNewsAsync,
  createNewsAttachmentAsync,
  deleteNewsAttachmentAsync,
} from './thunk';

const extraReducersNews = (builder: ActionReducerMapBuilder<NewsSlice>) => {
  // ============================================================================
  // GET NEWS (Admin - con filtros y paginación)
  // ============================================================================
  builder
    .addCase(getNewsAsync.pending, (state) => {
      state.status.getNewsAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getNewsAsync.fulfilled, (state, action) => {
      state.newsList = action.payload.data;
      state.pagination = {
        page: action.payload.page,
        limit: action.payload.limit,
        total: action.payload.count,
        totalPages: Math.ceil(action.payload.count / action.payload.limit),
      };
      state.status.getNewsAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getNewsAsync.rejected, (state, action: any) => {
      state.status.getNewsAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener noticias',
        loading: false,
      };
    });

  // ============================================================================
  // GET PUBLISHED NEWS (Público)
  // ============================================================================
  builder
    .addCase(getPublishedNewsAsync.pending, (state) => {
      state.status.getPublishedNewsAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getPublishedNewsAsync.fulfilled, (state, action) => {
      state.newsList = action.payload.data;
      state.pagination = {
        page: action.payload.page,
        limit: action.payload.limit,
        total: action.payload.count,
        totalPages: Math.ceil(action.payload.count / action.payload.limit),
      };
      state.lastFetched['publishedNews'] = Date.now();
      state.status.getPublishedNewsAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getPublishedNewsAsync.rejected, (state, action: any) => {
      state.status.getPublishedNewsAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener noticias publicadas',
        loading: false,
      };
    });

  // ============================================================================
  // GET FEATURED NEWS
  // ============================================================================
  builder
    .addCase(getFeaturedNewsAsync.pending, (state) => {
      state.status.getFeaturedNewsAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getFeaturedNewsAsync.fulfilled, (state, action) => {
      state.featuredNews = action.payload;
      state.lastFetched['featuredNews'] = Date.now();
      state.status.getFeaturedNewsAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getFeaturedNewsAsync.rejected, (state, action: any) => {
      state.status.getFeaturedNewsAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener noticias destacadas',
        loading: false,
      };
    });

  // ============================================================================
  // GET NEWS BY ID
  // ============================================================================
  builder
    .addCase(getNewsByIdAsync.pending, (state) => {
      state.status.getNewsByIdAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getNewsByIdAsync.fulfilled, (state, action) => {
      state.currentNews = action.payload;
      state.status.getNewsByIdAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getNewsByIdAsync.rejected, (state, action: any) => {
      state.currentNews = null;
      state.status.getNewsByIdAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al obtener noticia',
        loading: false,
      };
    });

  // ============================================================================
  // GET NEWS BY SLUG
  // ============================================================================
  builder
    .addCase(getNewsBySlugAsync.pending, (state) => {
      state.status.getNewsBySlugAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(getNewsBySlugAsync.fulfilled, (state, action) => {
      state.currentNews = action.payload;
      state.status.getNewsBySlugAsync = {
        response: 'fulfilled',
        message: '',
        loading: false,
      };
    })
    .addCase(getNewsBySlugAsync.rejected, (state, action: any) => {
      state.currentNews = null;
      state.status.getNewsBySlugAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Noticia no encontrada',
        loading: false,
      };
    });

  // ============================================================================
  // CREATE NEWS
  // ============================================================================
  builder
    .addCase(createNewsAsync.pending, (state) => {
      state.status.createNewsAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(createNewsAsync.fulfilled, (state, action) => {
      state.newsList.unshift(action.payload);
      state.lastFetched = {};
      state.status.createNewsAsync = {
        response: 'fulfilled',
        message: 'Noticia creada correctamente',
        loading: false,
      };
    })
    .addCase(createNewsAsync.rejected, (state, action: any) => {
      state.status.createNewsAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al crear noticia',
        loading: false,
      };
    });

  // ============================================================================
  // UPDATE NEWS
  // ============================================================================
  builder
    .addCase(updateNewsAsync.pending, (state) => {
      state.status.updateNewsAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(updateNewsAsync.fulfilled, (state, action) => {
      const index = state.newsList.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        state.newsList[index] = action.payload;
      }
      if (state.currentNews?.id === action.payload.id) {
        state.currentNews = action.payload;
      }
      state.lastFetched = {};
      state.status.updateNewsAsync = {
        response: 'fulfilled',
        message: 'Noticia actualizada correctamente',
        loading: false,
      };
    })
    .addCase(updateNewsAsync.rejected, (state, action: any) => {
      state.status.updateNewsAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al actualizar noticia',
        loading: false,
      };
    });

  // ============================================================================
  // DELETE NEWS
  // ============================================================================
  builder
    .addCase(deleteNewsAsync.pending, (state) => {
      state.status.deleteNewsAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(deleteNewsAsync.fulfilled, (state, action) => {
      state.newsList = state.newsList.filter((n) => n.id !== action.payload);
      if (state.currentNews?.id === action.payload) {
        state.currentNews = null;
      }
      state.lastFetched = {};
      state.status.deleteNewsAsync = {
        response: 'fulfilled',
        message: 'Noticia eliminada correctamente',
        loading: false,
      };
    })
    .addCase(deleteNewsAsync.rejected, (state, action: any) => {
      state.status.deleteNewsAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al eliminar noticia',
        loading: false,
      };
    });

  // ============================================================================
  // CREATE NEWS ATTACHMENT
  // ============================================================================
  builder
    .addCase(createNewsAttachmentAsync.pending, (state) => {
      state.status.createNewsAttachmentAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(createNewsAttachmentAsync.fulfilled, (state, action) => {
      if (state.currentNews) {
        state.currentNews.attachments = [
          ...(state.currentNews.attachments || []),
          action.payload,
        ];
      }
      state.lastFetched = {};
      state.status.createNewsAttachmentAsync = {
        response: 'fulfilled',
        message: 'Adjunto agregado correctamente',
        loading: false,
      };
    })
    .addCase(createNewsAttachmentAsync.rejected, (state, action: any) => {
      state.status.createNewsAttachmentAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al agregar adjunto',
        loading: false,
      };
    });

  // ============================================================================
  // DELETE NEWS ATTACHMENT
  // ============================================================================
  builder
    .addCase(deleteNewsAttachmentAsync.pending, (state) => {
      state.status.deleteNewsAttachmentAsync = {
        response: 'pending',
        message: '',
        loading: true,
      };
    })
    .addCase(deleteNewsAttachmentAsync.fulfilled, (state, action) => {
      if (state.currentNews?.attachments) {
        state.currentNews.attachments = state.currentNews.attachments.filter(
          (a) => a.id !== action.payload
        );
      }
      state.lastFetched = {};
      state.status.deleteNewsAttachmentAsync = {
        response: 'fulfilled',
        message: 'Adjunto eliminado correctamente',
        loading: false,
      };
    })
    .addCase(deleteNewsAttachmentAsync.rejected, (state, action: any) => {
      state.status.deleteNewsAttachmentAsync = {
        response: 'rejected',
        message: action.payload?.error || 'Error al eliminar adjunto',
        loading: false,
      };
    });
};

export default extraReducersNews;
