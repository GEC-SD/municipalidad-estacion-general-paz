import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './initialState';
import extraReducersNews from './extraReducers';
import { NewsFilters } from '@/types';

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    /**
     * Establecer filtros de búsqueda
     */
    setNewsFilters: (state, action: PayloadAction<NewsFilters>) => {
      state.filters = action.payload;
    },
    /**
     * Limpiar filtros
     */
    clearNewsFilters: (state) => {
      state.filters = {};
    },
    /**
     * Establecer noticia actual
     */
    setCurrentNews: (state, action) => {
      state.currentNews = action.payload;
    },
    /**
     * Limpiar noticia actual
     */
    clearCurrentNews: (state) => {
      state.currentNews = null;
    },
    /**
     * Resetear estado de news
     */
    resetNewsState: (state) => {
      state.newsList = [];
      state.featuredNews = [];
      state.currentNews = null;
      state.pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };
      state.filters = {};
      state.lastFetched = {};
      state.status = {};
    },
    /**
     * Limpiar el estado de un thunk específico
     */
    clearNewsStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && state.status[action.payload]) {
        delete state.status[action.payload];
      } else {
        state.status = {};
      }
    },
  },
  extraReducers(builder) {
    extraReducersNews(builder);
  },
});

export const {
  setNewsFilters,
  clearNewsFilters,
  setCurrentNews,
  clearCurrentNews,
  resetNewsState,
  clearNewsStatus,
} = newsSlice.actions;

export default newsSlice.reducer;

// Re-export thunks
export {
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
