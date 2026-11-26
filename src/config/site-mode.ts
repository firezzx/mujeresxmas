import { ROUTES } from "@/config/navigation"

// Modo "solo registro" (pre-lanzamiento): el público solo ve la página de registro (/sumate) y la
// de baja de correos. Todo lo demás redirige a /sumate. Las administradoras entran escribiendo
// /admin en la URL (las lleva al login) y, con la sesión iniciada, ven el sitio completo.
// Está activo por defecto; para abrir el sitio completo: SITE_MODE=abierto (ver .env.example).
export const REGISTRATION_ONLY = process.env.SITE_MODE !== "abierto"

// Páginas abiertas a cualquiera en modo solo registro (incluye subpáginas)
export const REGISTRATION_ONLY_PUBLIC = [ROUTES.sumate, ROUTES.baja, ROUTES.admin, ROUTES.authConfirm] as const

// El login solo se puede usar viniendo de /admin (?next=/admin…). Recuperar la contraseña sigue
// disponible para que una administradora no quede afuera.
export const REGISTRATION_ONLY_LOGIN = [ROUTES.login, ROUTES.recuperar, ROUTES.nuevaContrasena] as const

const matches = (path: string, route: string) => path === route || path.startsWith(`${route}/`)

// ¿Puede ver esta página alguien que no es administradora?
export function isOpenInRegistrationOnly(path: string, next: string | null) {
  if (REGISTRATION_ONLY_PUBLIC.some((route) => matches(path, route))) return true
  // Login y registro de cuenta, solo viniendo de /admin (p. ej. para crear una cuenta de prueba)
  if (path === ROUTES.login || path === ROUTES.registro) return Boolean(next && matches(next, ROUTES.admin))
  // Confirmación de la cuenta y link vencido: a donde lleva el correo de confirmación
  if (path === ROUTES.cuentaConfirmada || path === ROUTES.linkVencido) return true
  if (REGISTRATION_ONLY_LOGIN.some((route) => path === route)) return true
  // Archivos que piden los navegadores y los buscadores
  return path === "/robots.txt" || path === "/sitemap.xml"
}
