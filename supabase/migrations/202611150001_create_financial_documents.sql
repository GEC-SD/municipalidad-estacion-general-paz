-- Migración funcional: aplicar primero en local y, tras validar, en producción.
-- No altera ni elimina datos existentes.

create table if not exists public.financial_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  document_type text not null check (document_type in ('presupuesto', 'balance')),
  pdf_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint financial_documents_has_pdf check (cardinality(pdf_urls) > 0)
);

create index if not exists financial_documents_type_created_idx
  on public.financial_documents (document_type, created_at desc);

alter table public.financial_documents enable row level security;

-- Supabase ya no expone tablas nuevas automáticamente a la Data API.
-- Se revocan permisos amplios del rol anónimo y se otorga sólo lo necesario.
revoke all on table public.financial_documents from anon;
grant select on table public.financial_documents to anon;
grant select, insert, update, delete on table public.financial_documents to authenticated;

create policy "Financial documents are publicly readable"
  on public.financial_documents for select to anon, authenticated using (true);
create policy "Admins can insert financial documents"
  on public.financial_documents for insert to authenticated with check (public.is_admin());
create policy "Admins can update financial documents"
  on public.financial_documents for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete financial documents"
  on public.financial_documents for delete to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('financial-documents', 'financial-documents', true, 52428800, array['application/pdf'])
on conflict (id) do nothing;

create policy "Public can read financial documents"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'financial-documents');
create policy "Admins can upload financial documents"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'financial-documents' and public.is_admin());
create policy "Admins can update financial documents files"
  on storage.objects for update to authenticated
  using (bucket_id = 'financial-documents' and public.is_admin())
  with check (bucket_id = 'financial-documents' and public.is_admin());
create policy "Admins can delete financial documents files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'financial-documents' and public.is_admin());

create or replace function public.set_financial_document_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_financial_document_updated_at() from public, anon, authenticated;

create trigger set_financial_document_updated_at
before update on public.financial_documents
for each row execute function public.set_financial_document_updated_at();
