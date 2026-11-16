-- Completa la fecha sólo para publicaciones futuras. No actualiza filas existentes.
create or replace function public.set_news_published_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.status = 'published' and new.published_at is null then
    if tg_op = 'INSERT' or old.status is distinct from 'published' then
      new.published_at = now();
    end if;
  end if;
  return new;
end;
$$;

revoke execute on function public.set_news_published_at() from public, anon, authenticated;

create trigger set_news_published_at
before insert or update of status on public.news
for each row execute function public.set_news_published_at();
