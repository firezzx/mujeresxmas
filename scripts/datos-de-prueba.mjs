import fs from "node:fs"

// Genera supabase/demo/datos-de-prueba.sql y borrar-datos-de-prueba.sql. Se corre desde la raíz del
// proyecto con: node scripts/datos-de-prueba.mjs (ver docs/DATOS-DE-PRUEBA.md).
const q = (s) => (s == null ? "null" : `'${String(s).replace(/'/g, "''")}'`)
const id = (prefix, n) => `${prefix}-0000-4000-8000-${String(n).padStart(12, "0")}`
const EMAIL_SUFFIX = ".demo@example.com"

// ─── Usuarias ────────────────────────────────────────────────────────────────
const users = [
  ["Lucía", "Gómez", "lucia", "Córdoba", "Tienda de ropa Lu", "2026-09-02 10:12", "crecimiento"],
  ["Marina", "Paz", "marina", "Rosario", "Dulce Marina pastelería", "2026-09-14 18:40", "gratis"],
  ["Sol", "Ramírez", "sol", "CABA", "Sol Estudio de diseño", "2026-09-29 09:05", "crecimiento"],
  ["Carla", "Méndez", "carla", "Mendoza", "Raíz cosmética natural", "2026-10-06 21:30", "gratis"],
  ["Valeria", "Torres", "valeria", "La Plata", "Vale Deco", "2026-10-15 12:18", "gratis"],
  ["Romina", "Acosta", "romina", "Neuquén", "Huerta Romi", "2026-10-24 16:47", "crecimiento"],
  ["Julieta", "Sosa", "julieta", "Salta", "Juli Joyas", "2026-11-03 11:02", "gratis"],
  ["Andrea", "Ruiz", "andrea", "Mar del Plata", "Andrea Contable", "2026-11-09 19:25", "gratis"],
].map(([first, last, slug, city, business, joined, plan], i) => ({
  id: id("de100000", i + 1),
  first,
  last,
  email: `${slug}${EMAIL_SUFFIX}`,
  city,
  business,
  joined: `${joined}:00-03`,
  plan,
}))

// ─── Cursos ──────────────────────────────────────────────────────────────────
const courses = [
  ["Tu primer negocio online", "De la idea a la primera venta, paso a paso: qué vender, a quién y cómo cobrar.", "2026-11-17 19:00"],
  ["Redes que venden", "Contenido simple para atraer clientas en Instagram y WhatsApp sin pasarte el día publicando.", "2026-11-24 19:00"],
  ["Ordená tus números", "Ingresos, gastos y precios sin vueltas. Una planilla práctica para saber si tu negocio gana plata.", "2026-12-01 19:00"],
  ["IA para emprendedoras", "Herramientas de inteligencia artificial para escribir, diseñar y responder consultas en menos tiempo.", "2026-12-09 19:00"],
  ["Ponele precio a lo que hacés", "Cómo calcular costos, sumar tu tiempo y dejar de cobrar de menos.", null],
  ["Tu marca en una tarde", "Logo, colores y tono para que tu emprendimiento se reconozca a primera vista.", null],
].map(([title, summary, starts], i) => ({ id: id("de200000", i + 1), title, summary, starts: starts && `${starts}:00-03` }))

// ─── Encuentros ──────────────────────────────────────────────────────────────
const events = [
  ["Café de emprendedoras", "Una mañana para conocernos, contar en qué andamos y armar red.", "Palermo, CABA", null, "2026-11-20 10:00", "2026-11-20 12:00"],
  ["Charla: vender por WhatsApp", "Catálogo, respuestas rápidas y cómo cerrar una venta sin perseguir a nadie.", null, "https://meet.google.com/demo-mxm-charla", "2026-11-26 19:00", "2026-11-26 20:30"],
  ["Espacio de escucha", "Encuentro grupal coordinado por una psicóloga para hablar de lo que cuesta emprender.", null, "https://meet.google.com/demo-mxm-escucha", "2026-12-03 18:30", "2026-12-03 19:30"],
  ["Networking por rubro: gastronomía", "Para las que cocinan y venden: proveedoras, precios y alianzas.", "Rosario, Santa Fe", null, "2026-12-10 18:00", "2026-12-10 20:00"],
  ["Cierre de año Mujeres x Más", "Brindamos por lo que logramos y arrancamos a planear el 2027 juntas.", "Córdoba capital", null, "2026-12-17 19:00", "2026-12-17 22:00"],
].map(([title, summary, location, url, starts, ends], i) => ({
  id: id("de300000", i + 1),
  title,
  summary,
  location,
  url,
  starts: `${starts}:00-03`,
  ends: `${ends}:00-03`,
}))

// ─── Notas del blog ──────────────────────────────────────────────────────────
// Bloques: ["h", texto] subtítulo · ["p", texto] párrafo · ["ul", [items]] lista
const posts = [
  {
    title: "Cómo usar la IA en tu emprendimiento sin ser experta",
    slug: "como-usar-la-ia-en-tu-emprendimiento",
    excerpt: "Tres herramientas gratuitas para ganar tiempo esta misma semana, explicadas sin tecnicismos.",
    category: "tecnologia-e-ia",
    tags: ["ia", "herramientas", "productividad"],
    cover: "/images/home/tecnologia.jpg",
    coverAlt: "Mujer trabajando con una computadora portátil",
    author: "Equipo Mujeres x Más",
    featured: true,
    published: "2026-11-04 09:00",
    blocks: [
      ["p", "La inteligencia artificial no es solo para empresas grandes. Bien usada, te puede ahorrar horas de trabajo cada semana, y no hace falta saber programar."],
      ["h", "1. Para escribir"],
      ["p", "Pedile ideas para publicaciones, descripciones de productos o respuestas a consultas frecuentes. Siempre revisá y ajustá el texto para que suene a vos."],
      ["h", "2. Para diseñar"],
      ["p", "Hay herramientas que arman placas para redes a partir de una frase. Cargá tus colores y tu logo una vez y usalos siempre."],
      ["h", "3. Para ordenarte"],
      ["p", "Contale a la IA qué tenés que hacer en la semana y pedile que te arme un plan por días. Parece poco, pero ordena muchísimo."],
      ["ul", ["Empezá con una sola herramienta", "Usala para una tarea concreta", "Medí cuánto tiempo te ahorra"]],
    ],
  },
  {
    title: "Del Instagram a la tienda propia: qué mirar antes de dar el salto",
    slug: "del-instagram-a-la-tienda-propia",
    excerpt: "Señales de que tu emprendimiento está listo para tener su tienda online y cómo prepararte.",
    category: "emprendimiento",
    tags: ["tienda online", "ventas"],
    cover: "/images/home/emprendimiento.jpg",
    coverAlt: "Emprendedora sonriendo en su taller",
    author: "Equipo Mujeres x Más",
    featured: false,
    published: "2026-10-28 09:00",
    blocks: [
      ["p", "Vender por redes es un gran comienzo, pero llega un momento en que responder precios por mensaje te come el día. Ahí aparece la tienda online."],
      ["h", "Señales de que es el momento"],
      ["ul", ["Te preguntan lo mismo todo el tiempo", "Perdés ventas porque no llegás a responder", "Tenés un catálogo que cambia poco"]],
      ["h", "Antes de empezar"],
      ["p", "Sacá buenas fotos con luz natural, definí tus medios de pago y pensá cómo vas a hacer los envíos. Con eso resuelto, armar la tienda es mucho más fácil."],
    ],
  },
  {
    title: "Ponerle precio a lo que hacés: una guía para dejar de cobrar de menos",
    slug: "ponerle-precio-a-lo-que-haces",
    excerpt: "Costos, tiempo y margen: la cuenta que tenés que hacer antes de publicar un precio.",
    category: "finanzas",
    tags: ["precios", "finanzas", "costos"],
    cover: "/images/home/finanzas.jpg",
    coverAlt: "Manos haciendo cuentas con una calculadora",
    author: "Andrea Ruiz",
    featured: false,
    published: "2026-10-21 09:00",
    blocks: [
      ["p", "Uno de los errores más comunes al emprender es poner el precio mirando a la competencia y no tus números. Vamos paso a paso."],
      ["h", "Sumá todos tus costos"],
      ["p", "Materiales, envases, envíos, comisiones de cobro y una parte de los gastos fijos como internet o el alquiler."],
      ["h", "Tu tiempo también cuesta"],
      ["p", "Calculá cuántas horas te lleva cada producto y ponele un valor a esa hora. Si no lo cobrás, estás trabajando gratis."],
      ["h", "Agregá el margen"],
      ["p", "El margen es lo que le queda a tu negocio para crecer. Sin margen, cualquier imprevisto te deja en rojo."],
    ],
  },
  {
    title: "Cinco ideas de contenido para redes cuando no sabés qué publicar",
    slug: "cinco-ideas-de-contenido-para-redes",
    excerpt: "Un banco de ideas simples para mantener tus redes activas sin quedarte en blanco.",
    category: "comunicacion-y-marketing",
    tags: ["redes", "contenido", "marketing"],
    cover: "/images/home/marketing.jpg",
    coverAlt: "Emprendedora grabando un video con el celular",
    author: "Sol Ramírez",
    featured: false,
    published: "2026-10-14 09:00",
    blocks: [
      ["p", "Publicar seguido no significa publicar cualquier cosa. Estas cinco ideas funcionan para casi cualquier rubro."],
      ["ul", ["Mostrá cómo hacés tu producto", "Contá la historia de tu emprendimiento", "Respondé una pregunta frecuente", "Compartí la opinión de una clienta", "Mostrá un antes y un después"]],
      ["p", "Elegí dos por semana y armá un calendario simple. La constancia vale más que la perfección."],
    ],
  },
  {
    title: "Emprender después de los 40: historias que inspiran",
    slug: "emprender-despues-de-los-40",
    excerpt: "Tres mujeres que se animaron a empezar de nuevo y lo que aprendieron en el camino.",
    category: "formacion",
    tags: ["reinvención", "historias"],
    cover: "/images/home/socias-negocio.jpg",
    coverAlt: "Dos socias conversando sobre su negocio",
    author: "Equipo Mujeres x Más",
    featured: false,
    published: "2026-10-07 09:00",
    blocks: [
      ["p", "Reinventarse no tiene edad. En la comunidad hay cada vez más mujeres que encuentran después de los 40 el impulso para su propio proyecto."],
      ["h", "Lo que tienen en común"],
      ["p", "Experiencia, claridad sobre lo que quieren y una red que las acompaña. Ninguna lo hizo sola."],
      ["h", "Un consejo para empezar"],
      ["p", "Arrancá chico, probá con pocas clientas y ajustá sobre la marcha. Lo importante es dar el primer paso."],
    ],
  },
].map((post, i) => ({ ...post, id: id("de400000", i + 1), published: `${post.published}:00-03` }))

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const text = (t) => [{ type: "text", text: t }]
function toDoc(blocks) {
  return {
    type: "doc",
    content: blocks.map(([kind, value]) =>
      kind === "h"
        ? { type: "heading", attrs: { level: 2 }, content: text(value) }
        : kind === "p"
          ? { type: "paragraph", content: text(value) }
          : {
              type: "bulletList",
              content: value.map((item) => ({ type: "listItem", content: [{ type: "paragraph", content: text(item) }] })),
            }
    ),
  }
}
function toHtml(blocks) {
  return blocks
    .map(([kind, value]) =>
      kind === "h"
        ? `<h2>${esc(value)}</h2>`
        : kind === "p"
          ? `<p>${esc(value)}</p>`
          : `<ul>${value.map((item) => `<li><p>${esc(item)}</p></li>`).join("")}</ul>`
    )
    .join("")
}
const words = (blocks) => blocks.flatMap(([, v]) => (Array.isArray(v) ? v : [v])).join(" ").split(/\s+/).length

// ─── Comentarios: [nota, usuaria, fecha, texto] ──────────────────────────────
const comments = [
  [0, 0, "2026-11-04 12:30", "¡Qué buena nota! Probé lo de pedirle ideas para las publicaciones y me salvó la semana."],
  [0, 2, "2026-11-04 15:10", "Yo uso la IA para las descripciones de productos y después las ajusto. Ahorro un montón de tiempo."],
  [0, 5, "2026-11-05 09:45", "Me da un poco de miedo empezar, pero con esta explicación me animo. ¿Alguna herramienta gratis para diseñar?"],
  [0, 7, "2026-11-06 20:05", "Lo del plan semanal lo voy a probar hoy mismo. Gracias por compartirlo."],
  [1, 3, "2026-10-28 18:20", "Me pasa exactamente eso de responder precios todo el día. Creo que es momento de la tienda."],
  [1, 0, "2026-10-29 10:00", "Yo hice el salto el año pasado y fue lo mejor que me pasó. Las fotos con luz natural hacen la diferencia."],
  [1, 6, "2026-10-30 22:15", "¿Qué medios de pago recomiendan para arrancar?"],
  [2, 1, "2026-10-21 14:40", "Nunca había sumado mi tiempo en el precio. Hice la cuenta y estaba cobrando de menos."],
  [2, 4, "2026-10-22 11:25", "Muy clara la explicación del margen. La voy a compartir con mis socias."],
  [2, 7, "2026-10-23 17:50", "Como contadora, confirmo: el margen es lo que te salva cuando hay imprevistos."],
  [3, 2, "2026-10-14 19:30", "Mostrar cómo hago mis productos fue lo que más me funcionó en Instagram."],
  [3, 5, "2026-10-16 08:55", "Me guardo la lista. Siempre me quedo en blanco los lunes."],
  [4, 4, "2026-10-08 13:15", "Arranqué a los 47 y me siento identificada con cada palabra. ¡Gracias!"],
  [4, 1, "2026-10-09 21:40", "Hermosa nota. Que se sepa que nunca es tarde."],
].map(([post, user, at, body], i) => ({ id: id("de500000", i + 1), post: posts[post].id, user: users[user].id, at: `${at}:00-03`, body }))

// ─── Notificaciones para todas ───────────────────────────────────────────────
const notifications = [
  ["¡Bienvenida a la nueva etapa!", "Ya podés recorrer los tres pilares: Desarrollo, Bienestar y Conexión.", "/", "2026-11-05 10:00"],
  ["Nuevo curso: Redes que venden", "Empieza el 24 de noviembre. Anotate desde Mi cuenta.", "/mi-cuenta", "2026-11-08 12:00"],
  ["Café de emprendedoras", "Te esperamos el 20 de noviembre en Palermo para conocernos.", "/mi-cuenta", "2026-11-10 09:30"],
].map(([title, body, link, at], i) => ({ id: id("de600000", i + 1), title, body, link, at: `${at}:00-03` }))

// ─── SQL ─────────────────────────────────────────────────────────────────────
const L = []
L.push(`-- Datos de prueba para mostrar el sitio: usuarias, cursos, encuentros, notas del blog, comentarios y
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
) values`)
L.push(
  users
    .map(
      (u) =>
        `  ('00000000-0000-0000-0000-000000000000', ${q(u.id)}, 'authenticated', 'authenticated', ${q(u.email)}, '', ${q(u.joined)},
   '', '', '', '', '{"provider":"email","providers":["email"]}', ${q(JSON.stringify({ first_name: u.first, last_name: u.last }))}, ${q(u.joined)}, ${q(u.joined)})`
    )
    .join(",\n") + "\non conflict (id) do nothing;\n"
)
L.push(`update public.profiles p set city = d.city, business_name = d.business, created_at = d.joined
from (values
${users.map((u) => `  (${q(u.id)}::uuid, ${q(u.city)}, ${q(u.business)}, ${q(u.joined)}::timestamptz)`).join(",\n")}
) as d(id, city, business, joined)
where p.id = d.id;

-- Algunas con el plan pago
update public.memberships set plan_id = 'crecimiento'
where status = 'active' and user_id in (${users.filter((u) => u.plan === "crecimiento").map((u) => q(u.id)).join(", ")});

-- Cursos -----------------------------------------------------------------------
insert into public.courses (id, title, summary, status, starts_at) values
${courses.map((c) => `  (${q(c.id)}, ${q(c.title)}, ${q(c.summary)}, 'published', ${c.starts ? q(c.starts) : "null"})`).join(",\n")}
on conflict (id) do nothing;

-- Encuentros -------------------------------------------------------------------
insert into public.events (id, title, summary, location, online_url, status, starts_at, ends_at) values
${events.map((e) => `  (${q(e.id)}, ${q(e.title)}, ${q(e.summary)}, ${q(e.location)}, ${q(e.url)}, 'published', ${q(e.starts)}, ${q(e.ends)})`).join(",\n")}
on conflict (id) do nothing;

-- Inscripciones: cada usuaria de prueba en algunos, y las administradoras en todos
insert into public.course_enrollments (course_id, user_id)
select c.id, u.id
from (values ${courses.map((c) => `(${q(c.id)}::uuid)`).join(", ")}) as c(id)
cross join (values ${users.map((u) => `(${q(u.id)}::uuid)`).join(", ")}) as u(id)
where (('x' || substr(md5(c.id::text || u.id::text), 1, 2))::bit(8)::int) % 3 = 0
on conflict do nothing;

insert into public.course_enrollments (course_id, user_id)
select c.id, a.user_id
from (values ${courses.slice(0, 4).map((c) => `(${q(c.id)}::uuid)`).join(", ")}) as c(id)
cross join public.admins a
on conflict do nothing;

insert into public.event_registrations (event_id, user_id)
select e.id, u.id
from (values ${events.map((e) => `(${q(e.id)}::uuid)`).join(", ")}) as e(id)
cross join (values ${users.map((u) => `(${q(u.id)}::uuid)`).join(", ")}) as u(id)
where (('x' || substr(md5(e.id::text || u.id::text), 1, 2))::bit(8)::int) % 2 = 0
on conflict do nothing;

insert into public.event_registrations (event_id, user_id)
select e.id, a.user_id
from (values ${events.slice(0, 3).map((e) => `(${q(e.id)}::uuid)`).join(", ")}) as e(id)
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
${posts
  .map(
    (p) =>
      `  (${q(p.id)}::uuid, ${q(p.title)}, ${q(p.slug)}, ${q(p.excerpt)}, ${q(JSON.stringify(toDoc(p.blocks)))}, ${q(toHtml(p.blocks))}, ${Math.max(1, Math.round(words(p.blocks) / 200))}, ${q(p.category)}, array[${p.tags.map(q).join(", ")}]::text[], ${q(p.cover)}, ${q(p.coverAlt)}, ${q(p.author)}, ${p.featured}, ${q(p.published)}::timestamptz)`
  )
  .join(",\n")}
) as d(id, title, slug, excerpt, content, html, minutes, category_slug, tags, cover, cover_alt, author, featured, published_at)
join public.blog_categories cat on cat.slug = d.category_slug
on conflict (id) do nothing;

-- Comentarios ------------------------------------------------------------------
-- Sin los triggers de aviso y de límite: si no, cada comentario le manda una notificación a las
-- administradoras y el límite frena varios comentarios seguidos de la misma usuaria.
alter table public.blog_comments disable trigger blog_comments_notify_admins;
alter table public.blog_comments disable trigger blog_comments_limit_rate;

insert into public.blog_comments (id, post_id, user_id, body, created_at) values
${comments.map((c) => `  (${q(c.id)}, ${q(c.post)}, ${q(c.user)}, ${q(c.body)}, ${q(c.at)})`).join(",\n")}
on conflict (id) do nothing;

alter table public.blog_comments enable trigger blog_comments_notify_admins;
alter table public.blog_comments enable trigger blog_comments_limit_rate;

-- Notificaciones para todas ----------------------------------------------------
insert into public.notifications (id, user_id, title, body, link, created_at) values
${notifications.map((n) => `  (${q(n.id)}, null, ${q(n.title)}, ${q(n.body)}, ${q(n.link)}, ${q(n.at)})`).join(",\n")}
on conflict (id) do nothing;

commit;
`)

const cleanup = `-- Borra todo lo que cargó datos-de-prueba.sql. Se pega en el SQL Editor de Supabase.
-- Solo toca filas de prueba: las identifica por su id fijo o por el correo ${EMAIL_SUFFIX}.

begin;

delete from public.notifications where id in (${notifications.map((n) => q(n.id)).join(", ")});
delete from public.blog_comments where id in (${comments.map((c) => q(c.id)).join(", ")});
delete from public.blog_posts where id in (${posts.map((p) => q(p.id)).join(", ")});
delete from public.events where id in (${events.map((e) => q(e.id)).join(", ")});
delete from public.courses where id in (${courses.map((c) => q(c.id)).join(", ")});

-- Al borrar las usuarias se van sus perfiles, membresías, comentarios e inscripciones
delete from auth.users where email like ${q("%" + EMAIL_SUFFIX)};

commit;
`

fs.mkdirSync("supabase/demo", { recursive: true })
fs.writeFileSync("supabase/demo/datos-de-prueba.sql", L.join("\n"))
fs.writeFileSync("supabase/demo/borrar-datos-de-prueba.sql", cleanup)
console.log("ok", L.join("\n").length, cleanup.length)
