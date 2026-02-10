-- ============================================================
-- Row Level Security (RLS) Policies
-- Municipalidad de Estacion General Paz
-- ============================================================
-- Run this script in the Supabase SQL Editor
-- IMPORTANT: Review and test each policy before applying to production
-- ============================================================

-- ============================================================
-- 1. ENABLE RLS ON ALL TABLES
-- ============================================================

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. HELPER FUNCTION: Check if current user is admin
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 3. DROP EXISTING POLICIES (idempotent re-run)
-- ============================================================

-- news
DROP POLICY IF EXISTS "news_public_read" ON news;
DROP POLICY IF EXISTS "news_admin_select" ON news;
DROP POLICY IF EXISTS "news_admin_insert" ON news;
DROP POLICY IF EXISTS "news_admin_update" ON news;
DROP POLICY IF EXISTS "news_admin_delete" ON news;

-- news_attachments
DROP POLICY IF EXISTS "attachments_public_read" ON news_attachments;
DROP POLICY IF EXISTS "attachments_admin_select" ON news_attachments;
DROP POLICY IF EXISTS "attachments_admin_insert" ON news_attachments;
DROP POLICY IF EXISTS "attachments_admin_delete" ON news_attachments;

-- authorities
DROP POLICY IF EXISTS "authorities_public_read" ON authorities;
DROP POLICY IF EXISTS "authorities_admin_select" ON authorities;
DROP POLICY IF EXISTS "authorities_admin_insert" ON authorities;
DROP POLICY IF EXISTS "authorities_admin_update" ON authorities;
DROP POLICY IF EXISTS "authorities_admin_delete" ON authorities;

-- services
DROP POLICY IF EXISTS "services_public_read" ON services;
DROP POLICY IF EXISTS "services_admin_select" ON services;
DROP POLICY IF EXISTS "services_admin_insert" ON services;
DROP POLICY IF EXISTS "services_admin_update" ON services;
DROP POLICY IF EXISTS "services_admin_delete" ON services;

-- contact_info
DROP POLICY IF EXISTS "contact_public_read" ON contact_info;
DROP POLICY IF EXISTS "contact_admin_select" ON contact_info;
DROP POLICY IF EXISTS "contact_admin_insert" ON contact_info;
DROP POLICY IF EXISTS "contact_admin_update" ON contact_info;
DROP POLICY IF EXISTS "contact_admin_delete" ON contact_info;

-- events
DROP POLICY IF EXISTS "events_public_read" ON events;
DROP POLICY IF EXISTS "events_admin_select" ON events;
DROP POLICY IF EXISTS "events_admin_insert" ON events;
DROP POLICY IF EXISTS "events_admin_update" ON events;
DROP POLICY IF EXISTS "events_admin_delete" ON events;

-- regulations
DROP POLICY IF EXISTS "regulations_public_read" ON regulations;
DROP POLICY IF EXISTS "regulations_admin_select" ON regulations;
DROP POLICY IF EXISTS "regulations_admin_insert" ON regulations;
DROP POLICY IF EXISTS "regulations_admin_update" ON regulations;
DROP POLICY IF EXISTS "regulations_admin_delete" ON regulations;

-- site_settings
DROP POLICY IF EXISTS "settings_public_read" ON site_settings;
DROP POLICY IF EXISTS "settings_admin_select" ON site_settings;
DROP POLICY IF EXISTS "settings_admin_insert" ON site_settings;
DROP POLICY IF EXISTS "settings_admin_update" ON site_settings;
DROP POLICY IF EXISTS "settings_admin_delete" ON site_settings;

-- ============================================================
-- 4. NEWS POLICIES
-- ============================================================

-- Public: only published news
CREATE POLICY "news_public_read" ON news
  FOR SELECT
  TO anon
  USING (status = 'published');

-- Admin: full read (includes draft, archived)
CREATE POLICY "news_admin_select" ON news
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: insert
CREATE POLICY "news_admin_insert" ON news
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin: update
CREATE POLICY "news_admin_update" ON news
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin: delete
CREATE POLICY "news_admin_delete" ON news
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 5. NEWS ATTACHMENTS POLICIES
-- ============================================================

-- Public: only attachments of published news
CREATE POLICY "attachments_public_read" ON news_attachments
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM news
      WHERE news.id = news_attachments.news_id
      AND news.status = 'published'
    )
  );

-- Admin: full read
CREATE POLICY "attachments_admin_select" ON news_attachments
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: insert
CREATE POLICY "attachments_admin_insert" ON news_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin: delete
CREATE POLICY "attachments_admin_delete" ON news_attachments
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 6. AUTHORITIES POLICIES
-- ============================================================

-- Public: only active authorities
CREATE POLICY "authorities_public_read" ON authorities
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Admin: full read
CREATE POLICY "authorities_admin_select" ON authorities
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: insert
CREATE POLICY "authorities_admin_insert" ON authorities
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin: update
CREATE POLICY "authorities_admin_update" ON authorities
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin: delete
CREATE POLICY "authorities_admin_delete" ON authorities
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 7. SERVICES POLICIES
-- ============================================================

-- Public: only active services
CREATE POLICY "services_public_read" ON services
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Admin: full read
CREATE POLICY "services_admin_select" ON services
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: insert
CREATE POLICY "services_admin_insert" ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin: update
CREATE POLICY "services_admin_update" ON services
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin: delete
CREATE POLICY "services_admin_delete" ON services
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 8. CONTACT INFO POLICIES
-- ============================================================

-- Public: only active contacts
CREATE POLICY "contact_public_read" ON contact_info
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Admin: full read
CREATE POLICY "contact_admin_select" ON contact_info
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: insert
CREATE POLICY "contact_admin_insert" ON contact_info
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin: update
CREATE POLICY "contact_admin_update" ON contact_info
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin: delete
CREATE POLICY "contact_admin_delete" ON contact_info
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 9. EVENTS POLICIES
-- ============================================================

-- Public: only active events
CREATE POLICY "events_public_read" ON events
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Admin: full read
CREATE POLICY "events_admin_select" ON events
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: insert
CREATE POLICY "events_admin_insert" ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin: update
CREATE POLICY "events_admin_update" ON events
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin: delete
CREATE POLICY "events_admin_delete" ON events
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 10. REGULATIONS POLICIES
-- ============================================================

-- Public: all regulations are publicly readable
CREATE POLICY "regulations_public_read" ON regulations
  FOR SELECT
  TO anon
  USING (true);

-- Admin: full read
CREATE POLICY "regulations_admin_select" ON regulations
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: insert
CREATE POLICY "regulations_admin_insert" ON regulations
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin: update
CREATE POLICY "regulations_admin_update" ON regulations
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin: delete
CREATE POLICY "regulations_admin_delete" ON regulations
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 11. SITE SETTINGS POLICIES
-- ============================================================

-- Public: all settings are publicly readable
CREATE POLICY "settings_public_read" ON site_settings
  FOR SELECT
  TO anon
  USING (true);

-- Admin: full read
CREATE POLICY "settings_admin_select" ON site_settings
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin: insert
CREATE POLICY "settings_admin_insert" ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Admin: update (used by upsert)
CREATE POLICY "settings_admin_update" ON site_settings
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin: delete
CREATE POLICY "settings_admin_delete" ON site_settings
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 12. STORAGE POLICIES (Supabase Storage buckets)
-- ============================================================
-- These policies are configured via supabase-storage-config.md
-- Buckets: news-images, news-attachments, authority-photos, service-images, regulations-pdfs
--
-- The storage policies were created from the Supabase Dashboard / SQL Editor:
-- - "Lectura publica de archivos" → SELECT for all buckets (public read)
-- - "Upload para usuarios autenticados" → INSERT for authenticated
-- - "Update para usuarios autenticados" → UPDATE for authenticated
-- - "Delete para usuarios autenticados" → DELETE for authenticated
--
-- See documentation/supabase-storage-config.md for full details.

-- ============================================================
-- 13. IMPORTANT: Set admin role on user
-- ============================================================
-- Run this to set the admin role on a user (replace USER_ID):
--
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE id = 'USER_ID_HERE';
--
-- Or via Supabase Dashboard > Authentication > Users > Edit user metadata
-- ============================================================
