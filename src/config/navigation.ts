// Links del menú principal. Para sumar una sección nueva alcanza con agregarla acá.
export const MAIN_NAV = [
  { href: "/", label: "Inicio" },
  { href: "/quiero", label: "QUIERO" },
] as const

export const ROUTES = {
  login: "/ingresar",
  registro: "/registro",
  miCuenta: "/mi-cuenta",
} as const
