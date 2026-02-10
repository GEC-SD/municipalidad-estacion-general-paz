import { supabase } from '@/state/supabase/config';
import { ServiceFormData, ServiceCategory } from '@/types';

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
  const { data, error } = await supabase
    .from('services')
    .insert([serviceData])
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
  const { data, error } = await supabase
    .from('services')
    .update(serviceData)
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
