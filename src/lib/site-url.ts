import { headers } from "next/headers"

// Origen del sitio desde donde se hizo el pedido (local, preview o producción).
// Next.js ya rechaza las Server Actions cuyo Origin no coincide con el host, y Supabase
// solo acepta redirecciones incluidas en su lista de URLs permitidas.
export async function getRequestOrigin() {
  const origin = (await headers()).get("origin")
  return origin ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
}

// Evita redirecciones abiertas: solo se aceptan rutas internas ("/algo", nunca "//dominio").
export function safeInternalPath(path: string | null | undefined, fallback: string) {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
    return fallback
  }
  return path
}
