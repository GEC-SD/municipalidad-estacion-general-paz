import { Status } from './global';

export type NewsStatus = 'draft' | 'published' | 'archived';

export type NewsCategory =
  | 'institucional'
  | 'obras'
  | 'cultura'
  | 'deporte'
  | 'salud'
  | 'educacion'
  | 'social'
  | 'medio-ambiente'
  | 'seguridad'
  | 'recoleccion-residuos'
  | 'servicio-agua'
  | 'inmobiliario'
  | 'registro-civil'
  | 'otros';

export type News = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  image_urls?: string[];
  social_url?: string;
  category?: NewsCategory;
  is_featured: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  status: NewsStatus;
  attachments?: NewsAttachment[];
};

export type NewsAttachment = {
  id: string;
  news_id: string;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  created_at: string;
};

export type NewsFormData = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  image_urls?: string[];
  social_url?: string;
  category?: NewsCategory;
  is_featured: boolean;
  published_at?: string;
  status: NewsStatus;
};

export type NewsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type NewsFilters = {
  category?: NewsCategory;
  search?: string;
  status?: NewsStatus;
};

export type NewsSlice = {
  newsList: News[];
  featuredNews: News[];
  currentNews: News | null;
  pagination: NewsPagination;
  filters: NewsFilters;
  lastFetched: Record<string, number>;
  status: {
    [key: string]: Status;
  };
};
