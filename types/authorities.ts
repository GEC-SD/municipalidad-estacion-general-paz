import { Status } from './global';

export type AuthorityCategory = 'intendente' | 'gabinete' | 'concejo';

export type Authority = {
  id: string;
  full_name: string;
  position: string;
  department?: string;
  bio?: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  order_position?: number;
  category: AuthorityCategory;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AuthorityFormData = {
  full_name: string;
  position: string;
  department?: string;
  bio?: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  order_position?: number;
  category: AuthorityCategory;
  is_active: boolean;
};

export type AuthoritiesSlice = {
  authorities: Authority[];
  currentAuthority: Authority | null;
  intendente: Authority | null;
  gabinete: Authority[];
  concejo: Authority[];
  lastFetched: Record<string, number>;
  status: {
    [key: string]: Status;
  };
};
