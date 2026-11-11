import type { IconName } from "@/components/icons/hover-icon"

// Textos e imágenes de la home, separados del diseño. Son provisorios: se reemplazan acá cuando esté
// el contenido definitivo, sin tocar los componentes. Las fotos están en public/images/home y su
// origen en docs/IMAGENES-PEXELS.md.

// Lo marcado como ejemplo (cursos, notas, voces y eventos de abajo) solo se ve en desarrollo, o con
// SHOW_SAMPLE_CONTENT=true. En producción cada sección muestra datos reales o no aparece.
export const SHOW_SAMPLES = process.env.NODE_ENV === "development" || process.env.SHOW_SAMPLE_CONTENT === "true"

export const HOME_HERO = {
  // Aviso de arriba: lleva a QUIERO, la tienda online
  noticeTag: "Nuevo",
  notice: "Hacete miembro y tené tu tienda online gratis",
  hand: "Nuevos tiempos, más posibilidades",
  titleStart: "No caminás sola.",
  titleHighlight: "Crecemos con vos",
  description:
    "La comunidad que ya conocés da un paso más: un espacio para formarte, cuidarte y hacer red, con acompañamiento real en cada etapa.",
  checks: ["Empezás gratis", "Cancelás cuando quieras", "+14.000 mujeres ya son parte"],
  secondaryCta: "Conocé los pilares",
  chips: ["Desarrollo", "Bienestar", "Conexión"],
  ribbonTop: ["Desarrollo", "Bienestar", "Conexión", "Crecemos juntas", "#HoyTambiénSoyMás"],
  ribbonBottom: ["Cursos", "Encuentros", "Tienda online", "Red de proveedoras", "Comunidad"],
  avatarsText: "Acá hay lugar para vos",
  // Collage de la portada: la grande, la vertical de la izquierda y la apaisada de abajo
  photos: [
    { src: "/images/home/socias-negocio.jpg", alt: "Dos socias conversando sobre su negocio" },
    { src: "/images/home/emprendimiento.jpg", alt: "Emprendedora sonriendo en su taller" },
    { src: "/images/home/colegas-escalera.jpg", alt: "Colegas charlando en una escalera" },
  ],
}

export const HOME_SECTION_IDS = {
  pillars: "pilares",
  plans: "planes",
  inside: "adentro",
  courses: "cursos",
  notes: "notas",
  products: "productos",
  events: "eventos",
}

// La comunidad en números. La cantidad de países figura distinta en el diseño de la clienta (3 y 4):
// se confirma con ella.
export const HOME_IMPACT = {
  label: "La comunidad en números",
  stats: [
    { value: 14000, prefix: "+", label: "mujeres capacitadas" },
    { value: 28, prefix: "+", label: "localidades alcanzadas" },
    { value: 4, prefix: "", label: "países donde estamos" },
  ],
  hand: "Y esto recién empieza.",
}

export const HOME_PILLARS = {
  eyebrow: "Tres pilares",
  title: "Todo lo que necesitás,",
  titleHighlight: "en tres pilares",
  hand: "soluciones reales, no promesas",
  description: "Se sostienen entre sí y crecen con tu membresía. Entrá a cada uno para ver qué incluye.",
  forYouLabel: "Es para vos si",
  linkLabel: "Conocé",
}

export const HOME_MOMENTS = {
  eyebrow: "Con vos en cada etapa",
  title: "¿En qué momento",
  titleHighlight: "estás hoy?",
  description:
    "Sin fórmulas mágicas ni pura teoría: soluciones concretas para lo que te pasa hoy, fáciles de aplicar y sin grandes inversiones.",
  items: [
    {
      icon: "trending-up",
      title: "Crecimiento",
      text: "Hacer crecer tu carrera sin perderte a vos misma en el camino.",
    },
    {
      icon: "compass",
      title: "Reinvención 40+",
      text: "Un nuevo comienzo, con formación real y una red que te sostiene.",
    },
    {
      icon: "cpu",
      title: "Nuevas tecnologías",
      text: "Digitalización e inteligencia artificial aplicadas a tu vida y a tu negocio.",
    },
    {
      icon: "rocket",
      title: "Proyecto propio",
      text: "Un negocio que quiere escalar o un capítulo nuevo que elegiste vos.",
    },
  ],
} satisfies { items: { icon: IconName; title: string; text: string }[] } & Record<string, unknown>

// Los planes salen del admin; acá van los textos que los rodean y los beneficios
export const HOME_PLANS = {
  eyebrow: "Membresía",
  title: "Elegí el plan que va",
  titleHighlight: "con tu momento",
  description: "No todas necesitamos lo mismo. Empezá gratis y cambiá de plan cuando quieras, sin permanencia.",
  moreCta: "Ver todos los detalles",
  perks: [
    {
      icon: "sparkles",
      hand: "¿ya eras parte?",
      title: "Beneficio Socia Fundadora",
      text: "Si venís de Mujeres por Más, tu primer mes del plan pago es sin cargo y tu precio queda congelado por 12 meses. Válido hasta el 15/12/2026.",
    },
    {
      icon: "user-plus",
      hand: "juntas, siempre más",
      title: "Invitá a una amiga",
      text: "Cuando una amiga se suma a un plan pago con tu enlace, las dos tienen un mes sin cargo.",
    },
  ],
} satisfies { perks: { icon: IconName; hand: string; title: string; text: string }[] } & Record<string, unknown>

export const HOME_STEPS = {
  // Foto de fondo de la franja (va con un velo oscuro encima)
  image: "/images/home/socias-negocio.jpg",
  eyebrow: "Cómo funciona",
  title: "Empezá en",
  titleHighlight: "tres pasos",
  items: [
    {
      icon: "user-plus",
      title: "Creá tu cuenta",
      text: "Te registrás en un minuto y empezás gratis. Si querés más, pasás al plan pago cuando quieras.",
    },
    {
      icon: "compass",
      title: "Elegí por dónde arrancar",
      text: "Activá tu tienda online o elegí los contenidos y encuentros que más te sirvan.",
    },
    {
      icon: "sparkles",
      title: "¡Y listo!",
      text: "Cursos, encuentros y red en un mismo lugar desde el primer día. Ya sos una mujer que va por más.",
    },
  ],
} satisfies { items: { icon: IconName; title: string; text: string }[] } & Record<string, unknown>

export const HOME_EVOLUTION = {
  eyebrow: "Nuestra historia",
  title: "De Mujeres por Más a",
  titleHighlight: "Mujeres x Más",
  hand: "seguimos siendo nosotras",
  items: [
    { title: "La misma calidez", text: "Cercanía y palabras simples, sin promesas vacías." },
    { title: "El mismo propósito", text: "Acompañar a mujeres reales, en momentos reales, con respuestas reales." },
    { title: "Más alcance", text: "Un campus nuevo, tres pilares y una membresía para llegar más lejos." },
  ],
}

export const HOME_INSIDE = { title: "Lo que vas a encontrar", titleHighlight: "adentro" }

export const HOME_PATHS = {
  courses: {
    icon: "graduation-cap",
    title: "Aprender",
    text: "Cursos para dar el primer paso",
    image: "/images/home/formacion.jpg",
  },
  notes: {
    icon: "book-text",
    title: "Leer",
    text: "Notas y guías para tu proyecto",
    image: "/images/home/tecnologia.jpg",
  },
  products: {
    icon: "rocket",
    title: "Crecer",
    text: "Productos que te acompañan",
    image: "/images/home/equipo-laptop.jpg",
  },
  events: {
    icon: "calendar-days",
    title: "Encontrarnos",
    text: "Charlas y encuentros de la comunidad",
    image: "/images/home/colegas-escalera.jpg",
  },
} satisfies Record<string, { icon: IconName; title: string; text: string; image: string }>

export const HOME_COURSES = {
  title: "Cursos para",
  titleHighlight: "empezar hoy",
  description: "A tu ritmo, con contenidos simples y prácticos.",
  topics: ["Tecnología e IA", "Comunicación y marketing", "Emprendimiento", "Finanzas", "Formaciones gratuitas"],
  cta: "Quiero sumarme",
  samples: [
    {
      title: "Tu primer negocio online",
      text: "De la idea a la primera venta, paso a paso.",
      meta: "Gratis · 6 clases",
      image: "/images/home/formacion.jpg",
    },
    {
      title: "Redes que venden",
      text: "Contenido simple para atraer a tus clientas.",
      meta: "Gratis · 4 clases",
      image: "/images/home/marketing.jpg",
    },
    {
      title: "Ordená tus números",
      text: "Ingresos, gastos y precios sin vueltas.",
      meta: "Gratis · 5 clases",
      image: "/images/home/finanzas.jpg",
    },
  ],
}

export const HOME_NOTES = {
  title: "Para leer",
  titleHighlight: "con un mate",
  description: "Ideas y experiencias para seguir creciendo.",
  cta: "Ver todas las notas",
  samples: [
    {
      title: "Cómo usar la IA en tu emprendimiento sin ser experta",
      text: "Tres herramientas para ganar tiempo esta semana.",
      meta: "5 min de lectura",
      image: "/images/home/tecnologia.jpg",
    },
    {
      title: "Del Instagram a la tienda propia",
      text: "Qué mirar antes de dar el salto.",
      meta: "4 min de lectura",
      image: "/images/home/emprendimiento.jpg",
    },
    {
      title: "Ponerle precio a lo que hacés",
      text: "Una guía para dejar de cobrar de menos.",
      meta: "6 min de lectura",
      image: "/images/home/boutique.jpg",
    },
  ],
}

export const HOME_PRODUCT = {
  tag: "Producto",
  title: "QUIERO",
  description: "De vender por redes a tener tu tienda online. Te acompañamos en cada paso.",
  cta: "Conocé QUIERO",
  image: "/images/home/boutique.jpg",
  imageAlt: "Emprendedora preparando prendas en su tienda",
  secondImage: "/images/home/marketing.jpg",
  secondImageAlt: "Emprendedora grabando un video para sus redes",
  chip: "Te acompañamos",
  steps: ["Vender por redes", "Armar tu tienda", "Seguir creciendo"],
}

export const HOME_STATEMENT = {
  text: "No llegamos hasta acá de la nada. Llegamos caminando juntas.",
  highlightWords: ["juntas."],
}

export const HOME_VOICES = {
  kicker: "Comunidad",
  title: "Lo cuentan",
  titleHighlight: "ellas",
  samples: [
    {
      quote: "Por primera vez sentí que no estaba haciendo todo esto sola.",
      name: "Lucía G.",
      detail: "Tienda de ropa",
      image: "/images/home/emprendimiento.jpg",
    },
    {
      quote: "Con lo que aprendí ordené mis números y subí los precios sin miedo.",
      name: "Marina P.",
      detail: "Pastelería",
      image: "/images/home/florista.jpg",
    },
    {
      quote: "Conocí a otras emprendedoras y hoy trabajamos juntas.",
      name: "Sol R.",
      detail: "Diseño gráfico",
      image: "/images/home/formacion.jpg",
    },
    {
      quote: "Me animé a abrir mi tienda online gracias al acompañamiento.",
      name: "Carla M.",
      detail: "Cosmética natural",
      image: "/images/home/marketing.jpg",
    },
  ],
}

export const HOME_EVENTS = {
  title: "Próximos",
  titleHighlight: "encuentros",
  cta: "Anotarme",
  nextLabel: "El próximo",
  samples: [
    { title: "Café de emprendedoras", meta: "Presencial · Buenos Aires", startsAt: "2026-11-20T21:00:00.000Z" },
    { title: "Charla: vender por WhatsApp", meta: "Online", startsAt: "2026-11-26T22:00:00.000Z" },
    { title: "Taller: tu marca en una tarde", meta: "Online", startsAt: "2026-12-03T22:00:00.000Z" },
  ],
}

export const HOME_CLOSING = {
  hashtag: "#HoyTambiénSoyMás",
  title: "No caminás sola.",
  titleHighlight: "Crecemos con vos.",
  description:
    "Creá tu cuenta gratis y empezá hoy: tu tienda online, cursos, encuentros y una red de mujeres que van por más.",
  cta: "Unirme a Mujeres x Más",
  image: "/images/home/cierre-grupo.jpg",
}

export const HOME_CLOSING_CTA_ID = "cta-cierre"
