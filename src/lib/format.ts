// Fechas del sitio, siempre en hora de Argentina para que servidor y navegador coincidan.
const TIME_ZONE = "America/Argentina/Buenos_Aires"

// "29 de octubre de 2026"
export const formatDay = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: TIME_ZONE }).format(
    new Date(iso)
  )

// "octubre de 2026"
export const formatMonth = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric", timeZone: TIME_ZONE }).format(new Date(iso))

// "29/10/2026"
export const formatShortDate = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TIME_ZONE }).format(
    new Date(iso)
  )

// "jue 12 de nov · 19:00"
export const formatDateTime = (iso: string) => {
  const date = new Date(iso)
  const day = new Intl.DateTimeFormat("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: TIME_ZONE,
  }).format(date)
  const time = new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: TIME_ZONE,
  }).format(date)
  return `${day.replace(",", "")} · ${time}`
}
