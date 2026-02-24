-- ============================================================================
-- SCHEMA DE BASE DE DATOS - MUNICIPALIDAD GENERAL PAZ
-- ============================================================================
-- Este script crea todas las tablas, índices, RLS y configuraciones necesarias
-- para el sitio web institucional de la Municipalidad de Estación General Paz
-- ============================================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLA: news (Novedades/Noticias)
-- ============================================================================
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  category VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);

-- Índices para news
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_is_featured ON news(is_featured);

-- ============================================================================
-- TABLA: news_attachments (Archivos adjuntos de noticias)
-- ============================================================================
CREATE TABLE news_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  news_id UUID REFERENCES news(id) ON DELETE CASCADE NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para news_attachments
CREATE INDEX idx_news_attachments_news_id ON news_attachments(news_id);

-- ============================================================================
-- TABLA: authorities (Autoridades municipales)
-- ============================================================================
CREATE TABLE authorities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  bio TEXT,
  photo_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  order_position INTEGER,
  category VARCHAR(100) NOT NULL CHECK (category IN ('intendente', 'gabinete', 'concejo', 'tribunal')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para authorities
CREATE INDEX idx_authorities_category ON authorities(category);
CREATE INDEX idx_authorities_order ON authorities(order_position);
CREATE INDEX idx_authorities_is_active ON authorities(is_active);

-- ============================================================================
-- TABLA: services (Servicios municipales)
-- ============================================================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL CHECK (category IN ('salud', 'cultura', 'obras', 'educacion')),
  icon VARCHAR(100),
  image_url TEXT,
  contact_info JSONB,
  requirements TEXT[],
  is_active BOOLEAN DEFAULT true,
  order_position INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para services
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_is_active ON services(is_active);

-- ============================================================================
-- TABLA: regulations (Normativa/Ordenanzas)
-- ============================================================================
CREATE TABLE regulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  regulation_number VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'ordenanza' CHECK (type IN ('ordenanza', 'decreto')),
  year INTEGER NOT NULL,
  description TEXT,
  pdf_url TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  published_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para regulations
CREATE INDEX idx_regulations_number ON regulations(regulation_number);
CREATE INDEX idx_regulations_year ON regulations(year DESC);
CREATE INDEX idx_regulations_type ON regulations(type);
CREATE INDEX idx_regulations_category ON regulations(category);
CREATE INDEX idx_regulations_published_date ON regulations(published_date DESC);

-- ============================================================================
-- TABLA: tramites (Trámites Municipales)
-- ============================================================================
CREATE TABLE tramites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content_type VARCHAR(10) NOT NULL DEFAULT 'pdf' CHECK (content_type IN ('pdf', 'text')),
  pdf_url TEXT,
  rich_content TEXT,
  requirements TEXT[],
  contact_info JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para tramites
CREATE INDEX idx_tramites_slug ON tramites(slug);
CREATE INDEX idx_tramites_is_active ON tramites(is_active);
CREATE INDEX idx_tramites_order_position ON tramites(order_position);

-- RLS para tramites
ALTER TABLE tramites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tramites visibles publicamente"
  ON tramites FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin puede gestionar tramites"
  ON tramites FOR ALL
  USING (auth.role() = 'authenticated');

-- Trigger para updated_at
CREATE TRIGGER update_tramites_updated_at
  BEFORE UPDATE ON tramites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: contact_info (Números útiles / Información de contacto)
-- ============================================================================
CREATE TABLE contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department VARCHAR(255) NOT NULL,
  description TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  hours TEXT,
  category VARCHAR(100) CHECK (category IN ('emergencia', 'administrativo', 'servicios')),
  order_position INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para contact_info
CREATE INDEX idx_contact_info_category ON contact_info(category);
CREATE INDEX idx_contact_info_order ON contact_info(order_position);
CREATE INDEX idx_contact_info_is_active ON contact_info(is_active);

-- ============================================================================
-- TABLA: site_settings (Configuraciones del sitio)
-- ============================================================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar configuraciones iniciales
INSERT INTO site_settings (key, value, description) VALUES
  ('historia', '{"content": "Historia de la ciudad por completar"}', 'Historia de la ciudad'),
  ('mision', '{"content": "Misión de la municipalidad por completar"}', 'Misión institucional'),
  ('vision', '{"content": "Visión de la municipalidad por completar"}', 'Visión institucional'),
  ('valores', '{"items": ["Transparencia", "Compromiso", "Servicio"]}', 'Valores institucionales');

-- ============================================================================
-- TABLA: public_works (Obras Públicas)
-- ============================================================================
CREATE TABLE public_works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  order_position INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para public_works
CREATE INDEX idx_public_works_slug ON public_works(slug);
CREATE INDEX idx_public_works_is_active ON public_works(is_active);
CREATE INDEX idx_public_works_order ON public_works(order_position);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - POLÍTICAS DE SEGURIDAD
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_works ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLÍTICAS PARA NEWS
-- ============================================================================

-- Lectura pública: solo noticias publicadas
CREATE POLICY "Lectura pública de noticias publicadas"
  ON news FOR SELECT
  USING (status = 'published');

-- Los usuarios autenticados pueden ver todas las noticias
CREATE POLICY "Usuarios autenticados ven todas las noticias"
  ON news FOR SELECT
  TO authenticated
  USING (true);

-- Solo usuarios autenticados pueden insertar
CREATE POLICY "Usuarios autenticados pueden crear noticias"
  ON news FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Solo usuarios autenticados pueden actualizar
CREATE POLICY "Usuarios autenticados pueden actualizar noticias"
  ON news FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Solo usuarios autenticados pueden eliminar
CREATE POLICY "Usuarios autenticados pueden eliminar noticias"
  ON news FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- POLÍTICAS PARA NEWS_ATTACHMENTS
-- ============================================================================

-- Lectura pública de attachments de noticias publicadas
CREATE POLICY "Lectura pública de attachments de noticias publicadas"
  ON news_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM news
      WHERE news.id = news_attachments.news_id
      AND news.status = 'published'
    )
  );

-- Usuarios autenticados ven todos los attachments
CREATE POLICY "Usuarios autenticados ven todos los attachments"
  ON news_attachments FOR SELECT
  TO authenticated
  USING (true);

-- Solo usuarios autenticados pueden insertar
CREATE POLICY "Usuarios autenticados pueden crear attachments"
  ON news_attachments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Solo usuarios autenticados pueden eliminar
CREATE POLICY "Usuarios autenticados pueden eliminar attachments"
  ON news_attachments FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- POLÍTICAS PARA AUTHORITIES
-- ============================================================================

-- Lectura pública de autoridades activas
CREATE POLICY "Lectura pública de autoridades activas"
  ON authorities FOR SELECT
  USING (is_active = true);

-- Usuarios autenticados ven todas las autoridades
CREATE POLICY "Usuarios autenticados ven todas las autoridades"
  ON authorities FOR SELECT
  TO authenticated
  USING (true);

-- Solo usuarios autenticados pueden insertar, actualizar y eliminar
CREATE POLICY "Usuarios autenticados pueden gestionar autoridades"
  ON authorities FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- POLÍTICAS PARA SERVICES
-- ============================================================================

-- Lectura pública de servicios activos
CREATE POLICY "Lectura pública de servicios activos"
  ON services FOR SELECT
  USING (is_active = true);

-- Usuarios autenticados ven todos los servicios
CREATE POLICY "Usuarios autenticados ven todos los servicios"
  ON services FOR SELECT
  TO authenticated
  USING (true);

-- Solo usuarios autenticados pueden gestionar servicios
CREATE POLICY "Usuarios autenticados pueden gestionar servicios"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- POLÍTICAS PARA REGULATIONS
-- ============================================================================

-- Lectura pública de todas las regulaciones
CREATE POLICY "Lectura pública de regulaciones"
  ON regulations FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden gestionar regulaciones
CREATE POLICY "Usuarios autenticados pueden gestionar regulaciones"
  ON regulations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- POLÍTICAS PARA CONTACT_INFO
-- ============================================================================

-- Lectura pública de contactos activos
CREATE POLICY "Lectura pública de contactos activos"
  ON contact_info FOR SELECT
  USING (is_active = true);

-- Usuarios autenticados ven todos los contactos
CREATE POLICY "Usuarios autenticados ven todos los contactos"
  ON contact_info FOR SELECT
  TO authenticated
  USING (true);

-- Solo usuarios autenticados pueden gestionar contactos
CREATE POLICY "Usuarios autenticados pueden gestionar contactos"
  ON contact_info FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- POLÍTICAS PARA PUBLIC_WORKS
-- ============================================================================

-- Lectura pública de obras activas
CREATE POLICY "Lectura pública de obras activas"
  ON public_works FOR SELECT
  USING (is_active = true);

-- Usuarios autenticados ven todas las obras
CREATE POLICY "Usuarios autenticados ven todas las obras"
  ON public_works FOR SELECT
  TO authenticated
  USING (true);

-- Solo usuarios autenticados pueden gestionar obras
CREATE POLICY "Usuarios autenticados pueden gestionar obras"
  ON public_works FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- POLÍTICAS PARA SITE_SETTINGS
-- ============================================================================

-- Lectura pública de configuraciones del sitio
CREATE POLICY "Lectura pública de configuraciones"
  ON site_settings FOR SELECT
  USING (true);

-- Solo usuarios autenticados pueden actualizar configuraciones
CREATE POLICY "Usuarios autenticados pueden actualizar configuraciones"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para todas las tablas que tienen updated_at
CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_authorities_updated_at
    BEFORE UPDATE ON authorities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regulations_updated_at
    BEFORE UPDATE ON regulations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_public_works_updated_at
    BEFORE UPDATE ON public_works
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DATOS DE PRUEBA (OPCIONAL - Comentar si no se desea)
-- ============================================================================

-- Datos de prueba para authorities (Intendente)
INSERT INTO authorities (full_name, position, department, bio, category, order_position, is_active) VALUES
  ('Dr. Juan Pérez', 'Intendente Municipal', 'Ejecutivo', 'Intendente de la Municipalidad de Estación General Paz, comprometido con el desarrollo de nuestra comunidad.', 'intendente', 1, true);

-- Datos reales de contacto
INSERT INTO contact_info (department, description, phone, category, order_position, is_active) VALUES
  ('Municipalidad - Mesa de Entrada', 'Atención al público', '3525312959', 'administrativo', 1, true),
  ('Ambulancia', 'Servicio de Ambulancia', '3525565152', 'emergencia', 1, true),
  ('Guardia Urbana', 'Guardia Urbana Municipal', '3525642505', 'emergencia', 2, true),
  ('Policía', 'Comisaría de Estación General Paz', '3525622509', 'emergencia', 3, true),
  ('Centro de Salud', 'Centro de Salud Municipal', '3525565156', 'emergencia', 4, true);

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
-- Ejecutar en el SQL Editor de Supabase para crear los buckets de storage

INSERT INTO storage.buckets (id, name, public) VALUES
  ('news-images', 'news-images', true),
  ('news-attachments', 'news-attachments', true),
  ('authority-photos', 'authority-photos', true),
  ('service-images', 'service-images', true),
  ('regulations-pdfs', 'regulations-pdfs', true),
  ('public-works-images', 'public-works-images', true),
  ('tramites-pdfs', 'tramites-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage: lectura pública para todos los buckets
CREATE POLICY "Lectura pública de archivos"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('news-images', 'news-attachments', 'authority-photos', 'service-images', 'regulations-pdfs', 'public-works-images', 'tramites-pdfs'));

-- Políticas de storage: usuarios autenticados pueden subir/eliminar
CREATE POLICY "Usuarios autenticados pueden subir archivos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id IN ('news-images', 'news-attachments', 'authority-photos', 'service-images', 'regulations-pdfs', 'public-works-images', 'tramites-pdfs'));

CREATE POLICY "Usuarios autenticados pueden actualizar archivos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id IN ('news-images', 'news-attachments', 'authority-photos', 'service-images', 'regulations-pdfs', 'public-works-images', 'tramites-pdfs'));

CREATE POLICY "Usuarios autenticados pueden eliminar archivos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id IN ('news-images', 'news-attachments', 'authority-photos', 'service-images', 'regulations-pdfs', 'public-works-images', 'tramites-pdfs'));

-- ============================================================================
-- TABLA: area_resenas (Reseñas de áreas)
-- ============================================================================
CREATE TABLE area_resenas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area VARCHAR(50) NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT area_resenas_area_check CHECK (area IN ('salud', 'cultura', 'obras', 'educacion'))
);

ALTER TABLE area_resenas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read area_resenas"
  ON area_resenas FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can manage area_resenas"
  ON area_resenas FOR ALL
  TO authenticated
  USING (true);

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
