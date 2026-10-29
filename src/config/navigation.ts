// Links del menú principal. Para sumar una sección nueva alcanza con agregarla acá.
export const MAIN_NAV = [
  { href: "/", label: "Inicio" },
  { href: "/quiero", label: "QUIERO" },
] as const

export const ROUTES = {
  login: "/ingresar",
  registro: "/registro",
  miCuenta: "/mi-cuenta",
  perfil: "/mi-cuenta/perfil",
  // Destino del link de los correos de Supabase Auth (ver supabase/templates)
  authConfirm: "/auth/confirm",
  cuentaConfirmada: "/registro/confirmada",
  linkVencido: "/registro/link-vencido",
  recuperar: "/ingresar/recuperar",
  nuevaContrasena: "/ingresar/nueva-contrasena",
} as const

// Páginas solo para visitantes: con sesión iniciada, el proxy redirige al inicio.
export const GUEST_ONLY_ROUTES = [ROUTES.login, ROUTES.registro] as const

// Páginas privadas (incluye sus subpáginas): sin sesión, el proxy manda al login.
export const PROTECTED_ROUTES = [ROUTES.miCuenta] as const
