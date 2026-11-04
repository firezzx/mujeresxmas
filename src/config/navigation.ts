// Links del menú principal. Para sumar una sección nueva alcanza con agregarla acá.
export const MAIN_NAV = [
  { href: "/", label: "Inicio" },
  { href: "/quiero", label: "QUIERO" },
  { href: "/blog", label: "Blog" },
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
  admin: "/admin",
  adminCursos: "/admin/cursos",
  adminEventos: "/admin/eventos",
  adminNotificaciones: "/admin/notificaciones",
  adminBlog: "/admin/blog",
  adminBlogNueva: "/admin/blog/nueva",
  adminBlogCategorias: "/admin/blog/categorias",
  quiero: "/quiero",
  blog: "/blog",
  // Provisoria hasta que la clienta defina cómo se pide QUIERO (función 2)
  quieroSolicitud: "/quiero/solicitud",
} as const

// Páginas solo para visitantes: con sesión iniciada, el proxy redirige al inicio.
export const GUEST_ONLY_ROUTES = [ROUTES.login, ROUTES.registro] as const

// Páginas privadas (incluye sus subpáginas): sin sesión, el proxy manda al login.
export const PROTECTED_ROUTES = [ROUTES.miCuenta, ROUTES.quieroSolicitud, ROUTES.admin] as const

// Secciones del panel de administración. Para sumar una: ruta en ROUTES, página en
// src/app/admin/<seccion>/page.tsx, ícono en src/components/icons/hover-icon.tsx y una línea acá.
export const ADMIN_NAV = [
  { href: ROUTES.admin, label: "Usuarios", icon: "users-round" },
  { href: ROUTES.adminCursos, label: "Cursos", icon: "book-text" },
  { href: ROUTES.adminEventos, label: "Eventos", icon: "calendar-days" },
  { href: ROUTES.adminBlog, label: "Blog", icon: "file-text" },
  { href: ROUTES.adminNotificaciones, label: "Notificaciones", icon: "bell" },
] as const
