// Retratos de mujeres de 28 a 50 años de Argentina y la región (public/images/home/retratos), fotos
// de Pexels en blanco y negro; el origen de cada una está en docs/IMAGENES-PEXELS.md. Son decorativos: se
// muestran con alt vacío. Para cambiarlos alcanza con reemplazar los archivos.
export const COMMUNITY_PORTRAITS = Array.from(
  { length: 16 },
  (_, index) => `/images/home/retratos/comunidad-${String(index + 1).padStart(2, "0")}.jpg`
)
