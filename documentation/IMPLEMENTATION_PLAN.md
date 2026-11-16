# Plan de actualización

## Requerimientos validados

1. Enlazar el pago de tasas con `https://municipalidad.com/egpa/home/menu`.
2. Destacar en el inicio la noticia “Atención al Vecino - Déjanos tu consulta”, usando su imagen publicada y permitiendo ocultar el aviso.
3. Incorporar “Presupuestos y Balances” con título, tipo (`presupuesto` o `balance`) y uno o varios PDF por publicación.
4. Mostrar los PDF dentro del visor existente, sin ofrecer una acción de descarga en la interfaz pública.
5. Ordenar noticias por `published_at` y usar `created_at` como desempate/fallback, sin modificar registros históricos.
6. Desarrollar y probar contra Supabase local y aplicar en producción sólo las migraciones funcionales aprobadas, sin sincronizar datos de prueba.

## Plan ejecutado

- [x] Auditar esquema, políticas RLS, buckets y datos mediante MCP Supabase read-only.
- [x] Configurar MCP read-only para producción y MCP para el stack local.
- [x] Levantar Supabase CLI 3.1.0 con Docker en puertos aislados.
- [x] Crear baseline local reproducible e importar las tablas funcionales, incluidos borradores e inactivos mediante MCP read-only.
- [x] Crear migraciones aditivas para documentos financieros y fecha de publicación futura.
- [x] Implementar CTA de pago, aviso flotante, pestaña pública y carga múltiple desde administración.
- [x] Corregir la consulta de orden de noticias.
- [x] Validar reset local, conteos, lint focalizado, build y recorridos públicos con Playwright.

## Antes de producción

- [x] Crear un usuario administrador exclusivamente local y probar carga/edición de PDF de prueba.
- [x] Validar en local la carga, edición, eliminación y visualización de documentos financieros.
- [ ] Si se necesita clonar también Auth y los binarios privados de Storage, obtener acceso temporal específico de sólo lectura; esos recursos no forman parte de la réplica actual.
- [x] Aprobar el pase funcional para preparar producción.
- [x] Revisar y aplicar en producción únicamente las migraciones `...001` y `...002`. El baseline `...000` no fue aplicado.

## Estado de producción — 16 de noviembre de 2026

- Migración remota `create_financial_documents` aplicada.
- Migración remota `set_news_publish_timestamp` aplicada.
- La tabla `financial_documents` quedó vacía y el bucket `financial-documents` no contiene objetos.
- No se copiaron los PDF ni los registros creados durante las pruebas locales.
- Los conteos existentes se mantuvieron en 77 noticias y 486 objetos de Storage después de las migraciones.
