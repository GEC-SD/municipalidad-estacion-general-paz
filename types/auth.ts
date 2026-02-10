import { Status } from './global';
import { Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'editor';

export type User = {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthSlice = {
  user: User | null;
  isAuthenticated: boolean;
  session: Session | null;
  status: {
    [key: string]: Status;
  };
};
