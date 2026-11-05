-- Últimas personas registradas, para los avatares de las páginas públicas.
-- Los perfiles son privados: esta función entrega solo la foto y las iniciales, nunca el nombre, el
-- correo ni el id. Solo cuenta cuentas con el correo confirmado.

create function public.latest_members(max_count integer default 4)
returns table (
  initials text,
  avatar_path text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    upper(left(btrim(coalesce(profile.first_name, '')), 1) || left(btrim(coalesce(profile.last_name, '')), 1)),
    profile.avatar_path
  from public.profiles profile
  join auth.users account on account.id = profile.id
  where account.email_confirmed_at is not null
  order by profile.created_at desc
  limit least(greatest(max_count, 0), 8);
$$;

revoke all on function public.latest_members(integer) from public;
grant execute on function public.latest_members(integer) to anon, authenticated;
