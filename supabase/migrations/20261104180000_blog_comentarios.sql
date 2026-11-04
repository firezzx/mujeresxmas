-- Comentarios del blog: cada persona comenta con su cuenta. Solo se comenta en lo ya publicado,
-- cada una puede borrar sus comentarios y las administradoras pueden borrar cualquiera.

create table public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);

comment on table public.blog_comments is 'Comentarios de las publicaciones del blog.';

create index blog_comments_post_id_created_at_idx on public.blog_comments (post_id, created_at desc);
create index blog_comments_user_id_created_at_idx on public.blog_comments (user_id, created_at desc);

alter table public.blog_comments enable row level security;

-- La lectura pública pasa por list_post_comments, que no expone el id de quien comenta
create policy "Cada persona ve sus comentarios y administradoras todos"
  on public.blog_comments for select
  to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

create policy "Comentar con la propia cuenta en publicaciones visibles"
  on public.blog_comments for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.blog_posts post
      where post.id = post_id and post.status = 'published' and post.published_at <= now()
    )
  );

create policy "Borrar los propios comentarios o, siendo administradora, cualquiera"
  on public.blog_comments for delete
  to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- Freno contra el spam: un comentario cada 20 segundos por cuenta
create function public.limit_blog_comment_rate()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if exists (
    select 1 from public.blog_comments
    where user_id = new.user_id and created_at > now() - interval '20 seconds'
  ) then
    raise exception 'comment_rate_limit' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger blog_comments_limit_rate
  before insert on public.blog_comments
  for each row execute function public.limit_blog_comment_rate();

-- Comentarios de una publicación con el nombre visible ("Lucía G.") y el avatar. Los perfiles son
-- privados: esta función entrega solo esos dos datos, y solo de publicaciones visibles.
create function public.list_post_comments(target_post uuid)
returns table (
  id uuid,
  body text,
  created_at timestamptz,
  author_name text,
  avatar_path text,
  is_own boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    comment.id,
    comment.body,
    comment.created_at,
    nullif(
      btrim(
        coalesce(btrim(profile.first_name), '')
        || coalesce(' ' || nullif(left(btrim(profile.last_name), 1), '') || '.', '')
      ),
      ''
    ),
    profile.avatar_path,
    coalesce(comment.user_id = (select auth.uid()), false)
  from public.blog_comments comment
  join public.blog_posts post on post.id = comment.post_id
  left join public.profiles profile on profile.id = comment.user_id
  where comment.post_id = target_post
    and ((post.status = 'published' and post.published_at <= now()) or public.is_admin())
  order by comment.created_at desc
  limit 200;
$$;

revoke all on function public.list_post_comments(uuid) from public;
grant execute on function public.list_post_comments(uuid) to anon, authenticated;
