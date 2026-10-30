-- Administradoras del sitio y lectura de usuarias para el panel /admin.
-- El rol vive en una tabla aparte (y no en profiles) porque cada usuaria puede editar su
-- perfil: así nadie puede darse permisos desde el navegador. Las altas y bajas se hacen
-- desde el SQL Editor (ver docs/ADMINISTRADORAS.md).

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admins is 'Usuarias con acceso al panel de administración.';

alter table public.admins enable row level security;

-- Cada usuaria solo puede ver su propia fila. Sin políticas de alta, cambio ni baja.
create policy "Cada usuaria ve si es administradora"
  on public.admins for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ¿La usuaria de la sesión es administradora?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Usuarias con su perfil y membresía activa, solo para administradoras.
-- security definer porque el correo y la fecha de confirmación están en auth.users.
create or replace function public.admin_list_members()
returns table (
  id uuid,
  email text,
  first_name text,
  last_name text,
  phone text,
  city text,
  business_name text,
  avatar_path text,
  plan_name text,
  joined_at timestamptz,
  email_confirmed_at timestamptz,
  last_sign_in_at timestamptz,
  is_admin boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Solo para administradoras' using errcode = '42501';
  end if;

  return query
    select
      u.id,
      u.email::text,
      p.first_name,
      p.last_name,
      p.phone,
      p.city,
      p.business_name,
      p.avatar_path,
      pl.name,
      u.created_at,
      u.email_confirmed_at,
      u.last_sign_in_at,
      a.user_id is not null
    from auth.users u
    left join public.profiles p on p.id = u.id
    left join public.memberships m on m.user_id = u.id and m.status = 'active'
    left join public.plans pl on pl.id = m.plan_id
    left join public.admins a on a.user_id = u.id
    order by u.created_at desc;
end;
$$;

revoke execute on function public.admin_list_members() from public, anon;
grant execute on function public.admin_list_members() to authenticated;
