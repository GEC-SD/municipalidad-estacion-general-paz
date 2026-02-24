import { Status } from './global';

export type ServiceCategory = 'salud' | 'cultura' | 'obras' | 'educacion';

export type ServiceContactInfo = {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ServiceCategory;
  icon?: string;
  image_url?: string;
  contact_info?: ServiceContactInfo;
  requirements?: string[];
  is_active: boolean;
  order_position?: number;
  created_at: string;
  updated_at: string;
};

export type ServiceFormData = {
  title: string;
  description: string;
  category: ServiceCategory;
  icon?: string;
  image_url?: string;
  contact_info?: ServiceContactInfo;
  requirements?: string[];
  is_active: boolean;
  order_position?: number;
};

export type AreaResena = {
  id: string;
  area: ServiceCategory;
  content: string;
  created_at: string;
  updated_at: string;
};

export type ServicesSlice = {
  services: Service[];
  servicesByCategory: {
    salud: Service[];
    cultura: Service[];
    obras: Service[];
    educacion: Service[];
  };
  resenas: Record<ServiceCategory, AreaResena | null>;
  currentService: Service | null;
  lastFetched: Record<string, number>;
  status: {
    [key: string]: Status;
  };
};
