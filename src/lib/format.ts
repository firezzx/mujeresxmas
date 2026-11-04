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

// { day: "12", month: "nov", time: "19:00" }, para el calendario de un evento
export const formatDateParts = (iso: string) => {
  const date = new Date(iso)
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("es-AR", { ...options, timeZone: TIME_ZONE }).format(date)
  return {
    day: part({ day: "numeric" }),
    month: part({ month: "short" }).replace(".", ""),
    time: part({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
  }
}

const relative = new Intl.RelativeTimeFormat("es-AR", { numeric: "auto" })
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
]

// "hace 5 minutos", "ayer", "hace 2 semanas". Recibe la hora actual para no depender del render.
export const formatTimeAgo = (iso: string, now: number) => {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000)
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit)
  }
  return "recién"
}
