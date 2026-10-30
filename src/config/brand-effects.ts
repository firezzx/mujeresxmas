// Colores de marca en hex para los efectos de Magic UI que no aceptan variables CSS
// (canvas, partículas, degradés armados en JS). Equivalen a --brand y sus tonos en globals.css.
export const BRAND_HEX = {
  brand: "#cb4f73",
  light: "#ef9ca9",
  soft: "#ffe7ea",
  lilac: "#c882c2",
  ink: "#1e191f",
}

// Paletas listas para cada efecto
export const AURORA_COLORS = [BRAND_HEX.brand, BRAND_HEX.lilac, BRAND_HEX.light, BRAND_HEX.brand]
export const SPARKLE_COLORS = { first: BRAND_HEX.brand, second: BRAND_HEX.lilac }
export const CONFETTI_COLORS = [BRAND_HEX.brand, BRAND_HEX.light, BRAND_HEX.lilac, BRAND_HEX.soft, BRAND_HEX.ink]
