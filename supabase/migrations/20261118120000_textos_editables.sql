-- Textos del sitio que las administradoras editan desde el panel (por ahora, la presentación de
-- /sumate). Cada fila es un bloque de texto identificado por key; el contenido va en jsonb.
-- Si una fila no existe, el sitio usa los textos de src/content.

create table public.site_texts (
  key text primary key check (char_length(key) between 2 and 60),
  content jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null default auth.uid()
);

comment on table public.site_texts is 'Textos editables desde el panel de administración (p. ej. key = sumate).';

alter table public.site_texts enable row level security;

create policy "Cualquiera lee los textos del sitio"
  on public.site_texts for select
  to anon, authenticated
  using (true);

create policy "Administradoras crean textos del sitio"
  on public.site_texts for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Administradoras editan textos del sitio"
  on public.site_texts for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
