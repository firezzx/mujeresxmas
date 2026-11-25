// Textos de los correos automáticos del sitio (el agradecimiento de /sumate está en content/sumate.ts).
// Son provisorios hasta que la clienta los revise.

// Bienvenida: sale cuando la usuaria confirma su cuenta desde el correo de confirmación (sin nombre:
// al registrarse solo se pide el email).
export const WELCOME_EMAIL = {
  subject: "¡Bienvenida a Mujeres x Más!",
  title: "¡Te damos la bienvenida!",
  paragraphs: [
    "Tu cuenta ya está lista. Desde ahora sos parte de la comunidad de emprendedoras que se acompañan para formarse, cuidarse y crecer.",
    "En tu cuenta vas a encontrar tu plan, tus datos y todo lo que vayamos sumando para vos.",
  ],
  cta: "Ir a mi cuenta",
  signature: "Con cariño,\nel equipo de Mujeres x Más",
  hashtag: "#CrecemosJuntas",
} as const

// Avisos para la casilla del equipo (ADMIN_NOTIFY_EMAIL)
export const TEAM_NOTICES = {
  signup: {
    subject: "Nuevo registro en /sumate: {nombre}",
    title: "Se sumó una persona nueva",
    panelLabel: "Ver contactos",
  },
  company: {
    subject: "Nuevo pedido de empresa: {empresa}",
    title: "Una empresa pidió una propuesta",
    panelLabel: "Ver pedidos de empresas",
  },
} as const
