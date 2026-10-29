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
| 3 | Registro | Alta con email y contraseña, con validación de datos. La cuenta se activa al confirmar el email desde el link de verificación. | ⏳ Pendiente | |
| 4 | Login, logout y recuperación de contraseña | Iniciar y cerrar sesión, y restablecer la contraseña mediante un link por email. | ⏳ Pendiente | |
| 5 | Membresía Gratis automática | Al registrarse, un trigger en la base de datos asigna el plan Gratis. La tabla de planes queda creada con los 3 planes; los 2 pagos inactivos hasta la etapa 2. | ✅ Completo | |
| 6 | Emails con la identidad de la marca | Email de bienvenida con la marca, enviado al confirmar la cuenta. Los emails de verificación y recuperación de contraseña también con la marca y desde el dominio propio. | ⏳ Pendiente | |
| 7 | Mi Cuenta | Panel de la usuaria con sus datos y la membresía activa. Espacios preparados para cursos, eventos y notificaciones, con estado vacío amigable. | ✅ Completo | |
| 8 | Editar perfil | Editar nombre, apellido, teléfono, ciudad, emprendimiento y foto de perfil. La foto se guarda en Supabase Storage con límite de tamaño y formatos. | ⏳ Pendiente | |
| 9 | Diseño responsive | Todo el sitio diseñado primero para celular y adaptado a tablet y escritorio. | ⏳ Pendiente | |
| 10 | SEO | Título y descripción por página, Open Graph para compartir en redes, sitemap.xml y robots.txt. | ⏳ Pendiente | |
| 11 | Analítica | Medición de visitas y de registros completados como conversión. | ⏳ Pendiente | Elegir entre Vercel Analytics y Google Analytics 4. |
| 12 | Deploy en producción | Publicación en Vercel con el dominio mujeresxmas.com y las variables de entorno de producción. | ⏳ Pendiente | Se hace en las cuentas finales de la clienta. |
