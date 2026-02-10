import { Status } from './global';

export type ContactCategory = 'emergencia' | 'administrativo' | 'servicios';

export type ContactInfo = {
  id: string;
  department: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  category: ContactCategory;
  order_position?: number;
  is_active: boolean;
  created_at: string;
};

export type ContactFormData = {
  department: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  category: ContactCategory;
  order_position?: number;
  is_active: boolean;
};

export type ContactSlice = {
  contacts: ContactInfo[];
  emergencyContacts: ContactInfo[];
  administrativeContacts: ContactInfo[];
  serviceContacts: ContactInfo[];
  lastFetched: Record<string, number>;
  status: {
    [key: string]: Status;
  };
};
