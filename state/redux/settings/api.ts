import { supabase } from '@/state/supabase/config';
import { MunicipalityInfo } from '@/types';

/**
 * Obtener configuración por clave
 */
export const getSettingApi = async (key: string) => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', key)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obtener todas las configuraciones
 */
export const getAllSettingsApi = async () => {
  const { data, error } = await supabase.from('site_settings').select('*');

  if (error) throw error;
  return data || [];
};

/**
 * Obtener información de la municipalidad
 */
export const getMunicipalityInfoApi = async (): Promise<MunicipalityInfo> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .in('key', ['historia', 'mision', 'vision', 'valores']);

  if (error) throw error;

  // Convertir array de settings a objeto MunicipalityInfo
  const info: MunicipalityInfo = {
    historia: '',
    mision: '',
    vision: '',
    valores: [],
  };

  data?.forEach((setting) => {
    if (setting.key in info) {
      info[setting.key as keyof MunicipalityInfo] = setting.value;
    }
  });

  return info;
};

/**
 * Actualizar configuración
 */
export const updateSettingApi = async (key: string, value: any) => {
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({ key, value })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Actualizar información de la municipalidad
 */
export const updateMunicipalityInfoApi = async (info: Partial<MunicipalityInfo>) => {
  const updates = Object.entries(info).map(([key, value]) => ({
    key,
    value,
  }));

  const { data, error } = await supabase
    .from('site_settings')
    .upsert(updates)
    .select();

  if (error) throw error;
  return data;
};
