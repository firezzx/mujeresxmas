-- Foto de portada del perfil.
-- Cada usuaria sube a la carpeta con su id: covers/<user_id>/<archivo>

alter table public.profiles add column if not exists cover_path text;
comment on column public.profiles.cover_path is 'Ruta de la foto de portada en el bucket covers.';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'covers',
  'covers',
  true,
  3145728, -- 3 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- El bucket es público para mostrar las portadas por URL; este select habilita listar y hacer upsert.
create policy "Portadas: ver la carpeta propia"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Portadas: subir a la carpeta propia"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Portadas: reemplazar en la carpeta propia"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Portadas: borrar de la carpeta propia"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'covers'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
