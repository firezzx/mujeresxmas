// Retratos recortados del mosaico de mujeres (public/images/home/retratos). Son decorativos: se
// muestran con alt vacío. Para cambiarlos alcanza con reemplazar los archivos.
export const COMMUNITY_PORTRAITS = Array.from(
  { length: 16 },
  (_, index) => `/images/home/retratos/retrato-${String(index + 1).padStart(2, "0")}.jpg`
)
