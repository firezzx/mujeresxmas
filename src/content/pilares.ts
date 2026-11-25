import type { IconName } from "@/components/icons/hover-icon"
import type { IconBadgeTone } from "@/components/icon-badge"
import type { BandTone } from "@/components/page-band"
import { ROUTES } from "@/config/navigation"

// Los tres pilares de la membresía: el inicio muestra el resumen y cada página del menú, el detalle.
// Los textos se cambian acá, sin tocar los componentes.

// En qué membresía está cada servicio. Los nombres y precios de los planes se editan en el admin,
// por eso acá solo se distingue lo gratuito de lo que viene con un plan pago.
export const ACCESS_LABELS = {
  free: "Gratis",
  // Gratis al registrarse (plan Inicio)
  starter: "Gratis con el plan Inicio",
  member: "Con membresía",
}

export type Access = keyof typeof ACCESS_LABELS

export type PillarItem = {
  icon: IconName
  title: string
  text: string
  access: Access
  // Logo en lugar del ícono (p. ej. el isologo de Kiero) y link a otra página
  logo?: { src: string; alt: string }
  link?: { href: string; label: string }
}

export type Pillar = {
  slug: "desarrollo" | "bienestar" | "conexion"
  href: string
  name: string
  // Rótulo manuscrito sobre la foto
  tag: string
  // Resumen para la tarjeta del inicio
  summary: string
  // Completa "Es para vos si…"
  forYou: string
  icon: IconName
  badgeTone: IconBadgeTone
  heroTone: BandTone
  image: string
  imageAlt: string
  hero: { titleStart: string; titleHighlight: string; description: string }
  services: { title: string; description: string; items: PillarItem[] }
  // Bloque extra opcional (la Academia en Desarrollo). hidden: no se muestra por ahora
  extra?: { eyebrow: string; title: string; description: string; items: PillarItem[]; hidden?: boolean }
}

export const PILLARS: Record<Pillar["slug"], Pillar> = {
  desarrollo: {
    slug: "desarrollo",
    href: ROUTES.desarrollo,
    name: "Desarrollo",
    tag: "tu propio camino",
    summary:
      "Formación práctica y herramientas para generar ingresos propios: ordenar tu negocio, llevarlo a lo digital y hacerlo crecer.",
    forYou: "emprendés o querés reinventarte en lo profesional.",
    icon: "rocket",
    badgeTone: "green",
    heroTone: "green",
    image: "/images/home/formacion-casa.jpg",
    imageAlt: "Mujer estudiando con su computadora en casa",
    hero: {
      titleStart: "Lo que necesitás para",
      titleHighlight: "crecer",
      description:
        "Acompañamiento concreto para ordenar tu negocio, llevarlo a lo digital y hacerlo crecer con herramientas probadas.",
    },
    services: {
      title: "Cómo te acompañamos",
      description: "Cada servicio te dice si es gratis o si viene con la membresía.",
      items: [
        {
          icon: "chart-line",
          title: "Diagnóstico y plan de negocio",
          text: "Una mirada honesta sobre dónde está tu emprendimiento y un plan de acción con prioridades claras.",
          access: "starter",
        },
        {
          icon: "cpu",
          title: "Digitalización",
          text: "Presencia online, catálogo, pedidos y cobros con herramientas simples, sumando automatización e IA.",
          access: "member",
        },
        {
          icon: "layout-panel-top",
          title: "Tu tienda online con Kiero",
          text: "Tu ecommerce listo en tres pasos, cobrando con los medios que elijas.",
          access: "member",
          // Falta el isologo de Kiero (lo pasa Ian): cargarlo en public/brand y sumar
          // logo: { src: "/brand/kiero-isologo.svg", alt: "Kiero" }
          link: { href: ROUTES.kiero, label: "Conocé Kiero" },
        },
        {
          icon: "graduation-cap",
          title: "Academia",
          // Texto provisorio hasta que se defina el contenido de la Academia
          text: "Cursos prácticos y online para cada etapa de tu negocio, con certificado.",
          access: "member",
        },
        {
          icon: "users-round",
          title: "Mentoría uno a uno",
          text: "Mentoras que ya recorrieron el camino, a tu lado en las decisiones difíciles.",
          access: "member",
        },
      ],
    },
    extra: {
      eyebrow: "Academia",
      // Oculta por ahora (pedido de la clienta); se vuelve a mostrar sacando esta línea
      hidden: true,
      title: "Formación para cada paso de tu negocio",
      description:
        "Cursos prácticos, online y con certificado. Nacieron en Mujeres por Más y ahora crecen en el nuevo campus.",
      items: [
        {
          icon: "sparkles",
          title: "Primeros pasos",
          text: "Contenidos simples para arrancar con el pie derecho.",
          access: "free",
        },
        {
          icon: "cpu",
          title: "Tecnología e IA",
          text: "Herramientas digitales, automatización e inteligencia artificial para trabajar mejor.",
          access: "member",
        },
        {
          icon: "message-circle",
          title: "Comunicación y marketing digital",
          text: "Contenido, redes y datos para conseguir más clientas.",
          access: "member",
        },
        {
          icon: "rocket",
          title: "Emprendimiento",
          text: "Tu idea convertida en un negocio rentable, con bases claras y foco en resultados.",
          access: "member",
        },
        {
          icon: "wallet",
          title: "Finanzas personales y del negocio",
          text: "Ordenar los ingresos y tomar decisiones con los números en la mano.",
          access: "member",
        },
        {
          icon: "graduation-cap",
          title: "Programación certificada",
          text: "Rutas de aprendizaje con certificado, junto a empresas de tecnología.",
          access: "member",
        },
      ],
    },
  },
  bienestar: {
    slug: "bienestar",
    href: ROUTES.bienestar,
    name: "Bienestar",
    tag: "cuidarte también es crecer",
    summary:
      "Acompañamiento físico, mental, emocional y social para cada momento de tu vida, sin juicios y a tu ritmo.",
    forYou: "estás atravesando un cambio y querés cuidarte en el camino.",
    icon: "sparkles",
    badgeTone: "pink",
    heroTone: "pink",
    image: "/images/home/florista-taller.jpg",
    imageAlt: "Florista sonriendo mientras arma un ramo",
    hero: {
      titleStart: "Cuidarte también es",
      titleHighlight: "crecer",
      description:
        "Acompañamiento físico, mental, emocional y social para cada momento de tu vida: sin juicios y buscando el equilibrio entre el trabajo, la familia y el tiempo para vos.",
    },
    services: {
      title: "Cómo te acompañamos",
      description: "Cada servicio te dice si es gratis o si viene con la membresía.",
      items: [
        {
          icon: "book-text",
          title: "Contenidos para cada etapa",
          text: "Salud física, mental, emocional y social, según el momento que estés viviendo.",
          access: "free",
        },
        {
          icon: "message-circle",
          title: "Espacios de escucha",
          text: "Encuentros grupales todos los meses, coordinados por profesionales.",
          access: "member",
        },
        {
          icon: "sparkles",
          title: "Talleres de hábitos y salud",
          text: "Descanso, movimiento, alimentación y manejo del estrés.",
          access: "member",
        },
        {
          icon: "users-round",
          title: "Acompañamiento individual",
          text: "Sesiones personales para atravesar un cambio con apoyo.",
          access: "member",
        },
      ],
    },
  },
  conexion: {
    slug: "conexion",
    href: ROUTES.conexion,
    name: "Conexión",
    tag: "la red que suma",
    summary: "Espacios para crear vínculos y hacer networking de verdad con otras mujeres, empresas y organizaciones.",
    forYou: "buscás red, alianzas o nuevas oportunidades.",
    icon: "users-round",
    badgeTone: "brand",
    heroTone: "soft",
    image: "/images/home/conexion-taller.jpg",
    imageAlt: "Mujeres riéndose juntas en un taller de la comunidad",
    hero: {
      titleStart: "La red que",
      titleHighlight: "suma",
      description:
        "Espacios para sostener vínculos y hacer networking en cada etapa: con otras mujeres, con empresas y con organizaciones.",
    },
    services: {
      title: "Cómo te conectamos",
      description: "Cada espacio te dice si es gratis o si viene con la membresía.",
      items: [
        {
          icon: "users-round",
          title: "Comunidad y encuentros",
          text: "Red online y encuentros abiertos en más de 28 localidades.",
          access: "free",
        },
        {
          icon: "calendar-days",
          title: "Networking por rubro",
          text: "Encuentros mensuales con mujeres de tu mismo sector.",
          access: "member",
        },
        {
          icon: "link",
          title: "Red de proveedoras",
          text: "Comprá con beneficios y ofrecé lo que hacés dentro de la red.",
          access: "member",
        },
        {
          icon: "trending-up",
          title: "Alianzas con empresas",
          text: "Un perfil destacado y acceso a oportunidades con organizaciones.",
          access: "member",
        },
      ],
    },
  },
}

export const PILLAR_LIST = [PILLARS.desarrollo, PILLARS.bienestar, PILLARS.conexion]

// Cierre de cada página de pilar
export const PILLAR_CLOSING = {
  hand: "no caminás sola",
  title: "Elegí tu plan y",
  titleHighlight: "empezá hoy",
  description: "Empezás gratis y pasás a la membresía cuando lo necesites.",
  plansCta: "Ver las membresías",
  othersTitle: "Conocé los otros pilares",
}

// Página general de los pilares (/pilares)
export const PILLARS_PAGE = {
  eyebrow: "Crecemos con vos",
  titleStart: "Tres pilares,",
  titleHighlight: "una sola membresía",
  description:
    "Todo lo que ofrece Mujeres x Más, ordenado por pilar. En cada servicio ves si es gratis o si viene con la membresía.",
  pillarEyebrow: "Pilar",
  moreLabel: "Ver todo",
  academyNote: "Además, la Academia: cursos online y con certificado para cada paso de tu negocio.",
  academyLabel: "Academia",
  // Dato destacado de Conexión
  networkStat: { value: "+28", label: "localidades con encuentros abiertos" },
  // Foto de fondo del cierre (va con un velo oscuro encima)
  closingImage: "/images/home/colegas-charla.jpg",
  closingHand: "no caminás sola",
  closingTitle: "Elegí tu membresía y",
  closingHighlight: "empezá hoy",
}

// Super menú de Pilares en el encabezado (escritorio)
export const PILLARS_MENU = {
  eyebrow: "Pilares",
  description: "Elegí por dónde empezar: cada pilar suma servicios gratis y otros que vienen con la membresía.",
  allLabel: "Ver todos los pilares",
}
