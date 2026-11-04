import type { IconName } from "@/components/icons/hover-icon"
import { HOME_PRODUCT } from "@/content/home"

// Textos e imágenes de la página de QUIERO, separados del diseño. Son provisorios hasta tener el
// contenido definitivo de la clienta.
export const QUIERO_PAGE = {
  eyebrow: "Un producto de Mujeres x Más",
  title: HOME_PRODUCT.title,
  description: HOME_PRODUCT.description,
  cta: "QUIERO",
  photos: {
    image: HOME_PRODUCT.image,
    imageAlt: HOME_PRODUCT.imageAlt,
    secondImage: HOME_PRODUCT.secondImage,
    secondImageAlt: HOME_PRODUCT.secondImageAlt,
    chip: HOME_PRODUCT.chip,
  },
  stepsTitle: "Paso a paso,",
  stepsHighlight: "con vos",
  steps: [
    {
      icon: "message-circle",
      title: "Vender por redes",
      text: "Partimos de lo que ya estás haciendo.",
      image: "/images/home/marketing.jpg",
      tone: "pink",
    },
    {
      icon: "rocket",
      title: "Armar tu tienda",
      text: "Damos el salto a tu tienda online.",
      image: "/images/home/florista.jpg",
      tone: "brand",
    },
    {
      icon: "trending-up",
      title: "Seguir creciendo",
      text: "Te acompañamos en cada paso.",
      image: "/images/home/socias-negocio.jpg",
      tone: "green",
    },
  ] satisfies { icon: IconName; title: string; text: string; image: string; tone: "pink" | "brand" | "green" }[],
  closingTitle: "¿Arrancamos",
  closingHighlight: "juntas?",
}
