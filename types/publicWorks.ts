import { Status } from './global';

export type PublicWork = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  is_active: boolean;
  order_position?: number;
  created_at: string;
  updated_at: string;
};

export type PublicWorkFormData = {
  title: string;
  description: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  is_active: boolean;
  order_position?: number;
};

export type PublicWorksSlice = {
  publicWorks: PublicWork[];
  currentPublicWork: PublicWork | null;
  lastFetched: Record<string, number>;
  status: {
    [key: string]: Status;
  };
};