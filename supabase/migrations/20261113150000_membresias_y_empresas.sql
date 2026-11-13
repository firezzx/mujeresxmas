-- Membresías del diseño de las clientas: Comunidad (gratis), Crecer e Impulso. Se mantienen los
-- ids que usan las membresías ('gratis', 'crecimiento'); Impulso se suma inactivo y sin precio
-- hasta que lo confirmen. Un beneficio que empieza con "*" se muestra destacado.

update public.plans
set
  name = 'Comunidad',
  description = 'Ser parte de la red, formarte con lo básico y conocer los tres pilares.'
where id = 'gratis';

update public.plans
set
  description = 'Academia completa, diagnóstico de negocio, escucha grupal y networking.',
  features = array_replace(features, 'Todo lo que incluye Inicio', 'Todo lo que incluye Comunidad')
where id = 'crecimiento';

insert into public.plans (id, name, description, price_ars, is_active, sort_order, features)
values (
  'impulso',
  'Impulso',
  'Mentoría 1 a 1, tienda online incluida y acompañamiento para escalar.',
  null,
  false,
  3,
  array[
    'Todo lo que incluye Crecer',
    '* Mentoría 1 a 1, una sesión por mes',
    'Diagnóstico y plan de negocio con seguimiento trimestral',
    'Finanzas: curso y plan personalizado para acceder a crédito',
    'Sesiones individuales de acompañamiento',
    'Perfil destacado y acceso a alianzas'
  ]
)
on conflict (id) do nothing;

-- Pedidos de propuesta de empresas y organizaciones (página /empresas) ---------------------

create table public.company_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  company text not null check (char_length(company) between 2 and 160),
  email text not null check (char_length(email) between 5 and 200),
  audience text not null check (audience in ('cadena_de_valor', 'colaboradoras', 'comunidad')),
  created_at timestamptz not null default now()
);

comment on table public.company_leads is 'Pedidos de propuesta de membresías patrocinadas, desde /empresas.';

alter table public.company_leads enable row level security;

-- Cualquiera puede mandar el formulario; solo las administradoras los ven.
create policy "Cualquiera envía un pedido de propuesta"
  on public.company_leads for insert
  to anon, authenticated
  with check (true);

create policy "Administradoras ven los pedidos de propuesta"
  on public.company_leads for select
  to authenticated
  using ((select public.is_admin()));
