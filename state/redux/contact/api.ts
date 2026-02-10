import { supabase } from '@/state/supabase/config';
import { ContactFormData, ContactCategory } from '@/types';

export const getContactsApi = async () => {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getContactsByCategoryApi = async (category: ContactCategory) => {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('order_position', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getContactByIdApi = async (id: string) => {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createContactApi = async (contactData: ContactFormData) => {
  const { data, error } = await supabase
    .from('contact_info')
    .insert([contactData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateContactApi = async (
  id: string,
  contactData: Partial<ContactFormData>
) => {
  const { data, error } = await supabase
    .from('contact_info')
    .update(contactData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteContactApi = async (id: string) => {
  const { error } = await supabase.from('contact_info').delete().eq('id', id);

  if (error) throw error;
  return true;
};
