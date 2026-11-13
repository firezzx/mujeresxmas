import type { IconName } from "@/components/icons/hover-icon"

// Textos de la página de Membresía, a partir del diseño de las clientas. Los que van entre
// corchetes ([FECHA], [MEDIOS DE PAGO]…) los completan ellas. Los nombres, precios y beneficios
// de las tarjetas se cargan desde el panel (/admin/planes).
export const MEMBERSHIP_PAGE = {
  hand: "no caminás sola",
  title: "Elegí la membresía",
  titleHighlight: "para tu momento",
  description: "Empezás sin costo y subís cuando lo necesites. Sin permanencia: cambiás o cancelás desde tu perfil.",
  metaDescription:
    "Comunidad, Crecer e Impulso: elegí la membresía de Mujeres x Más para tu momento. Empezás sin costo y sin permanencia.",
}

// "¿En qué momento estás?": cada opción resalta la membresía que le corresponde (por id de plan)
export const MEMBERSHIP_MOMENTS = {
  label: "¿En qué momento estás?",
  recommended: "Recomendada para vos",
  options: [
    {
      planId: "gratis",
      icon: "compass",
      label: "Estoy empezando",
      text: "Sumate sin costo: formaciones abiertas, contenidos de bienestar y la comunidad online.",
    },
    {
      planId: "crecimiento",
      icon: "trending-up",
      label: "Tengo un emprendimiento",
      text: "Academia completa, diagnóstico de negocio y networking mensual para profesionalizarte.",
    },
    {
      planId: "impulso",
      icon: "rocket",
      label: "Voy por más",
      text: "Mentoría 1 a 1 y acompañamiento personalizado para escalar tu negocio.",
    },
  ],
} satisfies {
  options: { planId: string; icon: IconName; label: string; text: string }[]
} & Record<string, unknown>

// Comparativa pilar por pilar, en pestañas. Las columnas siguen el orden de los planes.
export const MEMBERSHIP_COMPARISON = {
  eyebrow: "Comparativa",
  title: "Qué incluye cada membresía,",
  titleHighlight: "pilar por pilar",
  description: "Elegí un pilar y mirá qué suma cada nivel.",
  benefitLabel: "Beneficio",
  plans: ["Comunidad", "Crecer", "Impulso"],
  // Columna destacada (la de Crecer) y su etiqueta
  featuredIndex: 1,
  featuredBadge: "La más elegida",
  groups: [
    {
      pillar: "Desarrollo",
      icon: "rocket",
      rows: [
        { label: "Formaciones gratuitas de la Academia", values: ["Incluido", "Incluido", "Incluido"] },
        { label: "Cursos certificados (todo el catálogo)", values: [null, "Ilimitados", "Ilimitados"] },
        { label: "Diagnóstico y plan de negocio", values: [null, "1 por año", "Con seguimiento trimestral"] },
        { label: "Tienda online sin comisiones", values: [null, "Adicional $49.900/mes", "Incluida"] },
        { label: "Mentoría 1 a 1", values: [null, null, "1 sesión por mes"] },
        { label: "Finanzas y preparación para crédito", values: [null, "Curso", "Curso + plan personalizado"] },
      ],
    },
    {
      pillar: "Bienestar",
      icon: "sparkles",
      rows: [
        { label: "Contenidos de bienestar por etapa", values: ["Incluido", "Incluido", "Incluido"] },
        { label: "Espacios de escucha grupales", values: [null, "Mensual", "Mensual"] },
        { label: "Talleres de hábitos y salud", values: [null, "Incluidos", "Incluidos"] },
        { label: "Sesiones individuales de acompañamiento", values: [null, null, "[N] por año"] },
      ],
    },
    {
      pillar: "Conexiones",
      icon: "users-round",
      rows: [
        { label: "Comunidad online y encuentros abiertos", values: ["Incluido", "Incluido", "Incluido"] },
        { label: "Networking mensual por rubro", values: [null, "Incluido", "Incluido"] },
        { label: "Red de proveedoras", values: [null, "Comprar con beneficio", "Comprar y vender"] },
        { label: "Perfil destacado y acceso a alianzas", values: [null, null, "Incluido"] },
      ],
    },
  ],
} satisfies {
  plans: string[]
  groups: { pillar: string; icon: IconName; rows: { label: string; values: (string | null)[] }[] }[]
} & Record<string, unknown>

// Beneficios extra, en una sola franja
export const MEMBERSHIP_PERKS = {
  title: "Y además,",
  titleHighlight: "beneficios para sumar más",
  items: [
    {
      icon: "sparkles",
      tone: "brand",
      hand: "¿ya eras parte?",
      title: "Socia Fundadora",
      text: "Si venís de Mujeres por Más, tu primer mes de Crecer o Impulso es sin cargo y el precio queda congelado 12 meses. Hasta [FECHA].",
    },
    {
      icon: "user-plus",
      tone: "green",
      hand: "juntas, siempre más",
      title: "Invitá a una amiga",
      text: "Cuando se suma a Crecer o Impulso con tu enlace, las dos tienen un mes sin cargo.",
    },
    {
      icon: "heart-handshake",
      tone: "pink",
      hand: "¿tu empresa te acompaña?",
      title: "Membresías patrocinadas",
      text: "Organizaciones que regalan membresías a las mujeres de su red.",
      link: { label: "Cómo funciona", href: "/empresas" },
    },
  ],
} satisfies {
  items: {
    icon: IconName
    tone: "brand" | "green" | "pink"
    hand: string
    title: string
    text: string
    link?: { label: string; href: string }
  }[]
} & Record<string, unknown>

export const MEMBERSHIP_FAQ = {
  title: "Lo que más",
  titleHighlight: "nos preguntan",
  description: "Respuestas cortas a las dudas más comunes antes de sumarte.",
  items: [
    {
      question: "¿Hay permanencia?",
      answer: "No. Cancelás desde tu perfil cuando quieras y la membresía no se renueva.",
    },
    {
      question: "¿Puedo cambiar de membresía?",
      answer: "Sí, en cualquier momento. El cambio se ajusta en la próxima factura.",
    },
    { question: "¿Cómo pago?", answer: "Con tarjeta, débito automático o [MEDIOS DE PAGO], siempre en pesos." },
    {
      question: "¿Emiten factura para mi negocio?",
      answer: "Sí, emitimos factura [TIPO DE FACTURA] a tu nombre o al de tu emprendimiento.",
    },
    {
      question: "¿Los certificados tienen validez?",
      answer: "Sí. Además, las rutas de programación se certifican en alianza con empresas de tecnología.",
    },
    { question: "¿Desde qué países me puedo sumar?", answer: "Desde los 4 países donde estamos: [PAÍSES]." },
  ],
}

export const MEMBERSHIP_CLOSING = {
  hand: "#HoyTambiénSoyMás",
  title: "Empezá hoy,",
  titleHighlight: "sin costo.",
  description: "Creá tu cuenta en un minuto y sumate a Comunidad. Cuando quieras ir por más, cambiás de membresía.",
  cta: "Crear mi cuenta gratis",
}
