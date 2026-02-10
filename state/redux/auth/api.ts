import { supabase } from '@/state/supabase/config';
import { LoginCredentials } from '@/types';

/**
 * Login con email y contraseña
 * POST /auth/login
 */
export const loginApi = async (credentials: LoginCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) throw error;
  return data;
};

/**
 * Logout - Cierra la sesión actual
 * POST /auth/logout
 */
export const logoutApi = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
};

/**
 * Verificar sesión activa
 * GET /auth/session
 */
export const checkSessionApi = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data;
};

/**
 * Obtener usuario actual
 * GET /auth/user
 */
export const getCurrentUserApi = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data;
};
