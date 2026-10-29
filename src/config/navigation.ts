// Links del menú principal. Para sumar una sección nueva alcanza con agregarla acá.
export const MAIN_NAV = [
  { href: "/", label: "Inicio" },
  { href: "/quiero", label: "QUIERO" },
] as const

export const ROUTES = {
  login: "/ingresar",
  registro: "/registro",
  miCuenta: "/mi-cuenta",
  // Destino del link de los correos de Supabase Auth (ver supabase/templates)
  authConfirm: "/auth/confirm",
  cuentaConfirmada: "/registro/confirmada",
  linkVencido: "/registro/link-vencido",
} as const

// Páginas solo para visitantes: con sesión iniciada, el proxy redirige al inicio.
export const GUEST_ONLY_ROUTES = [ROUTES.login, ROUTES.registro] as const
