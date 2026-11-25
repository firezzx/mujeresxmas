# Pasar a producción

Lista de lo que falta para publicar el sitio en las cuentas de la clienta, con el dominio
`mujeresxmas.com`. Hoy el sitio corre en cuentas de prueba (Supabase, Vercel) en
`https://mujeresxmas.vercel.app`.

Cada punto dice **quién** lo resuelve: el equipo (programación), la clienta, o un tercero
(Kiero, Pay per TIC). Marcá cada casilla a medida que se completa.

---

## 0. Estado actual (actualizado el 13/11/2026)

Resumen rápido para no perder el hilo. El detalle de cada punto está más abajo.

### Funciona hoy en prueba (`mujeresxmas.vercel.app`)

- **Inicio** completo: portada con retratos en profundidad, pilares, planes, lo que hay adentro,
  cursos, Kiero (maqueta de la app en dos celulares), notas, voces y eventos.
- **Registro, ingreso, cierre de sesión y recuperación de contraseña**, con confirmación por correo
  (sale por el SMTP de Hostinger de `micuenta@mujeresxmas.com`, configurado en Supabase el 25/11/2026).
- **Plan Comunidad automático** al registrarse.
- **Mi cuenta** y **editar perfil** con foto.
- **Membresía** (`/membresia`): elegí tu momento, planes con el recomendado resaltado, comparación y
  preguntas frecuentes animadas. `/planes` redirige acá.
- **Empresas** (`/empresas`): propuestas por tipo de organización y formulario que guarda el pedido;
  las administradoras lo ven en `/admin/empresas`.
- **Kiero** (`/kiero`) y activación de la tienda en **modo prueba**: todo simulado, no toca la API real.
- **Panel de administración**: usuarias, planes editables, notificaciones, blog con comentarios,
  altas y bajas de Kiero (simuladas) y pedidos de empresas.
- **Blog** con búsqueda, comentarios y avisos.
- **Notificaciones** y avisos flotantes.

### Pendiente en el entorno de prueba

- [ ] **Modo solo registro activo** (`SITE_MODE` vacío): el público solo ve `/sumate` y `/baja`; el
  resto redirige a `/sumate`. Las administradoras entran por `/admin` y con sesión ven todo. Para el
  lanzamiento, cargar `SITE_MODE=abierto` en Vercel y volver a desplegar (`src/config/site-mode.ts`). — equipo

- [ ] **Correos con el SMTP de Hostinger** (agradecimiento de `/sumate` y envíos masivos de `/admin/contactos`):
  con una casilla del dominio de la clienta. Cargar en `.env.local` y en Vercel `EMAIL_PROVIDER=smtp`,
  `SMTP_HOST=smtp.hostinger.com`, `SMTP_PORT=465`, `SMTP_USER` (la casilla completa), `SMTP_PASSWORD` y
  `EMAIL_FROM` con esa misma casilla. Hostinger limita la cantidad de correos por día según el plan de la
  casilla: para envíos masivos grandes conviene Brevo o Resend con el dominio autenticado. — equipo
  Con el mismo SMTP salen el **correo de bienvenida** (al confirmar la cuenta) y los **avisos al equipo**
  (registro en `/sumate` y pedido de empresa) a la casilla de `ADMIN_NOTIFY_EMAIL`. Los textos están en
  `src/content/correos.ts`.

- [x] **SMTP de Hostinger en Supabase** para la confirmación de cuenta y la recuperación de contraseña,
  con las plantillas de `supabase/templates`. Site URL `https://mujeresxmas.vercel.app` y Redirect URLs
  `https://mujeresxmas.vercel.app/**` y `http://localhost:3000/**`. Al conectar el dominio, cambiarlos
  como dice el punto 3.

### Hallazgos del análisis del código (17/11/2026)

Cosas que el sitio todavía no hace, aunque parezca que sí:

- [ ] **Casi ningún correo propio sale del sitio.** Brevo (o Resend) solo se usa para el agradecimiento de `/sumate`
  y los correos masivos de `/admin/contactos` (`src/lib/email.ts`). Los demás son los de Supabase (confirmación y
  recuperación). Falta: bienvenida, aviso de pedido de empresa y, más
  adelante, avisos de pago. — equipo
- [ ] **`SUPABASE_SECRET_KEY` no se usa**: se puede dejar de pedir o reservarla para los avisos de
  pago (punto 7), que necesitan escribir sin sesión. — equipo
- [ ] **Sin página de error**: falta `error.tsx` y `global-error.tsx`; si algo falla se ve la
  pantalla genérica de Next. — equipo
- [ ] **Sin imagen para compartir**: solo las notas del blog tienen Open Graph; el resto de las
  páginas se comparte sin foto ni descripción propia. — equipo
- [ ] **Sin analítica** (GA4 o Vercel Analytics). — equipo, con la cuenta de la clienta
- [ ] **Sin protección contra bots** en registro y Empresas más allá del campo trampa. Conviene
  sumar Cloudflare Turnstile (gratis) en Supabase Auth y en el formulario. — equipo
- [ ] **`supabase/config.toml`** tiene `site_url` y redirects en `localhost`: es la configuración
  local; la de producción se carga en el panel (punto 3), pero dejarla documentada. — equipo
- [ ] **Crear cursos y eventos** en el panel sigue en "Próximamente". — equipo
- [ ] **Redes del pie vacías** (`SOCIAL_LINKS` en `src/config/site.ts`). — clienta pasa los links
- [ ] **Sin páginas legales** (términos y privacidad). — clienta con su asesoría

### Falta para producción (lo más importante)

1. Cuentas a nombre de la clienta y dominio (punto 1).
2. SMTP propio en Supabase (Hostinger, Brevo o Resend): **sin esto el registro no funciona para el público** (puntos 3 y 4).
3. Cobros con Pay per TIC: hoy Crecer dice "Próximamente" (punto 7).
4. Kiero en modo real: falta que Kiero confirme API key, entorno de prueba e invitaciones (punto 8).
5. Textos marcados para completar en Membresía y Empresas, y textos y fotos definitivos (punto 9).
6. Términos y condiciones y política de privacidad (punto 11).

---

## 1. Cuentas a nombre de la clienta

- [ ] **Supabase:** proyecto nuevo en la organización de la clienta. — clienta crea la cuenta, equipo configura
- [ ] **Vercel:** proyecto en la cuenta o el equipo de la clienta, conectado al repositorio. — clienta crea la cuenta, equipo configura
- [ ] **GitHub:** pasar el repositorio a la clienta o darle acceso de administradora. — equipo
- [ ] **Resend:** cuenta para los correos, con el dominio verificado (punto 4). — clienta crea la cuenta
- [ ] **Dominio `mujeresxmas.com`:** acceso al panel del proveedor del dominio para cargar los registros DNS. — clienta

## 2. Base de datos (Supabase de la clienta)

Las migraciones están en `supabase/migrations`. Se aplican **en orden** pegando cada archivo en el
SQL Editor, o con `supabase db push` desde una red que lo permita.

- [ ] Correr todas las migraciones, de la más vieja a la más nueva:
  1. `20261029190000_perfiles_y_membresias.sql`
  2. `20261029190100_storage_avatars.sql`
  3. `20261030120000_administradoras.sql`
  4. `20261030180000_cursos_eventos_notificaciones.sql`
  5. `20261104120000_blog.sql`
  6. `20261104180000_blog_comentarios.sql`
  7. `20261104210000_blog_busqueda_y_avisos.sql`
  8. `20261105120000_ultimas_registradas.sql`
  9. `20261105130000_planes_definitivos.sql`
  10. `20261105140000_planes_editables.sql`
  11. `20261112120000_planes_inicio_crecer.sql`
  12. `20261113120000_cuentas_kiero.sql`
  13. `20261113150000_membresias_y_empresas.sql`
- [ ] **No** cargar los datos de prueba (`supabase/demo`). Ver [DATOS-DE-PRUEBA.md](DATOS-DE-PRUEBA.md).
- [ ] Dar de alta a las administradoras reales (tienen que registrarse primero). Ver [ADMINISTRADORAS.md](ADMINISTRADORAS.md). — clienta dice quiénes, equipo las carga
- [ ] Sacar la cuenta del equipo de diseño de las administradoras, si ya no hace falta.
- [ ] Revisar nombres, precios y beneficios de los planes desde `/admin/planes`. — clienta

## 3. Autenticación (Supabase → Authentication)

Todo el detalle está en [CONFIGURACION-SUPABASE-AUTH.md](CONFIGURACION-SUPABASE-AUTH.md). Resumen:

- [ ] **Site URL:** `https://mujeresxmas.com`.
- [ ] **Redirect URLs:** `https://mujeresxmas.com/**`, `https://www.mujeresxmas.com/**` y las previews del equipo de Vercel de la clienta.
- [ ] Reglas de contraseña, confirmación de correo y límites como dice el documento.
- [ ] Plantillas de **confirmación** y **recuperación** (`supabase/templates`).
- [ ] **SMTP propio** (Authentication → Emails → SMTP Settings → Enable custom SMTP). Con Hostinger:
  host `smtp.hostinger.com`, puerto `465`, usuario y contraseña de la casilla, remitente con esa misma
  casilla y nombre `Mujeres x Más`. Las plantillas se pegan en Authentication → Emails → Templates:
  "Confirm signup" con `supabase/templates/confirmacion.html` y "Reset password" con
  `supabase/templates/recuperacion.html` (asuntos en `supabase/config.toml`). Sin esto, el correo de Supabase solo llega al equipo y tiene un límite muy bajo: **el registro no funciona para el público**.

## 4. Correos (Resend)

- [ ] Verificar el dominio `mujeresxmas.com` en Resend (registros SPF, DKIM y DMARC en el DNS). — clienta carga los DNS, equipo pasa los valores
- [ ] Definir el remitente, por ejemplo `Mujeres x Más <hola@mujeresxmas.com>`. — clienta
- [x] Correo de **bienvenida** al confirmar la cuenta (función 6 del MVP): sale desde `/auth/confirm` con el proveedor de `EMAIL_PROVIDER`.
- [ ] Con el dominio verificado, cambiar `EMAIL_FROM` al remitente real: recién ahí los correos
  masivos de `/admin/contactos` y el agradecimiento de `/sumate` llegan a todas. Cada correo lleva el link de baja (`/baja`).
  Si la lista pasa de unos miles de personas, conviene pasar a Resend Broadcasts o a envíos en
  segundo plano (hoy salen en tandas de 100 dentro de la misma acción). — equipo

## 5. Vercel y dominio

- [ ] Cargar las variables de entorno de producción (punto 6).
- [ ] Conectar `mujeresxmas.com` y `www.mujeresxmas.com` (uno redirige al otro).
- [ ] Revisar que el primer deploy compile y que el sitio cargue con el dominio.

## 6. Variables de entorno

Todas están documentadas en `.env.example`. En producción:

| Variable | Valor en producción | De dónde sale |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de la clienta | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave pública del proyecto | Supabase → Project Settings → API |
| `SUPABASE_SECRET_KEY` | Clave secreta (solo servidor) | Supabase → Project Settings → API |
| `RESEND_API_KEY` | Clave de Resend | Resend → API Keys |
| `EMAIL_PROVIDER` | `smtp`, `brevo` o `resend` | Equipo |
| `SMTP_HOST` / `SMTP_PORT` | `smtp.hostinger.com` y `465` | Hostinger → Correos → Configuración |
| `SMTP_USER` / `SMTP_PASSWORD` | Casilla del dominio y su contraseña (solo servidor) | Hostinger → Correos |
| `BREVO_API_KEY` | Clave de Brevo para los correos | Brevo → SMTP y API → Claves API |
| `SITE_MODE` | Vacío = solo registro (`/sumate`); `abierto` = sitio completo | Equipo, al lanzar |
| `EMAIL_FROM` | Remitente verificado | Punto 4 |
| `ADMIN_NOTIFY_EMAIL` | Casilla del equipo que recibe los avisos | Clienta |
| `NEXT_PUBLIC_SITE_URL` | `https://mujeresxmas.com` | — |
| `SHOW_SAMPLE_CONTENT` | **Vacía** (si no, se ven cursos, notas y voces de ejemplo) | — |
| `KIERO_MODE` | `live` solo cuando Kiero confirme todo (punto 8) | — |
| `KIERO_API_KEY` | Clave de la API de partners | Admin de Kiero → PartnerProgram |
| `KIERO_API_URL` | Vacía, salvo que Kiero indique otra | Kiero |
| `KIERO_INVITE_URL` | Link de invitación con `{token}`, si Kiero lo usa | Kiero |

Cuando estén los cobros se suman las credenciales de Pay per TIC (punto 7).

## 7. Cobros con Pay per TIC (plan Crecer)

Hoy el plan Crecer muestra **"Próximamente"**: no se puede contratar desde el sitio.

- [ ] Credenciales de Pay per TIC a nombre de la clienta. — clienta con Pay per TIC
- [ ] Resolver con el ejecutivo de cuenta: cómo es el primer cobro y la recurrencia, si la adhesión es obligatoria y cómo se cancela. — clienta con Pay per TIC
- [ ] Programar la suscripción: el primer mes se cobra al suscribirse y el plan se activa cuando se aprueba ese pago. — equipo
- [ ] Recibir las notificaciones de pago y confirmar cada estado consultando la API antes de activar un plan. — equipo
- [ ] Bajar el plan al cancelar o si deja de pagar. — equipo
- [ ] Probar todo en el entorno de prueba de Pay per TIC antes de cobrar de verdad.

## 8. Kiero (tienda online incluida en Crecer)

La integración está programada y publicada en **modo prueba**: el sitio simula las respuestas y
**no se conecta con Kiero**. Las administradoras ya pueden dar de alta y de baja desde `/admin`, y
las socias con Crecer pueden activar su tienda desde `/kiero/solicitud`, siempre de forma simulada.

Antes de pasar a `KIERO_MODE=live`, confirmar con Kiero:

- [ ] La **API key** del PartnerProgram de la clienta.
- [ ] Si tienen un **entorno de prueba** para probar sin crear cuentas reales.
- [ ] **Quién manda el mail de invitación**: Kiero, o el sitio arma el link con el token (`KIERO_INVITE_URL`).
- [ ] Qué **estados** devuelve la API (para mostrarlos bien en el sitio).
- [ ] Cuándo se hace efectiva la **suspensión** al dar de baja (por ejemplo, al final del mes pagado).

Después, con el equipo:

- [ ] Dar de alta en Kiero automáticamente cuando se apruebe el pago de Crecer, y de baja al cancelar (depende del punto 7).
- [ ] Borrar las altas simuladas que hayan quedado en la tabla `kiero_accounts` (las de prueba tienen un token que empieza con `prueba-`).

## 9. Contenido de la clienta

Los textos y las imágenes de hoy son provisorios (están en `src/content`).

- [ ] Textos definitivos de la home, los pilares, los planes y Kiero. — clienta
- [ ] Fotos propias para reemplazar las de Pexels (lista en [IMAGENES-PEXELS.md](IMAGENES-PEXELS.md)). — clienta
- [ ] Archivos originales del logo **mx+** y del **sello** (hoy son reconstrucciones del manual), y el favicon. — clienta
- [ ] Cargar cursos, eventos y notas reales desde el panel. Crear cursos y eventos desde el panel todavía dice "Próximamente" (función 14). — equipo programa, clienta carga
- [ ] Datos de contacto y redes del pie. — clienta
- [ ] **Textos entre corchetes** en `src/content/membresia.ts` y `src/content/empresas.ts`: `[FECHA]`,
  `[MEDIOS DE PAGO]`, `[TIPO DE FACTURA]`, `[PAÍSES]`, `[N]`, `[PRECIO]` y `[DATO]`. Buscarlos y
  reemplazarlos antes de publicar. — clienta pasa los datos, equipo los carga
- [ ] **Confirmar si la tienda online está incluida en Crecer o es un adicional** ($49.900/mes): en
  algunos textos figura como adicional y en otros como incluida. — clienta
- [ ] **Precio y fecha del plan Impulso** (hoy sin precio, se muestra como próximamente). — clienta
- [ ] **Maqueta de Kiero en el inicio**: los nombres de productos, precios y cifras de ventas son de
  ejemplo (`HOME_PRODUCT.home.app` en `src/content/home.ts`). Si hay capturas de la app real, usar
  esas pantallas o ajustar la maqueta para que se parezca. Las fotos de productos son recortes de
  fotos de Pexels (`public/images/home/productos`). — clienta pasa capturas, equipo ajusta
- [ ] **Pedidos de empresas**: hoy solo quedan en `/admin/empresas`. Definir si además tienen que
  llegar por correo y a qué dirección (necesita Resend, punto 4). — clienta define, equipo programa
- [ ] **Página de registro `/sumate` y correo de agradecimiento**: revisar los textos en
  `src/content/sumate.ts` (`SIGNUP_PAGE` y `THANK_YOU_EMAIL`). La página no está en el menú y no
  muestra header ni footer: se comparte por link. — clienta revisa, equipo ajusta

## 10. Lo que falta del MVP

Según [FUNCIONES-MVP.md](FUNCIONES-MVP.md), siguen pendientes:

- [ ] **6.** Correo de bienvenida y envío desde el dominio propio.
- [ ] **10.** Open Graph en todas las páginas (hoy solo en las notas del blog) y revisar el sitemap y robots con el dominio final.
- [ ] **11.** Analítica con Google Analytics 4: visitas y registros como conversión. Necesita la cuenta de GA4 de la clienta.
- [ ] **12.** Deploy en producción (este documento).
- [ ] **14.** Crear cursos y eventos desde el panel.
- [ ] **19.** Probar el modo de movimiento reducido.
- [ ] **2.** Definir con la clienta el destino del botón de Kiero con la sesión iniciada (hoy lleva a `/kiero/solicitud`).

## 11. Legal

- [ ] Términos y condiciones, y política de privacidad (piden datos personales en el registro y van a cobrar). — clienta (con su asesoría)
- [ ] Linkearlos en el registro y en el pie. — equipo

## 12. Revisión final antes de anunciar

- [ ] Registrarse con un correo nuevo, confirmar la cuenta y recuperar la contraseña.
- [ ] Completar el perfil y subir una foto.
- [ ] Probar el panel de administración con una cuenta administradora.
- [ ] Revisar el sitio en celular, tablet y escritorio.
- [ ] Revisar que no se vea ningún contenido de ejemplo.
- [ ] Compartir un link en WhatsApp y redes para ver la vista previa.
