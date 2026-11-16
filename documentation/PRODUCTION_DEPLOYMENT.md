# Despliegue de producción

## Supabase

El 16 de noviembre de 2026 se aplicaron mediante el MCP oficial las migraciones remotas:

- `create_financial_documents`
- `set_news_publish_timestamp`

La tabla y el bucket de Presupuestos y Balances quedaron vacíos. No se transfirieron documentos ni registros de prueba locales. El baseline `202611150000_local_production_baseline.sql` es exclusivo para Docker local y nunca debe enviarse con `supabase db push`.

## Vercel

Configurar o conservar estas variables para Production, Preview y Development según corresponda:

- `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase de producción.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: clave pública/anon del mismo proyecto.
- `CRON_SECRET`: secreto usado por `/api/cron/keep-alive`.
- `NEXT_PUBLIC_API_URL`: opcional; si no existe, la aplicación usa `/api` del mismo dominio.

No configurar en Vercel `LOCAL_ADMIN_EMAIL`, `LOCAL_ADMIN_PASSWORD` ni credenciales del stack Docker. Son exclusivamente locales y `.env.local` permanece ignorado por Git.

El proyecto declara Node.js 22 o superior. Vercel debe construir desde la rama `main` y ejecutar el comando `npm run build` (o el comando automático de Next.js).
