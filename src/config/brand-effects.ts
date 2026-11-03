// Paleta oficial de la marca en hex, para los efectos de Magic UI que no aceptan variables CSS
// (canvas, partículas, degradés armados en JS). Equivalen a --brand y sus tonos en globals.css.
export const BRAND_HEX = {
  brand: "#FF4F00", // Naranja
  pink: "#EABBD2", // Rosa
  green: "#5AAD8B", // Verde
  ink: "#1A1A1A", // Negro 90%
  white: "#FFFFFF", // Blanco
  // Naranja más claro para el movimiento de Aurora
  brandLight: "#FF8A54",
  // Rosa muy suave para el brillo de las tarjetas: el rosa puro taparía el contenido
  pinkTint: "#FBEEF4",
}

// Paletas listas para cada efecto. Aurora va sobre texto: solo naranja, porque el rosa casi no se
// lee sobre blanco y el verde mezclado con el naranja da un marrón apagado.
export const AURORA_COLORS = [BRAND_HEX.brand, BRAND_HEX.brandLight, BRAND_HEX.brand, BRAND_HEX.brandLight]
export const SPARKLE_COLORS = { first: BRAND_HEX.brand, second: BRAND_HEX.green }
export const CONFETTI_COLORS = [BRAND_HEX.brand, BRAND_HEX.pink, BRAND_HEX.green, BRAND_HEX.ink]
