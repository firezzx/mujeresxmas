-- Cuentas de Kiero (plataforma de e-commerce incluida en el plan Crecer). La API de partners de
-- Kiero da de alta y de baja por email; acá queda guardado lo que respondió para cada usuaria.

create table public.kiero_accounts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  -- Estado tal como lo devuelve Kiero (p. ej. invitada, activa, suspendida)
  status text not null,
  invitation_token text,
  invitation_expires_at timestamptz,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.kiero_accounts is 'Alta y baja de cada usuaria en Kiero, según la API de partners.';

create trigger kiero_accounts_set_updated_at
  before update on public.kiero_accounts
  for each row execute function public.set_updated_at();

alter table public.kiero_accounts enable row level security;

create policy "Cada usuaria ve su cuenta de Kiero"
  on public.kiero_accounts for select
  to authenticated
  using ((select auth.uid()) = user_id or (select public.is_admin()));

-- ¿Puede esta usuaria tener Kiero? Sí si tiene activo un plan pago (Crecer).
create or replace function public.has_paid_plan(target uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships m
    join public.plans p on p.id = m.plan_id
    where m.user_id = target and m.status = 'active' and coalesce(p.price_ars, 0) > 0
  );
$$;

revoke execute on function public.has_paid_plan(uuid) from public, anon;
grant execute on function public.has_paid_plan(uuid) to authenticated;

-- Guarda la respuesta de Kiero. La llama el servidor después de hablar con la API: cada usuaria
-- solo la suya y si tiene un plan pago; las administradoras, la de cualquiera.
create or replace function public.save_kiero_account(
  target uuid,
  account_email text,
  account_status text,
  token text default null,
  expires_at timestamptz default null,
  canceled boolean default false
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (public.is_admin() or (target = auth.uid() and public.has_paid_plan(target))) then
    raise exception 'No autorizado' using errcode = '42501';
  end if;

  insert into public.kiero_accounts (user_id, email, status, invitation_token, invitation_expires_at, canceled_at)
  values (target, account_email, account_status, token, expires_at, case when canceled then now() end)
  on conflict (user_id) do update set
    email = excluded.email,
    status = excluded.status,
    invitation_token = coalesce(excluded.invitation_token, public.kiero_accounts.invitation_token),
    invitation_expires_at = coalesce(excluded.invitation_expires_at, public.kiero_accounts.invitation_expires_at),
    canceled_at = case when canceled then now() else null end;
end;
$$;

revoke execute on function public.save_kiero_account(uuid, text, text, text, timestamptz, boolean) from public, anon;
grant execute on function public.save_kiero_account(uuid, text, text, text, timestamptz, boolean) to authenticated;
