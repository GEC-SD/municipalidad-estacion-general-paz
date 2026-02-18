import { supabase } from '@/state/supabase/config';
import { PublicWorkFormData } from '@/types';

/**
 * Obtener todas las obras públicas activas
 */
export const getPublicWorksApi = async () => {
  const { data, error } = await supabase
    .from('public_works')
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Obtener todas las obras (incluyendo inactivas, para admin)
 */
export const getAllPublicWorksApi = async () => {
  const { data, error } = await supabase
    .from('public_works')
    .select('*')
    .order('order_position', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Obtener obra pública por ID
 */
export const getPublicWorkByIdApi = async (id: string) => {
  const { data, error } = await supabase
    .from('public_works')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Crear nueva obra pública
 */
export const createPublicWorkApi = async (workData: PublicWorkFormData) => {
  const slug = workData.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const { data, error } = await supabase
    .from('public_works')
    .insert([{ ...workData, slug }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Actualizar obra pública
 */
export const updatePublicWorkApi = async (
  id: string,
  workData: Partial<PublicWorkFormData>
) => {
  const updateData: Record<string, unknown> = { ...workData };

  if (workData.title) {
    updateData.slug = workData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  const { data, error } = await supabase
    .from('public_works')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Eliminar obra pública
 */
export const deletePublicWorkApi = async (id: string) => {
  const { error } = await supabase.from('public_works').delete().eq('id', id);

  if (error) throw error;
  return true;
};
