import type { IconName } from "@/components/icons/hover-icon"

// Textos de la página de Empresas, a partir del diseño de las clientas. Los que van entre
// corchetes ([N], [PRECIO], [DATO]) los completan ellas.
export const COMPANIES_PAGE = {
  eyebrow: "Membresías patrocinadas",
  title: "Impulsá a las mujeres de tu red.",
  titleHighlight: "Medí el impacto.",
  description:
    "Tu organización regala membresías a emprendedoras de su cadena de valor, colaboradoras o comunidades. Nosotras acompañamos a cada una y vos recibís reportes de avance.",
  primaryCta: "Pedir una propuesta",
  secondaryCta: "Cómo funciona",
  metaDescription:
    "Membresías patrocinadas de Mujeres x Más: tu organización impulsa a emprendedoras de su red y recibe reportes de impacto.",
  stats: [
    { value: "+14.000", label: "mujeres capacitadas desde la comunidad" },
    { value: "+28 · 4", label: "localidades y países donde ya operamos" },
  ],
}

// Opciones del formulario: el valor se guarda en company_leads.audience
export const COMPANY_AUDIENCES = [
  { value: "cadena_de_valor", label: "Proveedoras o clientas de mi cadena de valor" },
  { value: "colaboradoras", label: "Colaboradoras de mi organización" },
  { value: "comunidad", label: "Una comunidad o territorio" },
] as const

export type CompanyAudience = (typeof COMPANY_AUDIENCES)[number]["value"]

// A quiénes se puede impulsar. Cada tarjeta lleva al formulario con esa opción ya elegida.
export const COMPANIES_AUDIENCES = {
  eyebrow: "Para quién",
  title: "¿A quiénes",
  titleHighlight: "querés impulsar?",
  cta: "Armar una propuesta",
  items: [
    {
      audience: "cadena_de_valor",
      icon: "trending-up",
      tone: "green",
      hand: "proveedoras y clientas",
      title: "Tu cadena de valor",
      text: "Emprendedoras que se profesionalizan, se digitalizan y acceden a crédito: una cadena más fuerte para tu negocio.",
    },
    {
      audience: "colaboradoras",
      icon: "sparkles",
      tone: "pink",
      hand: "tu equipo",
      title: "Tus colaboradoras",
      text: "Acompañamiento en cada etapa de vida, como beneficio para las mujeres de tu organización.",
    },
    {
      audience: "comunidad",
      icon: "users-round",
      tone: "brand",
      hand: "un barrio, una ciudad",
      title: "Una comunidad o territorio",
      text: "Programas para las emprendedoras de un lugar o una red. Nosotras nos ocupamos de la convocatoria.",
    },
  ],
} satisfies {
  items: {
    audience: CompanyAudience
    icon: IconName
    tone: "brand" | "green" | "pink"
    hand: string
    title: string
    text: string
  }[]
} & Record<string, unknown>

export const COMPANIES_STEPS = {
  eyebrow: "Cómo funciona",
  title: "De la idea al reporte,",
  titleHighlight: "en cuatro pasos",
  items: [
    { title: "Definimos el objetivo", text: "A quiénes querés impulsar y qué resultado buscás." },
    { title: "Elegís el paquete", text: "Cantidad de membresías y nivel de acompañamiento." },
    { title: "Convocamos e incorporamos", text: "Nos ocupamos de la difusión y del diagnóstico de cada participante." },
    { title: "Reportamos el avance", text: "Tablero de impacto trimestral y cierre con resultados." },
  ],
}

export const COMPANIES_DASHBOARD = {
  // Oculto hasta tener los datos reales del tablero
  hidden: true,
  eyebrow: "Impacto que podés reportar",
  title: "Lo que vas a ver",
  titleHighlight: "cada trimestre",
  description:
    "Datos de formación, ventas y red, por participante y agregados, listos para tus informes de sostenibilidad y diversidad.",
  note: "Ejemplo ilustrativo · los valores se completan con datos reales",
  value: "[DATO]",
  windowTitle: "Tablero de impacto · Trimestre",
  sample: "Ejemplo",
  items: [
    { icon: "users-round", label: "Participantes activas" },
    { icon: "graduation-cap", label: "Cursos certificados" },
    { icon: "cpu", label: "Negocios digitalizados" },
    { icon: "trending-up", label: "Variación de ventas" },
    { icon: "link", label: "Conexiones generadas" },
    { icon: "sparkles", label: "Satisfacción (NPS)" },
  ],
} satisfies { items: { icon: IconName; label: string }[] } & Record<string, unknown>

export const COMPANIES_PACKAGES = {
  // Oculto hasta tener los precios y las cantidades de cada paquete
  hidden: true,
  eyebrow: "Paquetes",
  title: "Elegí cuánto",
  titleHighlight: "querés impulsar",
  featured: "Desarrollo",
  featuredBadge: "Recomendado",
  cta: "Pedir este paquete",
  items: [
    {
      name: "Inicio",
      summary: "Desde [N] membresías Crecer",
      features: ["12 meses de membresía", "Convocatoria y onboarding", "Reporte de cierre"],
      price: "[PRECIO]",
    },
    {
      name: "Desarrollo",
      summary: "Desde [N] membresías Crecer e Impulso",
      features: ["Todo lo de Inicio", "Tablero de impacto trimestral", "Encuentro presencial con tu marca"],
      price: "[PRECIO]",
    },
    {
      name: "Expansión",
      summary: "Programa a medida",
      features: ["Todo lo de Desarrollo", "Ruta de formación co-diseñada", "Marca aliada en la plataforma"],
      price: "A cotizar",
    },
  ],
}

export const COMPANIES_FORM = {
  hand: "ninguna camina sola",
  title: "Armemos juntas",
  titleHighlight: "tu programa",
  description: "Contanos a quiénes querés impulsar y te enviamos una propuesta a medida.",
  nextTitle: "Qué pasa después",
  next: [
    "Te escribimos en [N] días hábiles.",
    "Definimos juntas el objetivo y el paquete.",
    "Lanzamos la convocatoria y empezás a ver resultados.",
  ],
  submit: "Pedir una propuesta",
  sentTitle: "¡Gracias! Ya recibimos tu pedido",
  sentText: "Te escribimos al correo que dejaste con una propuesta para tu organización.",
}

// Ancla del formulario. Con "#propuesta-<audience>" el formulario abre con esa opción elegida.
export const COMPANIES_FORM_ID = "propuesta"
