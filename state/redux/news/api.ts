import { supabase } from '@/state/supabase/config';
import { NewsFormData, NewsFilters } from '@/types';

/**
 * Obtener todas las noticias con paginación y filtros
 * GET /api/news
 */
export const getNewsApi = async (
  page: number = 1,
  limit: number = 10,
  filters?: NewsFilters
) => {
  let query = supabase
    .from('news')
    .select('*, attachments:news_attachments(*)', { count: 'exact' })
    .order('published_at', { ascending: false });

  // Aplicar filtros
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.search) {
    const search = filters.search.slice(0, 100).replace(/[%_]/g, '');
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,content.ilike.%${search}%`
      );
    }
  }

  // Aplicar paginación
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
 * Obtener noticias publicadas (para portal público)
 * GET /api/news/published
 */
export const getPublishedNewsApi = async (
  page: number = 1,
  limit: number = 10,
  category?: string
) => {
  let query = supabase
    .from('news')
    .select('*, attachments:news_attachments(*)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
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
 * Obtener noticias destacadas
 * GET /api/news/featured
 */
export const getFeaturedNewsApi = async (limit: number = 4) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

/**
 * Obtener noticia por ID
 * GET /api/news/:id
 */
export const getNewsByIdApi = async (id: string) => {
  const { data, error } = await supabase
    .from('news')
    .select('*, attachments:news_attachments(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Obtener noticia por slug (para portal público)
 * GET /api/news/slug/:slug
 */
export const getNewsBySlugApi = async (slug: string) => {
  const { data, error } = await supabase
    .from('news')
    .select('*, attachments:news_attachments(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data;
};

/**
 * Crear nueva noticia
 * POST /api/news
 */
export const createNewsApi = async (newsData: NewsFormData) => {
  const { data, error } = await supabase
    .from('news')
    .insert([newsData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Actualizar noticia
 * PUT /api/news/:id
 */
export const updateNewsApi = async (id: string, newsData: Partial<NewsFormData>) => {
  const { data, error } = await supabase
    .from('news')
    .update(newsData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Eliminar noticia
 * DELETE /api/news/:id
 */
export const deleteNewsApi = async (id: string) => {
  const { error } = await supabase.from('news').delete().eq('id', id);

  if (error) throw error;
  return true;
};

/**
 * Crear attachment de noticia
 * POST /api/news/:id/attachments
 */
export const createNewsAttachmentApi = async (
  newsId: string,
  attachmentData: {
    file_name: string;
    file_url: string;
    file_type?: string;
    file_size?: number;
  }
) => {
  const { data, error } = await supabase
    .from('news_attachments')
    .insert([{ news_id: newsId, ...attachmentData }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Eliminar attachment de noticia
 * DELETE /api/news/attachments/:id
 */
export const deleteNewsAttachmentApi = async (attachmentId: string) => {
  const { error } = await supabase
    .from('news_attachments')
    .delete()
    .eq('id', attachmentId);

  if (error) throw error;
  return true;
};
