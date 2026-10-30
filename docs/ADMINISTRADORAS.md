# Administradoras

El panel `/admin` solo lo ven las cuentas que están en la tabla `public.admins`
(migración `supabase/migrations/20261030120000_administradoras.sql`). La tabla no se puede
modificar desde el sitio: las altas y bajas se hacen en Supabase → **SQL Editor**.

La cuenta tiene que existir antes (registrada y con el correo confirmado).

## Dar acceso

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'correo@ejemplo.com'
on conflict do nothing;
```

## Quitar acceso

```sql
delete from public.admins
where user_id = (select id from auth.users where email = 'correo@ejemplo.com');
```

## Ver quiénes son administradoras

```sql
select u.email, a.created_at
from public.admins a
join auth.users u on u.id = a.user_id
order by a.created_at;
```

## Ver el sitio como usuaria

Desde el menú de la cuenta o el panel, **Ver como usuaria** esconde todo lo de administración
para probar el sitio como una cuenta común. Una barra abajo de la pantalla permite volver.
Es solo visual: la cuenta sigue siendo administradora. Al cerrar sesión se vuelve a la vista
de administradora.

> Provisorio: durante el desarrollo, la administradora es la cuenta del equipo de diseño.
> Al pasar el proyecto a la clienta, dar de alta sus cuentas y quitar las de prueba.
