// Textos de los correos automáticos del sitio (el agradecimiento de /sumate está en content/sumate.ts).
// Son provisorios hasta que la clienta los revise. El diseño está en src/lib/email-templates.ts.

// Bienvenida: sale cuando la usuaria confirma su cuenta desde el correo de confirmación (sin nombre:
// al registrarse solo se pide el email).
export const WELCOME_EMAIL = {
  subject: "¡Bienvenida a Mujeres x Más!",
  preheader: "Tu cuenta ya está lista. Entrá y conocé todo lo que hay para vos.",
  eyebrow: "Tu cuenta está lista",
  title: "¡Te damos la bienvenida!",
  paragraphs: [
    "Tu cuenta ya está activa. Desde ahora sos parte de la comunidad de emprendedoras que se acompañan para formarse, cuidarse y crecer.",
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
    intro: "Alguien completó el formulario de /sumate y ya recibió el correo de agradecimiento.",
    panelLabel: "Ver contactos",
  },
  company: {
    subject: "Nuevo pedido de empresa: {empresa}",
    title: "Una empresa pidió una propuesta",
    intro: "Llegó un pedido desde /empresas. Estos son los datos para contactarla.",
    panelLabel: "Ver pedidos de empresas",
  },
  account: {
    subject: "Nueva cuenta creada: {email}",
    title: "Se creó una cuenta nueva",
    intro: "Una persona confirmó su correo y activó su cuenta en el sitio. Ya recibió el correo de bienvenida.",
    panelLabel: "Ver usuarios",
  },
} as const

// Correos de Supabase Auth. Se generan con `npm run correos` en supabase/templates y se pegan en
// Supabase → Authentication → Emails → Templates (los asuntos están en supabase/config.toml).
export const AUTH_EMAILS = {
  confirmation: {
    preheader: "Tocá el botón para activar tu cuenta en Mujeres x Más.",
    eyebrow: "Último paso",
    title: "Confirmá tu correo",
    paragraphs: ["Ya casi sos parte de la comunidad. Tocá el botón para confirmar tu correo y activar tu cuenta."],
    cta: "Confirmar mi cuenta",
    note: "El link vence en 1 hora y sirve una sola vez.",
    footer: "Si no creaste una cuenta en Mujeres x Más, ignorá este correo: no se va a activar nada.",
  },
  recovery: {
    preheader: "Elegí una contraseña nueva para tu cuenta de Mujeres x Más.",
    eyebrow: "Tu cuenta",
    title: "Elegí una contraseña nueva",
    paragraphs: ["Recibimos un pedido para cambiar la contraseña de tu cuenta. Tocá el botón para elegir una nueva."],
    cta: "Elegir contraseña nueva",
    note: "El link vence en 1 hora y sirve una sola vez.",
    footer: "Si no lo pediste vos, ignorá este correo: tu contraseña sigue siendo la misma.",
  },
} as const
