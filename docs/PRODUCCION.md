# Pasar a producción

Lista de lo que falta para publicar el sitio en las cuentas de la clienta, con el dominio
`mujeresxmas.com`. Hoy el sitio corre en cuentas de prueba (Supabase, Vercel) en
`https://mujeresxmas.vercel.app`.

Cada punto dice **quién** lo resuelve: el equipo (programación), la clienta, o un tercero
(Kiero, Pay per TIC). Marcá cada casilla a medida que se completa.

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
- [ ] **SMTP propio con Resend** (Authentication → Emails → SMTP Settings). Sin esto, el correo de Supabase solo llega al equipo y tiene un límite muy bajo: **el registro no funciona para el público**.

## 4. Correos (Resend)

- [ ] Verificar el dominio `mujeresxmas.com` en Resend (registros SPF, DKIM y DMARC en el DNS). — clienta carga los DNS, equipo pasa los valores
- [ ] Definir el remitente, por ejemplo `Mujeres x Más <hola@mujeresxmas.com>`. — clienta
- [ ] Correo de **bienvenida** al confirmar la cuenta (función 6 del MVP): falta programarlo. — equipo

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
| `EMAIL_FROM` | Remitente verificado | Punto 4 |
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
