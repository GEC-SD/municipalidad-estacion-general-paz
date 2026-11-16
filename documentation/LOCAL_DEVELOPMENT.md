# Desarrollo local con Supabase

Este entorno está diseñado para desarrollar sin escribir en la única base de producción.

## Servicios locales

- API: `http://127.0.0.1:57321`
- PostgreSQL: `127.0.0.1:57322`
- Studio: `http://127.0.0.1:57323`
- MCP local: `http://127.0.0.1:57321/mcp`

Los puertos son deliberadamente distintos de otros proyectos Docker existentes.

## Flujo de trabajo

```powershell
npx supabase start
npx supabase db reset
powershell -NoProfile -ExecutionPolicy Bypass -File supabase/sync-public-data.ps1
npm run dev:local
```

`dev:local` obtiene las credenciales efímeras del stack local y las entrega al proceso de Next.js. No modifica `.env.local` ni imprime claves.

Tanto `npm run dev` como `npm run dev:local` usan las credenciales del stack Docker y fuerzan Webpack. En este proyecto sobre la unidad `E:`, Turbopack 16.1.x puede perder la resolución del paquete `next`, entrar en panic y provocar recargas continuas del navegador.

## Migraciones

- `202611150000_local_production_baseline.sql`: bootstrap exclusivo para reconstrucción local. **No aplicar en producción**.
- `202611150001_create_financial_documents.sql`: migración aditiva que crea la sección Presupuestos y Balances y su bucket.
- `202611150002_set_news_publish_timestamp.sql`: completa `published_at` únicamente en publicaciones futuras; no actualiza noticias existentes.

Las migraciones funcionales `...001` y `...002` fueron aplicadas en producción el 16 de noviembre de 2026. Nunca ejecutar `db push` remoto con el baseline incluido ni volver a aplicar manualmente las migraciones ya registradas.

## Datos de prueba

La réplica local actual contiene las tablas funcionales completas, incluidas 77 noticias y 15 autoridades. Los registros públicos se sincronizan mediante el script y los borradores/inactivos se incorporaron mediante consultas MCP de sólo lectura. No se copiaron usuarios de Auth, sesiones, secretos ni archivos privados; por eso las referencias `created_by` que dependían de Auth se guardaron como `null` en Docker. Las URLs públicas de Storage siguen siendo referencias de sólo lectura al contenido publicado.

`sync-public-data.ps1` usa únicamente la clave anónima para leer el origen y la service-role generada por Docker para escribir en local. No ejecuta operaciones remotas de escritura ni imprime credenciales.

Después de un `db reset`, el script restaura automáticamente sólo los registros visibles mediante la API pública. Para volver a incorporar borradores e inactivos se requiere nuevamente una lectura MCP autorizada; esos contenidos no se guardan en archivos del repositorio.

Para probar el panel local, crear un usuario en Supabase Studio y asignarle en `raw_user_meta_data` el rol `admin`. Esto afecta sólo al contenedor local.

## Regla de seguridad

La conexión MCP `supabase-production-readonly` definida en `.mcp.json` incluye `read_only=true`. Después del despliegue aprobado, el desarrollo cotidiano vuelve a ser exclusivamente local: no usar `apply_migration`, `db push --remote`, SQL DDL/DML remoto ni el service-role de producción sin una nueva autorización explícita.
