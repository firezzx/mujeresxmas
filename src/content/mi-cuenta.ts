import type { IconBadgeTone } from "@/components/icon-badge"
import type { IconName } from "@/components/icons/hover-icon"
import { ROUTES } from "@/config/navigation"

// Secciones de Mi cuenta. Cursos y eventos están ocultos hasta que haya: poner `hidden: false` para
// volver a mostrarlos (el panel ya sabe listarlos).
export const ACCOUNT_SECTIONS = {
  courses: { hidden: true },
  events: { hidden: true },
} as const

export const ACCOUNT_INTRO = {
  eyebrow: "Mi cuenta",
}

// Accesos rápidos de Mi cuenta, en este orden. El tono es el color del ícono (ver IconBadge).
export const ACCOUNT_SHORTCUTS = [
  { href: ROUTES.perfil, label: "Mi perfil", description: "Tu foto, portada y datos", icon: "user", tone: "green" },
  {
    href: ROUTES.membresia,
    label: "Membresía",
    description: "Tu plan y los demás planes",
    icon: "sparkles",
    tone: "brand",
  },
  { href: ROUTES.blog, label: "Blog", description: "Notas y novedades", icon: "book-text", tone: "pink" },
  { href: ROUTES.kiero, label: "Kiero", description: "Conocé Kiero", icon: "heart-handshake", tone: "green" },
] as const satisfies readonly {
  href: string
  label: string
  description: string
  icon: IconName
  tone: IconBadgeTone
}[]
