# Funciones MVP – Mujeres x Más

> [!IMPORTANT]
> **Reglas de este documento (para Claude):**
> - Claude **no escribe contenido propio** en este documento.
> - Solo agrega las funciones que le dicta la persona a cargo del proyecto, y ayuda a adaptarlas y redactarlas. Cada función se agrega recién cuando esa persona aprueba el texto.
> - El único cambio que Claude hace por su cuenta es **actualizar el estado** de cada función a medida que avanza el desarrollo.
> - No se borran funciones. Si una cambia o se descarta, se decide con la persona a cargo del proyecto.

## Estados

| Estado | Significado |
| --- | --- |
| ⏳ Pendiente | Todavía no se empezó o está en desarrollo |
| ✅ Completo | Implementada, verificada y subida al repo |
| ❌ Error | Implementada pero con una falla conocida, o bloqueada (se anota el motivo) |

## Funciones

| # | Función | Descripción | Estado | Notas |
| --- | --- | --- | --- | --- |
| 1 | Landing principal | Home con todas sus secciones y la CTA "Registrarme en Mujeres x Más" visible en todo el recorrido (header fijo y botón flotante en celular). Incluye la CTA secundaria "Conocé QUIERO". | ⏳ Pendiente | Textos, imágenes y colores los entrega la clienta. |
| 2 | Landing QUIERO | Landing del producto con botón "QUIERO". Usuaria sin sesión → registro; con sesión → solicitud del producto. | ⏳ Pendiente | Definir con la clienta el destino exacto con sesión iniciada. |
| 3 | Registro | Alta con email y contraseña, con validación de datos. La cuenta se activa al confirmar el email desde el link de verificación. | ✅ Completo | Para el sitio publicado falta la configuración de Auth de [docs/CONFIGURACION-SUPABASE-AUTH.md](CONFIGURACION-SUPABASE-AUTH.md). |
| 4 | Login, logout y recuperación de contraseña | Iniciar y cerrar sesión, y restablecer la contraseña mediante un link por email. | ✅ Completo | |
| 5 | Membresía Gratis automática | Al registrarse, un trigger en la base de datos asigna el plan Gratis. La tabla de planes queda creada con los 3 planes; los 2 pagos inactivos hasta la etapa 2. | ✅ Completo | |
| 6 | Emails con la identidad de la marca | Email de bienvenida con la marca, enviado al confirmar la cuenta. Los emails de verificación y recuperación de contraseña también con la marca y desde el dominio propio. | ⏳ Pendiente | Listas las plantillas de verificación y recuperación. Falta el email de bienvenida y el envío desde el dominio propio. |
| 7 | Mi Cuenta | Panel de la usuaria con sus datos y la membresía activa. Espacios preparados para cursos, eventos y notificaciones, con estado vacío amigable. | ✅ Completo | |
| 8 | Editar perfil | Editar nombre, apellido, teléfono, ciudad, emprendimiento y foto de perfil. La foto se guarda en Supabase Storage con límite de tamaño y formatos. | ✅ Completo | |
| 9 | Diseño responsive | Todo el sitio diseñado primero para celular y adaptado a tablet y escritorio. | ⏳ Pendiente | |
| 10 | SEO | Título y descripción por página, Open Graph para compartir en redes, sitemap.xml y robots.txt. | ⏳ Pendiente | Listos los títulos por página. Falta Open Graph, sitemap.xml y robots.txt. |
| 11 | Analítica | Medición de visitas y de registros completados como conversión. | ⏳ Pendiente | Con Google Analytics 4. |
| 12 | Deploy en producción | Publicación en Vercel con el dominio mujeresxmas.com y las variables de entorno de producción. | ⏳ Pendiente | Se hace en las cuentas finales de la clienta. |
| 13 | Panel de administración | Panel solo para administradoras, con el total de usuarias, las nuevas del último mes y la lista completa con buscador (datos, plan, fecha de alta y último ingreso). Incluye el modo "Ver como usuaria" para recorrer el sitio como una cuenta común sin cerrar sesión. | ✅ Completo | Por ahora la única administradora es alejuanfacu@gmail.com. Cómo dar o quitar el acceso: [docs/ADMINISTRADORAS.md](ADMINISTRADORAS.md). |
| 14 | Cursos y eventos | Secciones de Cursos y Eventos en el panel de administración, con su lista y estado (borrador, publicado o archivado). En Mi Cuenta, cada usuario ve sus cursos y sus próximos eventos. | ⏳ Pendiente | Listas las tablas, los permisos y las listas. Falta crear cursos y eventos desde el panel: los botones dicen "Próximamente". |
| 15 | Notificaciones | Desde el panel se envían notificaciones. Cada usuario las ve en Mi Cuenta, puede marcarlas como leídas y tiene un punto de aviso y un contador en el menú de su cuenta. | ✅ Completo | |
| 16 | Avisos flotantes | Los mensajes de los formularios y de las notificaciones nuevas aparecen en una ventana fija abajo a la derecha, con Animated List de Magic UI. Se cierran solos o con la X. | ✅ Completo | |
| 17 | Footer | Los pilares en movimiento, logo y links. | ✅ Completo | Las redes aparecen solas cuando se cargan en `src/config/site.ts`. Faltan los links de la clienta. |
| 18 | Componentes e íconos animados | Componentes de Magic UI en todo el sitio con los colores de la marca, y todos los íconos animados con Lucide Animated. | ✅ Completo | |
| 19 | Reducir movimiento | Si la persona tiene activada esa opción en su sistema, se simplifican las animaciones y no aparecen partículas ni confeti. | ⏳ Pendiente | Implementada. Falta probarla con la opción activada. |
