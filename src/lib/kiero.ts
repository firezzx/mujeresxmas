import { z } from "zod"

// API de partners de Kiero (https://dashboard.kiero.tech/api/docs/). Da de alta (invitación) y de
// baja a una persona por su correo. La clave va solo en el servidor (KIERO_API_KEY).
//
// Modo prueba (el predeterminado): no se conecta con Kiero, simula sus respuestas. La API real
// se usa solo con KIERO_MODE=live y la clave cargada, para no tocar datos de Kiero sin querer.

const DEFAULT_API_URL = "https://dashboard.kiero.tech"
const TIMEOUT_MS = 10_000

const subscriptionSchema = z.object({
  email: z.string(),
  status: z.string(),
  invitation_token: z.string().nullish(),
  invitation_expires_at: z.string().nullish(),
})

const cancellationSchema = z.object({
  email: z.string(),
  status: z.string(),
})

export type KieroSubscription = {
  email: string
  status: string
  invitationToken: string | null
  invitationExpiresAt: string | null
}

export type KieroResult<T> = { ok: true; data: T } | { ok: false }

export function isKieroLive() {
  return process.env.KIERO_MODE === "live" && Boolean(process.env.KIERO_API_KEY)
}

const TEST_INVITATION_DAYS = 7

function testSubscription(email: string): KieroSubscription {
  return {
    email,
    status: "invited",
    invitationToken: `prueba-${crypto.randomUUID()}`,
    invitationExpiresAt: new Date(Date.now() + TEST_INVITATION_DAYS * 24 * 60 * 60 * 1000).toISOString(),
  }
}

async function post(path: string, email: string): Promise<unknown | null> {
  const base = (process.env.KIERO_API_URL || DEFAULT_API_URL).replace(/\/$/, "")
  try {
    const response = await fetch(`${base}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-Key": process.env.KIERO_API_KEY!,
      },
      body: JSON.stringify({ email }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!response.ok) {
      console.error("[kiero]", path, response.status, (await response.text()).slice(0, 300))
      return null
    }
    return await response.json()
  } catch (error) {
    console.error("[kiero]", path, error instanceof Error ? error.message : error)
    return null
  }
}

// Crea la invitación o devuelve la suscripción que ya existe para ese correo.
export async function subscribeToKiero(email: string): Promise<KieroResult<KieroSubscription>> {
  if (!isKieroLive()) return { ok: true, data: testSubscription(email) }
  const parsed = subscriptionSchema.safeParse(await post("/api/v1/partners/subscriptions/", email))
  if (!parsed.success) return { ok: false }
  return {
    ok: true,
    data: {
      email: parsed.data.email,
      status: parsed.data.status,
      invitationToken: parsed.data.invitation_token ?? null,
      invitationExpiresAt: parsed.data.invitation_expires_at ?? null,
    },
  }
}

// Cancela la invitación o programa la suspensión de la cuenta.
export async function cancelKiero(email: string): Promise<KieroResult<{ email: string; status: string }>> {
  if (!isKieroLive()) return { ok: true, data: { email, status: "canceled" } }
  const parsed = cancellationSchema.safeParse(await post("/api/v1/partners/cancellations/", email))
  if (!parsed.success) return { ok: false }
  return { ok: true, data: parsed.data }
}

// Link para aceptar la invitación, si Kiero lo pasa armado con el token (KIERO_INVITE_URL con {token}).
export function kieroInviteUrl(token: string | null) {
  if (!isKieroLive()) return null
  const template = process.env.KIERO_INVITE_URL
  if (!token || !template?.includes("{token}")) return null
  return template.replace("{token}", encodeURIComponent(token))
}
