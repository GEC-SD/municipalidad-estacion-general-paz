import { Status } from './global';

export type UploadedFile = {
  name: string;
  url: string;
  size: number;
  type: string;
};

export type AdminStats = {
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  totalServices: number;
  totalRegulations: number;
  totalAuthorities: number;
};

export type AdminActivity = {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'news' | 'service' | 'authority' | 'regulation';
  entity_id: string;
  entity_title: string;
  user_email: string;
  created_at: string;
};

export type UploadProgress = {
  loaded: number;
  total: number;
  percentage: number;
};

export type AdminSlice = {
  stats: AdminStats | null;
  uploadProgress: UploadProgress | null;
  recentActivity: AdminActivity[];
  status: {
    [key: string]: Status;
  };
};
