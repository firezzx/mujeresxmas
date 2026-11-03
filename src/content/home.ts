import type { IconName } from "@/components/icons/hover-icon"

// Textos de la home, separados del diseño. Son provisorios: se reemplazan acá cuando esté el
// contenido definitivo, sin tocar los componentes.

export const HOME_HERO = {
  titleStart: "Convertí tu potencial en",
  titleHighlight: "independencia",
  description: "Capacitación, comunidad y herramientas para que crezcas, emprendas y lideres.",
}

export const HOME_ABOUT = {
  eyebrow: "Qué es Mujeres x Más",
  title: "Un ecosistema para transformar tu negocio",
  description: "Mucho más que una plataforma: todo lo que necesitás para dar el salto digital, en un solo lugar.",
  items: [
    {
      icon: "trending-up",
      title: "Crecimiento",
      text: "Hacé crecer tu negocio con herramientas concretas, contenidos que podés aplicar y acompañamiento para lograr resultados que duren.",
    },
    {
      icon: "users-round",
      title: "Conexión",
      text: "Sumate a una red de personas, alianzas y oportunidades que le abren nuevas puertas a tu negocio.",
    },
    {
      icon: "compass",
      title: "Estrategia",
      text: "Ordená el rumbo de tu negocio con claridad y foco, y convertí tus ideas en acciones que puedan escalar.",
    },
  ] satisfies { icon: IconName; title: string; text: string }[],
}

export const HOME_STATS = [
  { prefix: "+", value: 100, suffix: "", decimals: 0, label: "Mujeres capacitadas" },
  { prefix: "", value: 96, suffix: "%", decimals: 0, label: "Tasa de inserción laboral" },
  { prefix: "$", value: 1.5, suffix: "M", decimals: 1, label: "Generados por la comunidad" },
]

export const HOME_COMMUNITY = {
  eyebrow: "Comunidad",
  title: "Acá no avanzás sola: corremos juntas",
  description:
    "Contenidos, herramientas y recursos para desarrollar y escalar tu negocio. Combinamos estrategia, acción y aprendizaje continuo, a tu ritmo y con foco en resultados.",
  items: [
    { icon: "book-text", text: "Artículos y guías de emprendimiento y tecnología" },
    { icon: "graduation-cap", text: "Cursos online gratuitos para empezar hoy" },
    { icon: "sparkles", text: "Recursos prácticos para impulsar tu proyecto" },
  ] satisfies { icon: IconName; text: string }[],
  cta: "Ver las áreas",
}

export const HOME_AREAS_ID = "areas"

export const HOME_AREAS = {
  eyebrow: "Áreas",
  title: "Lo clave para hacer crecer tu negocio",
  description: "Elegí por dónde arrancar y desarrollá las habilidades para avanzar, ordenarte y escalar.",
  items: [
    {
      icon: "cpu",
      title: "Tecnología e IA aplicada al negocio",
      text: "Usá herramientas digitales, automatización e inteligencia artificial para trabajar mejor y ganar tiempo.",
    },
    {
      icon: "chart-line",
      title: "Comunicación y marketing digital",
      text: "Atraé más clientes con estrategias de contenido, redes sociales y análisis de datos.",
    },
    {
      icon: "rocket",
      title: "Emprendimiento",
      text: "Convertí tu idea en un negocio rentable, con bases claras, orden y foco en resultados.",
    },
    {
      icon: "wallet",
      title: "Finanzas personales y del negocio",
      text: "Organizá tus ingresos y tomá decisiones inteligentes con tu dinero para crecer.",
    },
    {
      icon: "graduation-cap",
      title: "Formaciones gratuitas para empezar",
      text: "Arrancá desde cero con contenidos simples y prácticos para dar tus primeros pasos.",
    },
  ] satisfies { icon: IconName; title: string; text: string }[],
}

export const HOME_CLOSING = {
  title: "El futuro no se espera, se construye",
  description: "Empezá hoy a armar un negocio real, con estrategia, herramientas y una comunidad que te impulsa.",
}
