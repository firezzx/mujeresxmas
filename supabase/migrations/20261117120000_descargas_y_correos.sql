-- Contactos de la página de registro (/sumate) y correos masivos.
-- material_leads: personas que dejan nombre, email y país en /sumate (la columna material guarda el origen).
-- email_campaigns: historial de los correos que las administradoras mandan desde /admin/contactos.

create table public.material_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 200),
  country text not null check (char_length(country) between 2 and 60),
  -- Qué material descargó (permite sumar otros materiales más adelante)
  material text not null default 'guia' check (char_length(material) between 2 and 60),
  -- Si se da de baja, deja de recibir correos masivos
  subscribed boolean not null default true,
  unsubscribe_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now()
);

comment on table public.material_leads is 'Registros para descargar materiales gratuitos; destinatarias de los correos masivos.';

-- Una persona se registra una sola vez por material
create unique index material_leads_email_material_key on public.material_leads (lower(email), material);

alter table public.material_leads enable row level security;

create policy "Cualquiera se registra para descargar"
  on public.material_leads for insert
  to anon, authenticated
  with check (subscribed = true);

create policy "Administradoras ven los registros de descargas"
  on public.material_leads for select
  to authenticated
  using ((select public.is_admin()));

create policy "Administradoras editan los registros de descargas"
  on public.material_leads for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Administradoras borran registros de descargas"
  on public.material_leads for delete
  to authenticated
  using ((select public.is_admin()));

-- Baja desde el link del correo: sin sesión, solo con el token de esa persona.
create or replace function public.unsubscribe_material_lead(token uuid)
returns boolean
language sql
security definer
set search_path = ''
as $$
  with updated as (
    update public.material_leads
    set subscribed = false
    where unsubscribe_token = token
    returning 1
  )
  select exists (select 1 from updated);
$$;

revoke all on function public.unsubscribe_material_lead(uuid) from public;
grant execute on function public.unsubscribe_material_lead(uuid) to anon, authenticated;

create table public.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null check (char_length(subject) between 2 and 160),
  body text not null check (char_length(body) between 2 and 20000),
  audience text not null default 'todas' check (char_length(audience) between 2 and 60),
  recipients integer not null default 0 check (recipients >= 0),
  failed integer not null default 0 check (failed >= 0),
  sent_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

comment on table public.email_campaigns is 'Correos masivos enviados desde el panel a los registros de descargas.';

alter table public.email_campaigns enable row level security;

create policy "Administradoras ven los correos enviados"
  on public.email_campaigns for select
  to authenticated
  using ((select public.is_admin()));

create policy "Administradoras registran correos enviados"
  on public.email_campaigns for insert
  to authenticated
  with check ((select public.is_admin()));
