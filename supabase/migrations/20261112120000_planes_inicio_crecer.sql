-- Planes Inicio (gratis) y Crecer. Se mantienen los ids ('gratis' y 'crecimiento') porque las
-- membresías los usan; cambian el nombre y los beneficios. Un beneficio que empieza con "*" se
-- muestra destacado en las tarjetas.

update public.plans
set
  name = 'Inicio',
  features = array[
    'Formaciones introductorias y recursos de la Academia',
    'Contenidos de bienestar y charlas abiertas',
    'Comunidad online y encuentros abiertos',
    'Novedades y convocatorias'
  ]
where id = 'gratis';

update public.plans
set
  name = 'Crecer',
  price_ars = 24999,
  features = array[
    'Todo lo que incluye Inicio',
    '* Kiero, plataforma de e-commerce para tu negocio',
    'Guía para activar tu tienda y talleres de ventas',
    'Encuentros de bienestar con herramientas prácticas',
    'Rondas de networking para explorar colaboraciones'
  ]
where id = 'crecimiento';
