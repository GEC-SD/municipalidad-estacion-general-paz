import { supabase } from '@/state/supabase/config';
import { AuthorityFormData, AuthorityCategory } from '@/types';

/**
 * Obtener todas las autoridades
 * GET /api/authorities
 */
export const getAuthoritiesApi = async () => {
  const { data, error } = await supabase
    .from('authorities')
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Obtener autoridades por categoría
 * GET /api/authorities/category/:category
 */
export const getAuthoritiesByCategoryApi = async (
  category: AuthorityCategory
) => {
  const { data, error } = await supabase
    .from('authorities')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('order_position', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Obtener autoridad por ID
 * GET /api/authorities/:id
 */
export const getAuthorityByIdApi = async (id: string) => {
  const { data, error } = await supabase
    .from('authorities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Crear nueva autoridad
 * POST /api/authorities
 */
export const createAuthorityApi = async (authorityData: AuthorityFormData) => {
  const { data, error } = await supabase
    .from('authorities')
    .insert([authorityData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Actualizar autoridad
 * PUT /api/authorities/:id
 */
export const updateAuthorityApi = async (
  id: string,
  authorityData: Partial<AuthorityFormData>
) => {
  const { data, error } = await supabase
    .from('authorities')
    .update(authorityData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Eliminar autoridad
 * DELETE /api/authorities/:id
 */
export const deleteAuthorityApi = async (id: string) => {
  const { error } = await supabase.from('authorities').delete().eq('id', id);

  if (error) throw error;
  return true;
};
