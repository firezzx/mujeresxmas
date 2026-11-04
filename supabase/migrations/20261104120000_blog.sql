-- Blog: categorías, publicaciones e imágenes.
-- Las administradoras cargan y editan todo (is_admin()). Cualquiera puede leer lo publicado
-- cuya fecha ya llegó, así una publicación programada aparece sola en su momento.

-- ─── Categorías ──────────────────────────────────────────────────────────────────────────

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  description text check (char_length(description) <= 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.blog_categories is 'Categorías del blog, para filtrar las publicaciones.';

create trigger blog_categories_set_updated_at
  before update on public.blog_categories
  for each row execute function public.set_updated_at();

alter table public.blog_categories enable row level security;

create policy "Categorías del blog visibles para todo el mundo"
  on public.blog_categories for select
  to anon, authenticated
  using (true);

create policy "Administradoras gestionan categorías del blog"
  on public.blog_categories for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

insert into public.blog_categories (name, slug) values
  ('Tecnología e IA', 'tecnologia-e-ia'),
  ('Comunicación y marketing', 'comunicacion-y-marketing'),
  ('Emprendimiento', 'emprendimiento'),
  ('Finanzas', 'finanzas'),
  ('Formación', 'formacion');

-- ─── Publicaciones ───────────────────────────────────────────────────────────────────────

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120),
  excerpt text check (char_length(excerpt) <= 300),
  -- content es el documento del editor; content_html, el HTML que genera el servidor al guardar
  content jsonb not null default '{"type":"doc","content":[]}',
  content_html text not null default '',
  reading_minutes integer not null default 1 check (reading_minutes > 0),
  -- Una categoría con publicaciones no se puede borrar: primero hay que moverlas a otra
  category_id uuid references public.blog_categories (id) on delete restrict,
  tags text[] not null default '{}',
  cover_path text,
  cover_alt text check (char_length(cover_alt) <= 160),
  author_name text check (char_length(author_name) <= 80),
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  -- SEO: si meta_title o meta_description están vacíos, se usan el título y la bajada
  meta_title text check (char_length(meta_title) <= 70),
  meta_description text check (char_length(meta_description) <= 160),
  canonical_url text check (canonical_url is null or canonical_url ~ '^https://'),
  noindex boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_published_complete check (
    status <> 'published' or (published_at is not null and category_id is not null)
  )
);

comment on table public.blog_posts is 'Publicaciones del blog.';

create index blog_posts_status_published_at_idx on public.blog_posts (status, published_at desc);
create index blog_posts_category_id_idx on public.blog_posts (category_id);
create index blog_posts_tags_idx on public.blog_posts using gin (tags);

create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

create policy "Publicaciones del blog visibles al llegar su fecha"
  on public.blog_posts for select
  to anon, authenticated
  using (status = 'published' and published_at <= now());

create policy "Administradoras gestionan publicaciones del blog"
  on public.blog_posts for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ─── Imágenes ────────────────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog',
  'blog',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
);

-- El bucket es público para mostrar las imágenes por URL; solo las administradoras las gestionan.
create policy "Blog: administradoras ven las imágenes"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'blog' and (select public.is_admin()));

create policy "Blog: administradoras suben imágenes"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog' and (select public.is_admin()));

create policy "Blog: administradoras reemplazan imágenes"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog' and (select public.is_admin()));

create policy "Blog: administradoras borran imágenes"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog' and (select public.is_admin()));
