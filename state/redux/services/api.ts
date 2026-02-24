import slugify from 'slugify';
import { supabase } from '@/state/supabase/config';
import { ServiceFormData, ServiceCategory, AreaResena } from '@/types';

/**
 * Obtener todos los servicios
 * GET /api/services
 */
export const getServicesApi = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Obtener servicios por categoría
 * GET /api/services/category/:category
 */
export const getServicesByCategoryApi = async (category: ServiceCategory) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('order_position', { ascending: true });

  if (error) throw error;
  return data || [];
};

/**
 * Obtener servicio por ID
 * GET /api/services/:id
 */
export const getServiceByIdApi = async (id: string) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obtener servicio por slug
 * GET /api/services/slug/:slug
 */
export const getServiceBySlugApi = async (slug: string) => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Crear nuevo servicio
 * POST /api/services
 */
export const createServiceApi = async (serviceData: ServiceFormData) => {
  const slug = slugify(serviceData.title, { lower: true, strict: true });
  const { data, error } = await supabase
    .from('services')
    .insert([{ ...serviceData, slug }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Actualizar servicio
 * PUT /api/services/:id
 */
export const updateServiceApi = async (
  id: string,
  serviceData: Partial<ServiceFormData>
) => {
  const updateData = serviceData.title
    ? { ...serviceData, slug: slugify(serviceData.title, { lower: true, strict: true }) }
    : serviceData;
  const { data, error } = await supabase
    .from('services')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Eliminar servicio
 * DELETE /api/services/:id
 */
export const deleteServiceApi = async (id: string) => {
  const { error } = await supabase.from('services').delete().eq('id', id);

  if (error) throw error;
  return true;
};

/**
 * Obtener reseña de un area
 */
export const getAreaResenaApi = async (area: ServiceCategory): Promise<AreaResena | null> => {
  const { data, error } = await supabase
    .from('area_resenas')
    .select('*')
    .eq('area', area)
    .maybeSingle();

  if (error) throw error;
  return data;
};

/**
 * Crear o actualizar reseña de un area (upsert)
 */
export const upsertAreaResenaApi = async (
  area: ServiceCategory,
  content: string
): Promise<AreaResena> => {
  const { data, error } = await supabase
    .from('area_resenas')
    .upsert(
      { area, content, updated_at: new Date().toISOString() },
      { onConflict: 'area' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};
