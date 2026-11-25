-- Correcciones de la clienta a los planes (documento "CORRECCIONES MX+"). Un beneficio que empieza
-- con "*" se muestra destacado. Impulso se inserta si no existe (por si falta la migración
-- 20261113150000) y queda visible con su precio.

update public.plans
set
  description = 'a ser parte de la comunidad de MX+',
  price_ars = null,
  features = array[
    'Formaciones para hacer crecer tu negocio',
    'Contenidos de bienestar',
    'Encuentros, novedades y convocatorias'
  ]
where id = 'gratis';

update public.plans
set
  description = 'Para ordenar, profesionalizar y hacer crecer tu negocio.',
  price_ars = 24990,
  is_active = true,
  features = array[
    'Todo el plan Inicio +',
    '* Tu tienda en línea gratis',
    '* Integración con Paq.ar incluida',
    '1 curso mensual gratis en la Academia',
    'Beneficios para tu bienestar',
    'Rondas de networking'
  ]
where id = 'crecimiento';

insert into public.plans (id, name, description, price_ars, is_active, sort_order, features)
values (
  'impulso',
  'Impulso',
  'Para escalar tu negocio con acompañamiento personalizado.',
  59990,
  true,
  3,
  array[
    'Todo el plan Crecer +',
    '2 cursos al mes a elección en la Academia de Mujeres x Más',
    '* Tablero de control pensado para tu negocio',
    '* Mentoría 1 a 1 (una por mes)'
  ]
)
on conflict (id) do update
set
  description = excluded.description,
  price_ars = excluded.price_ars,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  features = excluded.features;
