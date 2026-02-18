import { supabase } from '@/state/supabase/config';
import { TramiteFormData } from '@/types';

/**
 * Obtener trámites con paginación (admin)
 */
export const getTramitesApi = async (
  page: number = 1,
  limit: number = 10,
  search?: string
) => {
  let query = supabase
    .from('tramites')
    .select('*', { count: 'exact' })
    .order('order_position', { ascending: true })
    .order('created_at', { ascending: false });

  if (search) {
    const sanitized = search.slice(0, 100).replace(/[%_]/g, '');
    if (sanitized) {
      query = query.or(
        `title.ilike.%${sanitized}%,description.ilike.%${sanitized}%`
      );
    }
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data || [],
    count: count || 0,
  };
};

/**
 * Obtener todos los trámites activos (público)
 */
export const getActiveTramitesApi = async () => {
  const { data, error } = await supabase
    .from('tramites')
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getTramiteByIdApi = async (id: string) => {
  const { data, error } = await supabase
    .from('tramites')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createTramiteApi = async (tramiteData: TramiteFormData) => {
  const { data, error } = await supabase
    .from('tramites')
    .insert([tramiteData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTramiteApi = async (
  id: string,
  tramiteData: Partial<TramiteFormData>
) => {
  const { data, error } = await supabase
    .from('tramites')
    .update(tramiteData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTramiteApi = async (id: string) => {
  const { error } = await supabase.from('tramites').delete().eq('id', id);

  if (error) throw error;
  return true;
};
