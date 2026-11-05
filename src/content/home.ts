// Textos e imágenes de la home, separados del diseño. Son provisorios: se reemplazan acá cuando esté
// el contenido definitivo, sin tocar los componentes. Las fotos están en public/images/home y su
// origen en docs/IMAGENES-PEXELS.md.

// Lo marcado como ejemplo (cursos, notas, voces y eventos de abajo) solo se ve en desarrollo, o con
// SHOW_SAMPLE_CONTENT=true. En producción cada sección muestra datos reales o no aparece.
export const SHOW_SAMPLES = process.env.NODE_ENV === "development" || process.env.SHOW_SAMPLE_CONTENT === "true"

export const HOME_HERO = {
  titleStart: "Acá no avanzás sola:",
  titleHighlight: "crecemos juntas",
  description: "Una comunidad de emprendedoras que se acompañan para vender más, ordenar sus números y crecer.",
  secondaryCta: "Mirá qué hay adentro",
  photo: { src: "/images/home/comunidad-charla.jpg", alt: "Grupo de mujeres charlando y riéndose en un sillón" },
}

export const HOME_SECTION_IDS = {
  inside: "adentro",
  courses: "cursos",
  notes: "notas",
  products: "productos",
  events: "eventos",
}

export const HOME_COURSES = {
  title: "Cursos para",
  titleHighlight: "empezar hoy",
  description: "A tu ritmo, con contenidos simples y prácticos.",
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
  title: "QUIERO",
  description: "De vender por redes a tener tu tienda online. Te acompañamos en cada paso.",
  cta: "Conocé QUIERO",
  image: "/images/home/boutique.jpg",
  imageAlt: "Emprendedora preparando prendas en su tienda",
}

export const HOME_STATEMENT = {
  text: "Arrancar sola cuesta. Por eso armamos un lugar para aprender, encontrarnos y crecer juntas.",
}

export const HOME_VOICES = {
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
  samples: [
    { title: "Café de emprendedoras", meta: "Presencial · Buenos Aires", startsAt: "2026-11-20T21:00:00.000Z" },
    { title: "Charla: vender por WhatsApp", meta: "Online", startsAt: "2026-11-26T22:00:00.000Z" },
    { title: "Taller: tu marca en una tarde", meta: "Online", startsAt: "2026-12-03T22:00:00.000Z" },
  ],
}

export const HOME_CLOSING = {
  hashtag: "#HoyTambiénSoyMás",
  title: "Sumate a la",
  titleHighlight: "comunidad",
  description: "Crear tu cuenta es gratis. Adentro te esperan los cursos, las notas y otras mujeres como vos.",
  cta: "Unirme a Mujeres x Más",
}

export const HOME_CLOSING_CTA_ID = "cta-cierre"
