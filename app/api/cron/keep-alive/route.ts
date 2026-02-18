import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const cronSecret = process.env.CRON_SECRET;

/**
 * Comparación segura contra timing attacks
 */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  // SEGURIDAD: Siempre requerir token de autorización
  if (!cronSecret) {
    return NextResponse.json({ error: 'Endpoint no configurado' }, { status: 503 });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !safeCompare(authHeader, `Bearer ${cronSecret}`)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { error: 'Servicio no disponible' },
      { status: 503 }
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { count, error } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      records: count,
    });
  } catch {
    // SEGURIDAD: No exponer detalles del error
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  }
}
