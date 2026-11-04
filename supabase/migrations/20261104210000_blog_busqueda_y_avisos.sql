-- Buscador del blog y moderación de comentarios: aviso a las administradoras y más frenos contra el spam.

-- Texto donde busca el blog: título, bajada, etiquetas y contenido, en minúsculas y sin acentos
-- para que "como" encuentre "Cómo". La aplicación normaliza la búsqueda de la misma manera.
create function public.blog_search_text(title text, excerpt text, tags text[], html text)
returns text
language sql
immutable
set search_path = ''
as $$
  select translate(
    lower(concat_ws(' ', title, excerpt, array_to_string(tags, ' '), regexp_replace(html, '<[^>]+>', ' ', 'g'))),
    'áàäâéèëêíìïîóòöôúùüûñ',
    'aaaaeeeeiiiioooouuuun'
  );
$$;

alter table public.blog_posts
  add column search_text text generated always as (
    public.blog_search_text(title, excerpt, tags, content_html)
  ) stored;

-- Frenos contra el spam, por cuenta: un comentario cada 20 segundos, hasta 10 cada 10 minutos y
-- sin repetir el mismo texto en una publicación durante 24 horas.
create or replace function public.limit_blog_comment_rate()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.blog_comments
    where user_id = new.user_id and created_at > now() - interval '20 seconds'
  ) or (
    select count(*) from public.blog_comments
    where user_id = new.user_id and created_at > now() - interval '10 minutes'
  ) >= 10 then
    raise exception 'comment_rate_limit' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.blog_comments
    where user_id = new.user_id
      and post_id = new.post_id
      and lower(btrim(body)) = lower(btrim(new.body))
      and created_at > now() - interval '24 hours'
  ) then
    raise exception 'comment_duplicate' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

-- Aviso a cada administradora en su campanita cuando entra un comentario (menos a quien lo
-- escribió). security definer: quien comenta no puede crear notificaciones por su cuenta.
create function public.notify_admins_of_blog_comment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  post_title text;
  post_slug text;
begin
  select title, slug into post_title, post_slug from public.blog_posts where id = new.post_id;

  insert into public.notifications (user_id, title, body, link)
  select
    admin.user_id,
    left('Nuevo comentario en ' || post_title, 120),
    left(new.body, 300),
    '/blog/' || post_slug || '#comentarios-seccion'
  from public.admins admin
  where admin.user_id <> new.user_id;

  return new;
end;
$$;

revoke all on function public.notify_admins_of_blog_comment() from public, anon, authenticated;

create trigger blog_comments_notify_admins
  after insert on public.blog_comments
  for each row execute function public.notify_admins_of_blog_comment();
