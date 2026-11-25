import { JOIN_LABEL } from "@/config/navigation"

// Textos de la página de planes. Los nombres, precios y beneficios se cargan desde el panel de
// administración (/admin/planes).
export const PLANS_PAGE = {
  eyebrow: "Planes",
  title: { start: "Un plan para ", highlight: "cada etapa", end: " de tu negocio" },
  description:
    "Desde contenidos gratuitos hasta soluciones estratégicas. Elegí el plan y llevá tu proyecto al siguiente nivel.",
  guestCta: JOIN_LABEL,
  currentBadge: "Tu plan",
  currentAction: "Este es tu plan",
  comingSoon: "Próximamente",
  perMonth: "por mes",
  free: "Gratis",
  // Plan destacado (tarjeta negra) y lo que dice cada tarjeta arriba del nombre
  featuredPlanId: "crecimiento",
  featuredBadge: "La más elegida",
  // Etiqueta de la tarjeta que coincide con el momento elegido en Membresía
  recommendedBadge: "Para vos",
  priceToConfirm: "A confirmar",
  taglines: {
    gratis: "Para empezar",
    crecimiento: "Para crecer en serio",
    impulso: "Para escalar",
  } as Record<string, string>,
  // Lo que se muestra al lado de "Gratis" en la tarjeta del plan sin costo (vacío para ocultarlo)
  freeReference: "$ 00000",
  // Rótulo arriba de la lista de beneficios de cada tarjeta
  includesLabel: "Incluye",
}
