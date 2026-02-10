import { supabase } from '@/state/supabase/config';
import { EventFormData, EventFilters } from '@/types';

/**
 * Obtener todos los eventos con paginación y filtros
 */
export const getEventsApi = async (
  page: number = 1,
  limit: number = 10,
  filters?: EventFilters
) => {
  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .order('event_date', { ascending: true });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.search) {
    const search = filters.search.slice(0, 100).replace(/[%_]/g, '');
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%`
      );
    }
  }
  if (filters?.upcoming) {
    query = query.gte('event_date', new Date().toISOString().split('T')[0]);
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
 * Obtener eventos próximos (público)
 */
export const getUpcomingEventsApi = async (limit: number = 6) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .gte('event_date', new Date().toISOString().split('T')[0])
    .order('event_date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

/**
 * Obtener evento por ID
 */
export const getEventByIdApi = async (id: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obtener evento por slug (público)
 */
export const getEventBySlugApi = async (slug: string) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Crear nuevo evento
 */
export const createEventApi = async (eventData: EventFormData) => {
  const { data, error } = await supabase
    .from('events')
    .insert([eventData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Actualizar evento
 */
export const updateEventApi = async (id: string, eventData: Partial<EventFormData>) => {
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Eliminar evento
 */
export const deleteEventApi = async (id: string) => {
  const { error } = await supabase.from('events').delete().eq('id', id);

  if (error) throw error;
  return true;
};
