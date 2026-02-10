# Configuraci&oacute;n de Storage en Supabase (Plan Gratuito)

> **IMPORTANTE - L&iacute;mites del Plan Gratuito:**
> - **1 GB** de almacenamiento total de archivos
> - **500 MB** de base de datos
> - **50 MB** de tama&ntilde;o m&aacute;ximo por archivo
> - **2 GB** de egress de storage por mes
> - Los proyectos se **pausan autom&aacute;ticamente despu&eacute;s de 7 d&iacute;as de inactividad**
>
> Con estos l&iacute;mites, es cr&iacute;tico optimizar el tama&ntilde;o de los archivos subidos.

---

## 1. Crear Buckets

En el panel de Supabase, ve a **Storage** y crea los siguientes buckets:

| Bucket | P&uacute;blico | Tama&ntilde;o m&aacute;x. | Tipos permitidos | Uso estimado |
|---|---|---|---|---|
| `news-images` | S&iacute; | 2 MB | JPEG, PNG, WebP | ~200 MB |
| `news-attachments` | S&iacute; | 10 MB | PDF, DOC, DOCX | ~200 MB |
| `authority-photos` | S&iacute; | 1 MB | JPEG, PNG, WebP | ~50 MB |
| `service-images` | S&iacute; | 2 MB | JPEG, PNG, WebP | ~100 MB |
| `regulations-pdfs` | S&iacute; | 5 MB | PDF | ~300 MB |

**Total estimado: ~850 MB** (deja ~150 MB de margen sobre el l&iacute;mite de 1 GB)

### Configuraci&oacute;n por bucket:

Al crear cada bucket, en la configuraci&oacute;n avanzada:

1. **File size limit**: Configurar el l&iacute;mite indicado en la tabla
2. **Allowed MIME types**: Configurar los tipos indicados

#### Tipos MIME espec&iacute;ficos por bucket:

- **news-images**: `image/jpeg`, `image/png`, `image/webp`
- **news-attachments**: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **authority-photos**: `image/jpeg`, `image/png`, `image/webp`
- **service-images**: `image/jpeg`, `image/png`, `image/webp`
- **regulations-pdfs**: `application/pdf`

---

## 2. Configurar Pol&iacute;ticas de Storage (RLS)

Ejecutar las siguientes pol&iacute;ticas SQL en el **SQL Editor** de Supabase.

### Pol&iacute;tica de lectura p&uacute;blica (todos los buckets):

```sql
CREATE POLICY "Lectura publica de archivos"
ON storage.objects FOR SELECT
USING (
  bucket_id IN (
    'news-images',
    'news-attachments',
    'authority-photos',
    'service-images',
    'regulations-pdfs'
  )
);
```

### Pol&iacute;tica de upload (solo usuarios autenticados):

```sql
CREATE POLICY "Upload para usuarios autenticados"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id IN (
    'news-images',
    'news-attachments',
    'authority-photos',
    'service-images',
    'regulations-pdfs'
  )
);
```

### Pol&iacute;tica de update (solo usuarios autenticados):

```sql
CREATE POLICY "Update para usuarios autenticados"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id IN (
    'news-images',
    'news-attachments',
    'authority-photos',
    'service-images',
    'regulations-pdfs'
  )
);
```

### Pol&iacute;tica de delete (solo usuarios autenticados):

```sql
CREATE POLICY "Delete para usuarios autenticados"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id IN (
    'news-images',
    'news-attachments',
    'authority-photos',
    'service-images',
    'regulations-pdfs'
  )
);
```

---

## 3. Optimizaci&oacute;n de Im&aacute;genes (Cr&iacute;tico para Plan Gratuito)

Para aprovechar al m&aacute;ximo el 1 GB de storage:

### Recomendaciones antes de subir im&aacute;genes:

1. **Formato preferido: WebP** - Reduce entre 25-35% el tama&ntilde;o vs JPEG
2. **Resoluci&oacute;n m&aacute;xima recomendada:**
   - Im&aacute;genes de novedades: **1200x800px** m&aacute;ximo
   - Fotos de autoridades: **400x500px** m&aacute;ximo
   - Im&aacute;genes de servicios: **800x600px** m&aacute;ximo
3. **Calidad de compresi&oacute;n:** 80-85% (balance &oacute;ptimo calidad/tama&ntilde;o)
4. **Evitar subir archivos duplicados**

### Cache Control:

El hook `useFileUpload` ya configura `cacheControl: '3600'` (1 hora). Para archivos est&aacute;ticos que rara vez cambian (fotos de autoridades, logos), se recomienda aumentar a `86400` (24 horas) para reducir el egress.

---

## 4. Monitoreo de Uso

Para controlar el uso de storage en el plan gratuito:

1. Ve a **Settings** > **Usage** en el panel de Supabase
2. Revisa regularmente:
   - **Storage size**: No debe superar ~850 MB (dejar margen)
   - **Storage egress**: M&aacute;ximo 2 GB/mes
3. Si te acercas al l&iacute;mite:
   - Elimina archivos antiguos que ya no se usen
   - Reduce la resoluci&oacute;n de im&aacute;genes existentes
   - Comprime PDFs de normativa antes de subir

---

## 5. Verificar Configuraci&oacute;n

1. Ve a **Storage** > **Policies** en Supabase
2. Deber&iacute;as ver las 4 pol&iacute;ticas creadas (SELECT, INSERT, UPDATE, DELETE)
3. Sube un archivo de prueba desde el panel
4. Verifica que puedas acceder a la URL p&uacute;blica del archivo
5. Verifica que sin autenticaci&oacute;n NO se pueda subir ni eliminar

---

## 6. Obtener Credenciales

### Para configurar el proyecto Next.js:

1. Ve a **Settings** > **API** en Supabase
2. Copia los siguientes valores:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

3. Crea el archivo `.env.local` en la ra&iacute;z del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> **IMPORTANTE**: Nunca commitees el archivo `.env.local` al repositorio. Est&aacute; incluido en `.gitignore`.

---

## 7. Crear Usuario Administrador

Para acceder al panel de administraci&oacute;n:

1. Ve a **Authentication** > **Users**
2. Click en **Add user**
3. Completa:
   - **Email**: admin@municipalidadgeneralpaz.gob.ar (o el que prefieras)
   - **Password**: (contrase&ntilde;a segura, m&iacute;nimo 8 caracteres)
   - **Auto confirm user**: S&iacute;
4. Guarda las credenciales en un lugar seguro

---

## 8. Evitar Pausa del Proyecto (Cron Job Autom&aacute;tico)

El plan gratuito **pausa el proyecto tras 7 d&iacute;as sin actividad**. Para evitarlo, el proyecto incluye un endpoint de keep-alive que debe ser llamado peri&oacute;dicamente por un cron job externo gratuito.

### Endpoint incluido en el proyecto

```
GET /api/cron/keep-alive
```

Este endpoint hace una query liviana a Supabase (`SELECT count` sobre `site_settings`) para mantener el proyecto activo. Responde con:

```json
{ "ok": true, "timestamp": "2026-02-06T12:00:00.000Z", "records": 5 }
```

### Configurar variable de entorno (opcional pero recomendado)

Para proteger el endpoint con un token de autorizaci&oacute;n, agrega a `.env.local`:

```env
CRON_SECRET=tu-token-secreto-aqui
```

Si est&aacute; configurado, el cron deber&aacute; enviar el header `Authorization: Bearer tu-token-secreto-aqui`.

### Configurar cron-job.org (gratuito)

1. Ir a [https://cron-job.org](https://cron-job.org) y crear una cuenta gratuita
2. Click en **Create cronjob**
3. Configurar:

| Campo | Valor |
|---|---|
| **Title** | Supabase Keep-Alive |
| **URL** | `https://tu-dominio.vercel.app/api/cron/keep-alive` |
| **Schedule** | Every 3 days (o "Custom": `0 8 */3 * *`) |
| **Request method** | GET |
| **Request timeout** | 30 seconds |

4. Si configuraste `CRON_SECRET`, ir a **Advanced** > **Headers** y agregar:
   - **Header name**: `Authorization`
   - **Header value**: `Bearer tu-token-secreto-aqui`

5. Click en **Create** y listo

### Alternativas gratuitas a cron-job.org

| Servicio | URL | L&iacute;mite gratuito |
|---|---|---|
| cron-job.org | https://cron-job.org | Ilimitados cron jobs |
| Uptime Robot | https://uptimerobot.com | 50 monitores, cada 5 min |
| EasyCron | https://easycron.com | 1 cron job gratis |

> **Nota**: Si el sitio est&aacute; alojado en **Vercel**, tambi&eacute;n se puede usar [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs) configurando un archivo `vercel.json`:
>
> ```json
> {
>   "crons": [{
>     "path": "/api/cron/keep-alive",
>     "schedule": "0 8 */3 * *"
>   }]
> }
> ```
> El plan Hobby de Vercel incluye cron jobs gratuitos.

---

## 9. Tabla de Eventos (Agenda)

Ejecutar el siguiente SQL en el **SQL Editor** de Supabase para crear la tabla de eventos:

```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT,
  end_date DATE,
  location TEXT,
  category TEXT NOT NULL DEFAULT 'cultural',
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  organizer TEXT,
  contact_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_slug ON events(slug);

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura publica de eventos"
ON events FOR SELECT
USING (true);

CREATE POLICY "CRUD para usuarios autenticados"
ON events FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Trigger para updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

> **Nota**: Si la función `update_updated_at_column()` no existe, creala primero:
> ```sql
> CREATE OR REPLACE FUNCTION update_updated_at_column()
> RETURNS TRIGGER AS $$
> BEGIN
>   NEW.updated_at = NOW();
>   RETURN NEW;
> END;
> $$ LANGUAGE plpgsql;
> ```
