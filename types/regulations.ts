import { Status } from './global';

export type RegulationCategory =
  | 'tributaria'
  | 'obras'
  | 'administrativa'
  | 'urbanismo'
  | 'ambiental'
  | 'transito'
  | 'habilitaciones'
  | 'otras';

export type Regulation = {
  id: string;
  title: string;
  regulation_number: string;
  year: number;
  description?: string;
  pdf_url: string;
  category?: RegulationCategory;
  tags?: string[];
  published_date?: string;
  created_at: string;
  updated_at: string;
};

export type RegulationFormData = {
  title: string;
  regulation_number: string;
  year: number;
  description?: string;
  pdf_url: string;
  category?: RegulationCategory;
  tags?: string[];
  published_date?: string;
};

export type RegulationPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type RegulationFilters = {
  year?: number;
  category?: RegulationCategory;
  search?: string;
};

export type RegulationsSlice = {
  regulations: Regulation[];
  currentRegulation: Regulation | null;
  pagination: RegulationPagination;
  filters: RegulationFilters;
  lastFetched: Record<string, number>;
  status: {
    [key: string]: Status;
  };
};
