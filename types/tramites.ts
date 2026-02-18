import { Status } from './global';

export type TramiteContentType = 'pdf' | 'text';

export type TramiteContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
};

export type Tramite = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content_type: TramiteContentType;
  pdf_url?: string;
  rich_content?: string;
  requirements?: string[];
  contact_info?: TramiteContactInfo;
  is_active: boolean;
  order_position?: number;
  created_at: string;
  updated_at: string;
};

export type TramiteFormData = {
  title: string;
  slug: string;
  description: string;
  content_type: TramiteContentType;
  pdf_url?: string;
  rich_content?: string;
  requirements?: string[];
  contact_info?: TramiteContactInfo;
  is_active: boolean;
  order_position?: number;
};

export type TramitePagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TramitesSlice = {
  tramites: Tramite[];
  currentTramite: Tramite | null;
  pagination: TramitePagination;
  lastFetched: Record<string, number>;
  status: {
    [key: string]: Status;
  };
};
