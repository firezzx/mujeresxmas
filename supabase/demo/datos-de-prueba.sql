-- Datos de prueba para mostrar el sitio: usuarias, cursos, encuentros, notas del blog, comentarios y
-- notificaciones. NO es una migración: se pega en el SQL Editor de Supabase cuando hace falta y se borra
-- con borrar-datos-de-prueba.sql. Se genera con scripts/datos-de-prueba.mjs; ver docs/DATOS-DE-PRUEBA.md.
--
-- Las usuarias de prueba no pueden iniciar sesión (no tienen contraseña) y usan correos @example.com.
-- Las administradoras quedan anotadas en los cursos y encuentros, para verlos en Mi cuenta.

begin;

-- Usuarias ---------------------------------------------------------------------
-- El alta automática (handle_new_user) les crea el perfil y la membresía Gratis.
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  confirmation_token, recovery_token, email_change_token_new, email_change,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('00000000-0000-0000-0000-000000000000', 'de100000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'lucia.demo@example.com', '', '2026-09-02 10:12:00-03',
   '', '', '', '', '{"provider":"email","providers":["email"]}', '{"first_name":"Lucía","last_name":"Gómez"}', '2026-09-02 10:12:00-03', '2026-09-02 10:12:00-03'),
  ('00000000-0000-0000-0000-000000000000', 'de100000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'marina.demo@example.com', '', '2026-09-14 18:40:00-03',
   '', '', '', '', '{"provider":"email","providers":["email"]}', '{"first_name":"Marina","last_name":"Paz"}', '2026-09-14 18:40:00-03', '2026-09-14 18:40:00-03'),
  ('00000000-0000-0000-0000-000000000000', 'de100000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'sol.demo@example.com', '', '2026-09-29 09:05:00-03',
   '', '', '', '', '{"provider":"email","providers":["email"]}', '{"first_name":"Sol","last_name":"Ramírez"}', '2026-09-29 09:05:00-03', '2026-09-29 09:05:00-03'),
  ('00000000-0000-0000-0000-000000000000', 'de100000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'carla.demo@example.com', '', '2026-10-06 21:30:00-03',
   '', '', '', '', '{"provider":"email","providers":["email"]}', '{"first_name":"Carla","last_name":"Méndez"}', '2026-10-06 21:30:00-03', '2026-10-06 21:30:00-03'),
  ('00000000-0000-0000-0000-000000000000', 'de100000-0000-4000-8000-000000000005', 'authenticated', 'authenticated', 'valeria.demo@example.com', '', '2026-10-15 12:18:00-03',
   '', '', '', '', '{"provider":"email","providers":["email"]}', '{"first_name":"Valeria","last_name":"Torres"}', '2026-10-15 12:18:00-03', '2026-10-15 12:18:00-03'),
  ('00000000-0000-0000-0000-000000000000', 'de100000-0000-4000-8000-000000000006', 'authenticated', 'authenticated', 'romina.demo@example.com', '', '2026-10-24 16:47:00-03',
   '', '', '', '', '{"provider":"email","providers":["email"]}', '{"first_name":"Romina","last_name":"Acosta"}', '2026-10-24 16:47:00-03', '2026-10-24 16:47:00-03'),
  ('00000000-0000-0000-0000-000000000000', 'de100000-0000-4000-8000-000000000007', 'authenticated', 'authenticated', 'julieta.demo@example.com', '', '2026-11-03 11:02:00-03',
   '', '', '', '', '{"provider":"email","providers":["email"]}', '{"first_name":"Julieta","last_name":"Sosa"}', '2026-11-03 11:02:00-03', '2026-11-03 11:02:00-03'),
  ('00000000-0000-0000-0000-000000000000', 'de100000-0000-4000-8000-000000000008', 'authenticated', 'authenticated', 'andrea.demo@example.com', '', '2026-11-09 19:25:00-03',
   '', '', '', '', '{"provider":"email","providers":["email"]}', '{"first_name":"Andrea","last_name":"Ruiz"}', '2026-11-09 19:25:00-03', '2026-11-09 19:25:00-03')
on conflict (id) do nothing;

update public.profiles p set city = d.city, business_name = d.business, created_at = d.joined
from (values
  ('de100000-0000-4000-8000-000000000001'::uuid, 'Córdoba', 'Tienda de ropa Lu', '2026-09-02 10:12:00-03'::timestamptz),
  ('de100000-0000-4000-8000-000000000002'::uuid, 'Rosario', 'Dulce Marina pastelería', '2026-09-14 18:40:00-03'::timestamptz),
  ('de100000-0000-4000-8000-000000000003'::uuid, 'CABA', 'Sol Estudio de diseño', '2026-09-29 09:05:00-03'::timestamptz),
  ('de100000-0000-4000-8000-000000000004'::uuid, 'Mendoza', 'Raíz cosmética natural', '2026-10-06 21:30:00-03'::timestamptz),
  ('de100000-0000-4000-8000-000000000005'::uuid, 'La Plata', 'Vale Deco', '2026-10-15 12:18:00-03'::timestamptz),
  ('de100000-0000-4000-8000-000000000006'::uuid, 'Neuquén', 'Huerta Romi', '2026-10-24 16:47:00-03'::timestamptz),
  ('de100000-0000-4000-8000-000000000007'::uuid, 'Salta', 'Juli Joyas', '2026-11-03 11:02:00-03'::timestamptz),
  ('de100000-0000-4000-8000-000000000008'::uuid, 'Mar del Plata', 'Andrea Contable', '2026-11-09 19:25:00-03'::timestamptz)
) as d(id, city, business, joined)
where p.id = d.id;

-- Algunas con el plan pago
update public.memberships set plan_id = 'crecimiento'
where status = 'active' and user_id in ('de100000-0000-4000-8000-000000000001', 'de100000-0000-4000-8000-000000000003', 'de100000-0000-4000-8000-000000000006');

-- Cursos -----------------------------------------------------------------------
insert into public.courses (id, title, summary, status, starts_at) values
  ('de200000-0000-4000-8000-000000000001', 'Tu primer negocio online', 'De la idea a la primera venta, paso a paso: qué vender, a quién y cómo cobrar.', 'published', '2026-11-17 19:00:00-03'),
  ('de200000-0000-4000-8000-000000000002', 'Redes que venden', 'Contenido simple para atraer clientas en Instagram y WhatsApp sin pasarte el día publicando.', 'published', '2026-11-24 19:00:00-03'),
  ('de200000-0000-4000-8000-000000000003', 'Ordená tus números', 'Ingresos, gastos y precios sin vueltas. Una planilla práctica para saber si tu negocio gana plata.', 'published', '2026-12-01 19:00:00-03'),
  ('de200000-0000-4000-8000-000000000004', 'IA para emprendedoras', 'Herramientas de inteligencia artificial para escribir, diseñar y responder consultas en menos tiempo.', 'published', '2026-12-09 19:00:00-03'),
  ('de200000-0000-4000-8000-000000000005', 'Ponele precio a lo que hacés', 'Cómo calcular costos, sumar tu tiempo y dejar de cobrar de menos.', 'published', null),
  ('de200000-0000-4000-8000-000000000006', 'Tu marca en una tarde', 'Logo, colores y tono para que tu emprendimiento se reconozca a primera vista.', 'published', null)
on conflict (id) do nothing;

-- Encuentros -------------------------------------------------------------------
insert into public.events (id, title, summary, location, online_url, status, starts_at, ends_at) values
  ('de300000-0000-4000-8000-000000000001', 'Café de emprendedoras', 'Una mañana para conocernos, contar en qué andamos y armar red.', 'Palermo, CABA', null, 'published', '2026-11-20 10:00:00-03', '2026-11-20 12:00:00-03'),
  ('de300000-0000-4000-8000-000000000002', 'Charla: vender por WhatsApp', 'Catálogo, respuestas rápidas y cómo cerrar una venta sin perseguir a nadie.', null, 'https://meet.google.com/demo-mxm-charla', 'published', '2026-11-26 19:00:00-03', '2026-11-26 20:30:00-03'),
  ('de300000-0000-4000-8000-000000000003', 'Espacio de escucha', 'Encuentro grupal coordinado por una psicóloga para hablar de lo que cuesta emprender.', null, 'https://meet.google.com/demo-mxm-escucha', 'published', '2026-12-03 18:30:00-03', '2026-12-03 19:30:00-03'),
  ('de300000-0000-4000-8000-000000000004', 'Networking por rubro: gastronomía', 'Para las que cocinan y venden: proveedoras, precios y alianzas.', 'Rosario, Santa Fe', null, 'published', '2026-12-10 18:00:00-03', '2026-12-10 20:00:00-03'),
  ('de300000-0000-4000-8000-000000000005', 'Cierre de año Mujeres x Más', 'Brindamos por lo que logramos y arrancamos a planear el 2027 juntas.', 'Córdoba capital', null, 'published', '2026-12-17 19:00:00-03', '2026-12-17 22:00:00-03')
on conflict (id) do nothing;

-- Inscripciones: cada usuaria de prueba en algunos, y las administradoras en todos
insert into public.course_enrollments (course_id, user_id)
select c.id, u.id
from (values ('de200000-0000-4000-8000-000000000001'::uuid), ('de200000-0000-4000-8000-000000000002'::uuid), ('de200000-0000-4000-8000-000000000003'::uuid), ('de200000-0000-4000-8000-000000000004'::uuid), ('de200000-0000-4000-8000-000000000005'::uuid), ('de200000-0000-4000-8000-000000000006'::uuid)) as c(id)
cross join (values ('de100000-0000-4000-8000-000000000001'::uuid), ('de100000-0000-4000-8000-000000000002'::uuid), ('de100000-0000-4000-8000-000000000003'::uuid), ('de100000-0000-4000-8000-000000000004'::uuid), ('de100000-0000-4000-8000-000000000005'::uuid), ('de100000-0000-4000-8000-000000000006'::uuid), ('de100000-0000-4000-8000-000000000007'::uuid), ('de100000-0000-4000-8000-000000000008'::uuid)) as u(id)
where (('x' || substr(md5(c.id::text || u.id::text), 1, 2))::bit(8)::int) % 3 = 0
on conflict do nothing;

insert into public.course_enrollments (course_id, user_id)
select c.id, a.user_id
from (values ('de200000-0000-4000-8000-000000000001'::uuid), ('de200000-0000-4000-8000-000000000002'::uuid), ('de200000-0000-4000-8000-000000000003'::uuid), ('de200000-0000-4000-8000-000000000004'::uuid)) as c(id)
cross join public.admins a
on conflict do nothing;

insert into public.event_registrations (event_id, user_id)
select e.id, u.id
from (values ('de300000-0000-4000-8000-000000000001'::uuid), ('de300000-0000-4000-8000-000000000002'::uuid), ('de300000-0000-4000-8000-000000000003'::uuid), ('de300000-0000-4000-8000-000000000004'::uuid), ('de300000-0000-4000-8000-000000000005'::uuid)) as e(id)
cross join (values ('de100000-0000-4000-8000-000000000001'::uuid), ('de100000-0000-4000-8000-000000000002'::uuid), ('de100000-0000-4000-8000-000000000003'::uuid), ('de100000-0000-4000-8000-000000000004'::uuid), ('de100000-0000-4000-8000-000000000005'::uuid), ('de100000-0000-4000-8000-000000000006'::uuid), ('de100000-0000-4000-8000-000000000007'::uuid), ('de100000-0000-4000-8000-000000000008'::uuid)) as u(id)
where (('x' || substr(md5(e.id::text || u.id::text), 1, 2))::bit(8)::int) % 2 = 0
on conflict do nothing;

insert into public.event_registrations (event_id, user_id)
select e.id, a.user_id
from (values ('de300000-0000-4000-8000-000000000001'::uuid), ('de300000-0000-4000-8000-000000000002'::uuid), ('de300000-0000-4000-8000-000000000003'::uuid)) as e(id)
cross join public.admins a
on conflict do nothing;

-- Notas del blog ---------------------------------------------------------------
-- Las portadas usan fotos del sitio (public/images/home): se pueden cambiar desde el admin.
insert into public.blog_posts (
  id, title, slug, excerpt, content, content_html, reading_minutes, category_id, tags,
  cover_path, cover_alt, author_name, featured, status, published_at
)
select d.id, d.title, d.slug, d.excerpt, d.content::jsonb, d.html, d.minutes, cat.id, d.tags,
  d.cover, d.cover_alt, d.author, d.featured, 'published', d.published_at
from (values
  ('de400000-0000-4000-8000-000000000001'::uuid, 'Cómo usar la IA en tu emprendimiento sin ser experta', 'como-usar-la-ia-en-tu-emprendimiento', 'Tres herramientas gratuitas para ganar tiempo esta misma semana, explicadas sin tecnicismos.', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"La inteligencia artificial no es solo para empresas grandes. Bien usada, te puede ahorrar horas de trabajo cada semana, y no hace falta saber programar."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"1. Para escribir"}]},{"type":"paragraph","content":[{"type":"text","text":"Pedile ideas para publicaciones, descripciones de productos o respuestas a consultas frecuentes. Siempre revisá y ajustá el texto para que suene a vos."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"2. Para diseñar"}]},{"type":"paragraph","content":[{"type":"text","text":"Hay herramientas que arman placas para redes a partir de una frase. Cargá tus colores y tu logo una vez y usalos siempre."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"3. Para ordenarte"}]},{"type":"paragraph","content":[{"type":"text","text":"Contale a la IA qué tenés que hacer en la semana y pedile que te arme un plan por días. Parece poco, pero ordena muchísimo."}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Empezá con una sola herramienta"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Usala para una tarea concreta"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Medí cuánto tiempo te ahorra"}]}]}]}]}', '<p>La inteligencia artificial no es solo para empresas grandes. Bien usada, te puede ahorrar horas de trabajo cada semana, y no hace falta saber programar.</p><h2>1. Para escribir</h2><p>Pedile ideas para publicaciones, descripciones de productos o respuestas a consultas frecuentes. Siempre revisá y ajustá el texto para que suene a vos.</p><h2>2. Para diseñar</h2><p>Hay herramientas que arman placas para redes a partir de una frase. Cargá tus colores y tu logo una vez y usalos siempre.</p><h2>3. Para ordenarte</h2><p>Contale a la IA qué tenés que hacer en la semana y pedile que te arme un plan por días. Parece poco, pero ordena muchísimo.</p><ul><li><p>Empezá con una sola herramienta</p></li><li><p>Usala para una tarea concreta</p></li><li><p>Medí cuánto tiempo te ahorra</p></li></ul>', 1, 'tecnologia-e-ia', array['ia', 'herramientas', 'productividad']::text[], '/images/home/tecnologia-oficina.jpg', 'Mujer trabajando con una computadora portátil', 'Equipo Mujeres x Más', true, '2026-11-04 09:00:00-03'::timestamptz),
  ('de400000-0000-4000-8000-000000000002'::uuid, 'Del Instagram a la tienda propia: qué mirar antes de dar el salto', 'del-instagram-a-la-tienda-propia', 'Señales de que tu emprendimiento está listo para tener su tienda online y cómo prepararte.', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Vender por redes es un gran comienzo, pero llega un momento en que responder precios por mensaje te come el día. Ahí aparece la tienda online."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Señales de que es el momento"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Te preguntan lo mismo todo el tiempo"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Perdés ventas porque no llegás a responder"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Tenés un catálogo que cambia poco"}]}]}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Antes de empezar"}]},{"type":"paragraph","content":[{"type":"text","text":"Sacá buenas fotos con luz natural, definí tus medios de pago y pensá cómo vas a hacer los envíos. Con eso resuelto, armar la tienda es mucho más fácil."}]}]}', '<p>Vender por redes es un gran comienzo, pero llega un momento en que responder precios por mensaje te come el día. Ahí aparece la tienda online.</p><h2>Señales de que es el momento</h2><ul><li><p>Te preguntan lo mismo todo el tiempo</p></li><li><p>Perdés ventas porque no llegás a responder</p></li><li><p>Tenés un catálogo que cambia poco</p></li></ul><h2>Antes de empezar</h2><p>Sacá buenas fotos con luz natural, definí tus medios de pago y pensá cómo vas a hacer los envíos. Con eso resuelto, armar la tienda es mucho más fácil.</p>', 1, 'emprendimiento', array['tienda online', 'ventas']::text[], '/images/home/emprendedora-cocina.jpg', 'Emprendedora sonriendo en su taller', 'Equipo Mujeres x Más', false, '2026-10-28 09:00:00-03'::timestamptz),
  ('de400000-0000-4000-8000-000000000003'::uuid, 'Ponerle precio a lo que hacés: una guía para dejar de cobrar de menos', 'ponerle-precio-a-lo-que-haces', 'Costos, tiempo y margen: la cuenta que tenés que hacer antes de publicar un precio.', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Uno de los errores más comunes al emprender es poner el precio mirando a la competencia y no tus números. Vamos paso a paso."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Sumá todos tus costos"}]},{"type":"paragraph","content":[{"type":"text","text":"Materiales, envases, envíos, comisiones de cobro y una parte de los gastos fijos como internet o el alquiler."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Tu tiempo también cuesta"}]},{"type":"paragraph","content":[{"type":"text","text":"Calculá cuántas horas te lleva cada producto y ponele un valor a esa hora. Si no lo cobrás, estás trabajando gratis."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Agregá el margen"}]},{"type":"paragraph","content":[{"type":"text","text":"El margen es lo que le queda a tu negocio para crecer. Sin margen, cualquier imprevisto te deja en rojo."}]}]}', '<p>Uno de los errores más comunes al emprender es poner el precio mirando a la competencia y no tus números. Vamos paso a paso.</p><h2>Sumá todos tus costos</h2><p>Materiales, envases, envíos, comisiones de cobro y una parte de los gastos fijos como internet o el alquiler.</p><h2>Tu tiempo también cuesta</h2><p>Calculá cuántas horas te lleva cada producto y ponele un valor a esa hora. Si no lo cobrás, estás trabajando gratis.</p><h2>Agregá el margen</h2><p>El margen es lo que le queda a tu negocio para crecer. Sin margen, cualquier imprevisto te deja en rojo.</p>', 1, 'finanzas', array['precios', 'finanzas', 'costos']::text[], '/images/home/finanzas.jpg', 'Manos haciendo cuentas con una calculadora', 'Andrea Ruiz', false, '2026-10-21 09:00:00-03'::timestamptz),
  ('de400000-0000-4000-8000-000000000004'::uuid, 'Cinco ideas de contenido para redes cuando no sabés qué publicar', 'cinco-ideas-de-contenido-para-redes', 'Un banco de ideas simples para mantener tus redes activas sin quedarte en blanco.', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Publicar seguido no significa publicar cualquier cosa. Estas cinco ideas funcionan para casi cualquier rubro."}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Mostrá cómo hacés tu producto"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Contá la historia de tu emprendimiento"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Respondé una pregunta frecuente"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Compartí la opinión de una clienta"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Mostrá un antes y un después"}]}]}]},{"type":"paragraph","content":[{"type":"text","text":"Elegí dos por semana y armá un calendario simple. La constancia vale más que la perfección."}]}]}', '<p>Publicar seguido no significa publicar cualquier cosa. Estas cinco ideas funcionan para casi cualquier rubro.</p><ul><li><p>Mostrá cómo hacés tu producto</p></li><li><p>Contá la historia de tu emprendimiento</p></li><li><p>Respondé una pregunta frecuente</p></li><li><p>Compartí la opinión de una clienta</p></li><li><p>Mostrá un antes y un después</p></li></ul><p>Elegí dos por semana y armá un calendario simple. La constancia vale más que la perfección.</p>', 1, 'comunicacion-y-marketing', array['redes', 'contenido', 'marketing']::text[], '/images/home/marketing.jpg', 'Emprendedora grabando un video con el celular', 'Sol Ramírez', false, '2026-10-14 09:00:00-03'::timestamptz),
  ('de400000-0000-4000-8000-000000000005'::uuid, 'Emprender después de los 40: historias que inspiran', 'emprender-despues-de-los-40', 'Tres mujeres que se animaron a empezar de nuevo y lo que aprendieron en el camino.', '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Reinventarse no tiene edad. En la comunidad hay cada vez más mujeres que encuentran después de los 40 el impulso para su propio proyecto."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Lo que tienen en común"}]},{"type":"paragraph","content":[{"type":"text","text":"Experiencia, claridad sobre lo que quieren y una red que las acompaña. Ninguna lo hizo sola."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Un consejo para empezar"}]},{"type":"paragraph","content":[{"type":"text","text":"Arrancá chico, probá con pocas clientas y ajustá sobre la marcha. Lo importante es dar el primer paso."}]}]}', '<p>Reinventarse no tiene edad. En la comunidad hay cada vez más mujeres que encuentran después de los 40 el impulso para su propio proyecto.</p><h2>Lo que tienen en común</h2><p>Experiencia, claridad sobre lo que quieren y una red que las acompaña. Ninguna lo hizo sola.</p><h2>Un consejo para empezar</h2><p>Arrancá chico, probá con pocas clientas y ajustá sobre la marcha. Lo importante es dar el primer paso.</p>', 1, 'formacion', array['reinvención', 'historias']::text[], '/images/home/socias-cafe.jpg', 'Dos socias conversando sobre su negocio', 'Equipo Mujeres x Más', false, '2026-10-07 09:00:00-03'::timestamptz)
) as d(id, title, slug, excerpt, content, html, minutes, category_slug, tags, cover, cover_alt, author, featured, published_at)
join public.blog_categories cat on cat.slug = d.category_slug
on conflict (id) do nothing;

-- Comentarios ------------------------------------------------------------------
-- Sin los triggers de aviso y de límite: si no, cada comentario le manda una notificación a las
-- administradoras y el límite frena varios comentarios seguidos de la misma usuaria.
alter table public.blog_comments disable trigger blog_comments_notify_admins;
alter table public.blog_comments disable trigger blog_comments_limit_rate;

insert into public.blog_comments (id, post_id, user_id, body, created_at) values
  ('de500000-0000-4000-8000-000000000001', 'de400000-0000-4000-8000-000000000001', 'de100000-0000-4000-8000-000000000001', '¡Qué buena nota! Probé lo de pedirle ideas para las publicaciones y me salvó la semana.', '2026-11-04 12:30:00-03'),
  ('de500000-0000-4000-8000-000000000002', 'de400000-0000-4000-8000-000000000001', 'de100000-0000-4000-8000-000000000003', 'Yo uso la IA para las descripciones de productos y después las ajusto. Ahorro un montón de tiempo.', '2026-11-04 15:10:00-03'),
  ('de500000-0000-4000-8000-000000000003', 'de400000-0000-4000-8000-000000000001', 'de100000-0000-4000-8000-000000000006', 'Me da un poco de miedo empezar, pero con esta explicación me animo. ¿Alguna herramienta gratis para diseñar?', '2026-11-05 09:45:00-03'),
  ('de500000-0000-4000-8000-000000000004', 'de400000-0000-4000-8000-000000000001', 'de100000-0000-4000-8000-000000000008', 'Lo del plan semanal lo voy a probar hoy mismo. Gracias por compartirlo.', '2026-11-06 20:05:00-03'),
  ('de500000-0000-4000-8000-000000000005', 'de400000-0000-4000-8000-000000000002', 'de100000-0000-4000-8000-000000000004', 'Me pasa exactamente eso de responder precios todo el día. Creo que es momento de la tienda.', '2026-10-28 18:20:00-03'),
  ('de500000-0000-4000-8000-000000000006', 'de400000-0000-4000-8000-000000000002', 'de100000-0000-4000-8000-000000000001', 'Yo hice el salto el año pasado y fue lo mejor que me pasó. Las fotos con luz natural hacen la diferencia.', '2026-10-29 10:00:00-03'),
  ('de500000-0000-4000-8000-000000000007', 'de400000-0000-4000-8000-000000000002', 'de100000-0000-4000-8000-000000000007', '¿Qué medios de pago recomiendan para arrancar?', '2026-10-30 22:15:00-03'),
  ('de500000-0000-4000-8000-000000000008', 'de400000-0000-4000-8000-000000000003', 'de100000-0000-4000-8000-000000000002', 'Nunca había sumado mi tiempo en el precio. Hice la cuenta y estaba cobrando de menos.', '2026-10-21 14:40:00-03'),
  ('de500000-0000-4000-8000-000000000009', 'de400000-0000-4000-8000-000000000003', 'de100000-0000-4000-8000-000000000005', 'Muy clara la explicación del margen. La voy a compartir con mis socias.', '2026-10-22 11:25:00-03'),
  ('de500000-0000-4000-8000-000000000010', 'de400000-0000-4000-8000-000000000003', 'de100000-0000-4000-8000-000000000008', 'Como contadora, confirmo: el margen es lo que te salva cuando hay imprevistos.', '2026-10-23 17:50:00-03'),
  ('de500000-0000-4000-8000-000000000011', 'de400000-0000-4000-8000-000000000004', 'de100000-0000-4000-8000-000000000003', 'Mostrar cómo hago mis productos fue lo que más me funcionó en Instagram.', '2026-10-14 19:30:00-03'),
  ('de500000-0000-4000-8000-000000000012', 'de400000-0000-4000-8000-000000000004', 'de100000-0000-4000-8000-000000000006', 'Me guardo la lista. Siempre me quedo en blanco los lunes.', '2026-10-16 08:55:00-03'),
  ('de500000-0000-4000-8000-000000000013', 'de400000-0000-4000-8000-000000000005', 'de100000-0000-4000-8000-000000000005', 'Arranqué a los 47 y me siento identificada con cada palabra. ¡Gracias!', '2026-10-08 13:15:00-03'),
  ('de500000-0000-4000-8000-000000000014', 'de400000-0000-4000-8000-000000000005', 'de100000-0000-4000-8000-000000000002', 'Hermosa nota. Que se sepa que nunca es tarde.', '2026-10-09 21:40:00-03')
on conflict (id) do nothing;

alter table public.blog_comments enable trigger blog_comments_notify_admins;
alter table public.blog_comments enable trigger blog_comments_limit_rate;

-- Notificaciones para todas ----------------------------------------------------
insert into public.notifications (id, user_id, title, body, link, created_at) values
  ('de600000-0000-4000-8000-000000000001', null, '¡Bienvenida a la nueva etapa!', 'Ya podés recorrer los tres pilares: Desarrollo, Bienestar y Conexión.', '/', '2026-11-05 10:00:00-03'),
  ('de600000-0000-4000-8000-000000000002', null, 'Nuevo curso: Redes que venden', 'Empieza el 24 de noviembre. Anotate desde Mi cuenta.', '/mi-cuenta', '2026-11-08 12:00:00-03'),
  ('de600000-0000-4000-8000-000000000003', null, 'Café de emprendedoras', 'Te esperamos el 20 de noviembre en Palermo para conocernos.', '/mi-cuenta', '2026-11-10 09:30:00-03')
on conflict (id) do nothing;

commit;
