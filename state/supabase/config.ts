import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configurar desde variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificar si las credenciales están configuradas
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '⚠️ Supabase no está configurado. Crea un archivo .env.local con:\n' +
    'NEXT_PUBLIC_SUPABASE_URL=tu_url\n' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key'
  );
}

// Crear cliente de Supabase solo si está configurado
// Si no está configurado, crear un cliente dummy que no hará llamadas reales
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

// Exportar flag para verificar si Supabase está configurado
export const isSupabaseReady = isSupabaseConfigured;
