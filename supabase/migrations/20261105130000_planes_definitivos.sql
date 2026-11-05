-- Planes definitivos: Gratis y Crecimiento. El plan 3 se elimina.
-- Crecimiento queda inactivo hasta que estén los cobros con Pay per TIC.

alter table public.plans
  add column features text[] not null default '{}';

comment on column public.plans.features is 'Beneficios del plan, en el orden en que se muestran.';

update public.plans
set
  description = 'Para empezar a activar tus negocios.',
  features = array[
    'Acceso a la comunidad',
    'Charlas y contenidos gratuitos',
    'Participación en sorteos y beneficios',
    'Recursos iniciales para tu negocio'
  ]
where id = 'gratis';

update public.plans
set
  id = 'crecimiento',
  name = 'Crecimiento',
  description = 'Para ordenar, profesionalizar y hacer crecer tu negocio.',
  price_ars = 24999,
  features = array[
    'Todo lo incluido en el plan Gratis',
    'Acceso a cursos completos',
    'Diagnóstico inicial de tu negocio',
    'Consultoría con beneficios exclusivos',
    'Acceso prioritario a programas y oportunidades'
  ]
where id = 'plan-2';

delete from public.plans
where id = 'plan-3';
