# Configuración de Supabase Auth (proyecto en la nube)

`supabase/config.toml` guarda esta configuración para el entorno local. En el proyecto de la nube
hay que cargarla a mano en el dashboard, y repetirla al pasar el proyecto a la cuenta de la clienta.

## 1. URLs (Authentication → URL Configuration)

- **Site URL:** la URL de producción, p. ej. `https://mujeresxmas.vercel.app` (después `https://mujeresxmas.com`).
- **Redirect URLs:**
  - `http://localhost:3000/**`
  - `https://mujeresxmas.vercel.app/**`
  - `https://*-firezx.vercel.app/**` (previews de Vercel; cambiar `firezx` por el equipo de Vercel que corresponda)
  - `https://mujeresxmas.com/**` (cuando esté el dominio)

## 2. Contraseñas y correo (Authentication → Sign In / Providers → Email)

- **Confirm email:** activado.
- **Secure email change:** activado.
- **Secure password change:** activado.
- **Minimum password length:** 8.
- **Password requirements:** letras y números (`letters_digits`).
- **Email OTP expiration:** 3600 segundos.

Estas reglas tienen que coincidir con `src/lib/validations/auth.ts`.

## 3. Rate limits (Authentication → Rate Limits)

- Intervalo mínimo entre correos de confirmación o recuperación: **60 segundos**
  (coincide con la espera del botón "Reenviar el correo").

## 4. Plantilla del correo de confirmación (Authentication → Emails → Confirm signup)

- **Subject:** `Confirmá tu cuenta en Mujeres x Más`
- **Body:** pegar el contenido de `supabase/templates/confirmacion.html`.

El link es `{{ .RedirectTo }}&token_hash=…&type=email`: el sitio arma `{{ .RedirectTo }}` como
`/auth/confirm?next=…`, para que al confirmar la usuaria vuelva a donde empezó el registro
(p. ej. QUIERO). Confirma la cuenta aunque el link se abra en otro navegador o dispositivo.
Para que funcione, la URL del sitio tiene que estar en **Redirect URLs** con `/**` (punto 1); si
no, Supabase usa la Site URL y el link queda roto.

## 4 b. Plantilla de recuperación (Authentication → Emails → Reset password)

- **Subject:** `Elegí una contraseña nueva para Mujeres x Más`
- **Body:** pegar el contenido de `supabase/templates/recuperacion.html`.

El link pasa por `/auth/confirm` (abre la sesión) y lleva a `/ingresar/nueva-contrasena`.

## 5. Envío de correos (SMTP)

El servidor de correo que trae Supabase solo envía a las direcciones del equipo de la
organización y tiene un límite muy bajo por hora. **Antes de abrir el registro al público hay que
configurar un SMTP propio** (Resend, función 6 del MVP) en Authentication → Emails → SMTP Settings.
