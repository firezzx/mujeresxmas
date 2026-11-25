export type NavLink = { href: string; label: string; children?: readonly NavLink[] }

// Links del menú principal. Para sumar una sección nueva alcanza con agregarla acá; los hijos se
// muestran como submenú (en escritorio, al pasar sobre el link; en celular, debajo).
export const MAIN_NAV: readonly NavLink[] = [
  { href: "/", label: "Inicio" },
  {
    href: "/pilares",
    label: "Pilares",
    children: [
      { href: "/pilares/desarrollo", label: "Desarrollo" },
      { href: "/pilares/bienestar", label: "Bienestar" },
      { href: "/pilares/conexion", label: "Conexión" },
    ],
  },
  { href: "/membresia", label: "Quiero ser MX+" },
  { href: "/empresas", label: "Empresas" },
]

// Llamado a la acción de todo el sitio (botón naranja del menú y del hero), con o sin sesión: abre Membresía
// desde arriba. PLANS_ANCHOR queda como ancla de las tarjetas de planes dentro de esa página.
export const JOIN_LABEL = "Sumate a MX+"
export const PLANS_ANCHOR = "planes"
export const JOIN_HREF = "/membresia"

export const ROUTES = {
  login: "/ingresar",
  registro: "/registro",
  miCuenta: "/mi-cuenta",
  // Destino del link de los correos de Supabase Auth (ver supabase/templates)
  authConfirm: "/auth/confirm",
  cuentaConfirmada: "/registro/confirmada",
  linkVencido: "/registro/link-vencido",
  recuperar: "/ingresar/recuperar",
  nuevaContrasena: "/ingresar/nueva-contrasena",
  admin: "/admin",
  adminCursos: "/admin/cursos",
  adminEventos: "/admin/eventos",
  adminNotificaciones: "/admin/notificaciones",
  adminPlanes: "/admin/planes",
  adminEmpresas: "/admin/empresas",
  adminContactos: "/admin/contactos",
  adminBlog: "/admin/blog",
  adminBlogNueva: "/admin/blog/nueva",
  adminBlogCategorias: "/admin/blog/categorias",
  pilares: "/pilares",
  desarrollo: "/pilares/desarrollo",
  bienestar: "/pilares/bienestar",
  conexion: "/pilares/conexion",
  kiero: "/kiero",
  membresia: "/membresia",
  empresas: "/empresas",
  sumate: "/sumate",
  baja: "/baja",
  blog: "/blog",
  // Provisoria hasta que la clienta defina cómo se pide Kiero (función 2)
  kieroSolicitud: "/kiero/solicitud",
} as const

// Páginas solo para visitantes: con sesión iniciada, el proxy redirige al inicio.
export const GUEST_ONLY_ROUTES = [ROUTES.login, ROUTES.registro] as const

// Páginas privadas (incluye sus subpáginas): sin sesión, el proxy manda al login.
export const PROTECTED_ROUTES = [ROUTES.miCuenta, ROUTES.kieroSolicitud, ROUTES.admin] as const

// Secciones del panel de administración. Para sumar una: ruta en ROUTES, página en
// src/app/admin/<seccion>/page.tsx, ícono en src/components/icons/hover-icon.tsx y una línea acá.
// "pending": sección que todavía no se usa; queda oculta salvo que se active
// "Mostrar en preparación" (cookie ADMIN_PENDING_COOKIE).
export const ADMIN_NAV = [
  { href: ROUTES.admin, label: "Usuarios", icon: "users-round" },
  { href: ROUTES.adminCursos, label: "Cursos", icon: "book-text", pending: true },
  { href: ROUTES.adminEventos, label: "Eventos", icon: "calendar-days", pending: true },
  { href: ROUTES.adminBlog, label: "Blog", icon: "file-text" },
  { href: ROUTES.adminNotificaciones, label: "Notificaciones", icon: "bell" },
  { href: ROUTES.adminPlanes, label: "Planes", icon: "sparkles" },
  { href: ROUTES.adminEmpresas, label: "Empresas", icon: "heart-handshake" },
  { href: ROUTES.adminContactos, label: "Contactos", icon: "mail-check" },
] as const
