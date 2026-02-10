import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

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

// Crear cliente de Supabase con @supabase/ssr
// Esto almacena la sesión en cookies (accesible desde middleware)
// además de localStorage (accesible desde el cliente)
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : createBrowserClient('https://placeholder.supabase.co', 'placeholder-key');

// Exportar flag para verificar si Supabase está configurado
export const isSupabaseReady = isSupabaseConfigured;
