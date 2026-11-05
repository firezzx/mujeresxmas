import type { IconName } from "@/components/icons/hover-icon"
import { HOME_PRODUCT } from "@/content/home"

// Textos e imágenes de la página de QUIERO, separados del diseño. Son provisorios hasta tener el
// contenido definitivo de la clienta.
export const QUIERO_PAGE = {
  eyebrow: "Un producto de Mujeres x Más",
  title: HOME_PRODUCT.title,
  description: HOME_PRODUCT.description,
  cta: "QUIERO",
  image: HOME_PRODUCT.image,
  imageAlt: HOME_PRODUCT.imageAlt,
  stepsTitle: "Paso a paso,",
  stepsHighlight: "con vos",
  steps: [
    {
      icon: "message-circle",
      title: "Vender por redes",
      text: "Partimos de lo que ya estás haciendo.",
    },
    {
      icon: "rocket",
      title: "Armar tu tienda",
      text: "Damos el salto a tu tienda online.",
    },
    {
      icon: "trending-up",
      title: "Seguir creciendo",
      text: "Te acompañamos en cada paso.",
    },
  ] satisfies { icon: IconName; title: string; text: string }[],
  closingTitle: "¿Arrancamos",
  closingHighlight: "juntas?",
}
