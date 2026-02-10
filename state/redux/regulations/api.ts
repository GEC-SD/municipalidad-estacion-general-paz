import { supabase } from '@/state/supabase/config';
import { RegulationFormData, RegulationFilters } from '@/types';

/**
 * Obtener normativas con paginación y filtros
 */
export const getRegulationsApi = async (
  page: number = 1,
  limit: number = 10,
  filters?: RegulationFilters
) => {
  let query = supabase
    .from('regulations')
    .select('*', { count: 'exact' })
    .order('year', { ascending: false })
    .order('regulation_number', { ascending: false });

  if (filters?.year) {
    query = query.eq('year', filters.year);
  }
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.search) {
    const search = filters.search.slice(0, 100).replace(/[%_]/g, '');
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,regulation_number.ilike.%${search}%`
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

export const getRegulationByIdApi = async (id: string) => {
  const { data, error } = await supabase
    .from('regulations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createRegulationApi = async (regulationData: RegulationFormData) => {
  const { data, error } = await supabase
    .from('regulations')
    .insert([regulationData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateRegulationApi = async (
  id: string,
  regulationData: Partial<RegulationFormData>
) => {
  const { data, error } = await supabase
    .from('regulations')
    .update(regulationData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteRegulationApi = async (id: string) => {
  const { error } = await supabase.from('regulations').delete().eq('id', id);

  if (error) throw error;
  return true;
};
