import { supabase } from '@/state/supabase/config';
import { AdminStats } from '@/types';

/**
 * Obtener estadísticas del dashboard
 */
export const getAdminStatsApi = async (): Promise<AdminStats> => {
  // Obtener totales de cada tabla
  const [newsResult, servicesResult, regulationsResult, authoritiesResult] =
    await Promise.all([
      supabase.from('news').select('*', { count: 'exact', head: true }),
      supabase.from('services').select('*', { count: 'exact', head: true }),
      supabase.from('regulations').select('*', { count: 'exact', head: true }),
      supabase.from('authorities').select('*', { count: 'exact', head: true }),
    ]);

  // Obtener noticias publicadas y borradores
  const [publishedResult, draftResult] = await Promise.all([
    supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),
    supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft'),
  ]);

  return {
    totalNews: newsResult.count || 0,
    publishedNews: publishedResult.count || 0,
    draftNews: draftResult.count || 0,
    totalServices: servicesResult.count || 0,
    totalRegulations: regulationsResult.count || 0,
    totalAuthorities: authoritiesResult.count || 0,
  };
};
