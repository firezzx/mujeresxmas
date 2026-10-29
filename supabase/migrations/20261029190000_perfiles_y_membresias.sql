-- Perfiles, planes y membresías.
-- Cada usuaria nueva recibe un perfil y la membresía Gratis automáticamente (trigger on_auth_user_created).

-- Utilidad: mantener updated_at al día
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Planes ---------------------------------------------------------------------

create table public.plans (
  id text primary key,
  name text not null,
  description text,
  price_ars numeric(12, 2),
  is_active boolean not null default false,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.plans is 'Planes de membresía. Los pagos se activan en la etapa 2.';

create trigger plans_set_updated_at
  before update on public.plans
  for each row execute function public.set_updated_at();

-- Nombres y precios de los planes pagos se definen con la clienta.
insert into public.plans (id, name, price_ars, is_active, sort_order) values
  ('gratis', 'Gratis', 0, true, 1),
  ('plan-2', 'Plan 2', null, false, 2),
  ('plan-3', 'Plan 3', null, false, 3);

alter table public.plans enable row level security;

create policy "Planes visibles para todo el mundo"
  on public.plans for select
  to anon, authenticated
  using (true);

-- Perfiles -------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  phone text,
  city text,
  business_name text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column public.profiles.avatar_path is 'Ruta del archivo dentro del bucket avatars.';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Cada usuaria ve su perfil"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Cada usuaria edita su perfil"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Membresías -----------------------------------------------------------------

create type public.membership_status as enum ('active', 'canceled', 'expired');

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id text not null references public.plans (id),
  status public.membership_status not null default 'active',
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Una sola membresía activa por usuaria
create unique index memberships_one_active_per_user
  on public.memberships (user_id)
  where status = 'active';

create index memberships_plan_id_idx on public.memberships (plan_id);

create trigger memberships_set_updated_at
  before update on public.memberships
  for each row execute function public.set_updated_at();

alter table public.memberships enable row level security;

-- Solo lectura desde el cliente: las altas y cambios los hace el servidor.
create policy "Cada usuaria ve sus membresías"
  on public.memberships for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Alta automática ------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );

  insert into public.memberships (user_id, plan_id)
  values (new.id, 'gratis');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
