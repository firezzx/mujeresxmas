"use server"

import { refresh } from "next/cache"

import { getAccountSummary } from "@/lib/account"
import { getAdminView, listMembers } from "@/lib/admin"
import { cancelKiero, subscribeToKiero } from "@/lib/kiero"
import { createClient } from "@/lib/supabase/server"

export type KieroActionState = { status: "idle" | "done" } | { status: "error"; message: string }

const FAILED = "Kiero no respondió. Volvé a intentar en un rato."

async function save(
  userId: string,
  email: string,
  status: string,
  extra: { token?: string | null; expiresAt?: string | null; canceled?: boolean } = {}
) {
  const supabase = await createClient()
  const { error } = await supabase.rpc("save_kiero_account", {
    target: userId,
    account_email: email,
    account_status: status,
    token: extra.token ?? null,
    expires_at: extra.expiresAt ?? null,
    canceled: extra.canceled ?? false,
  })
  if (error) console.error("[save_kiero_account]", error.code, error.message)
  return !error
}

// La usuaria activa su tienda: solo con un plan pago activo (Crecer).
export async function activateMyKiero(): Promise<KieroActionState> {
  const summary = await getAccountSummary()
  if (!summary?.user.email) return { status: "error", message: "Iniciá sesión para activar Kiero." }
  if (!summary.membership || summary.membership.planPriceArs <= 0) {
    return { status: "error", message: "Kiero viene incluido en el plan Crecer." }
  }

  const result = await subscribeToKiero(summary.user.email)
  if (!result.ok) return { status: "error", message: FAILED }

  const { email, status, invitationToken, invitationExpiresAt } = result.data
  await save(summary.user.id, email, status, { token: invitationToken, expiresAt: invitationExpiresAt })
  refresh()
  return { status: "done" }
}

// Alta o baja manual desde el panel, para cualquier usuaria (p. ej. mientras no están los cobros).
export async function setMemberKiero(userId: string, active: boolean): Promise<KieroActionState> {
  if ((await getAdminView()) !== "admin") {
    return { status: "error", message: "Solo las administradoras pueden hacer esto." }
  }
  const member = (await listMembers())?.find((m) => m.id === userId)
  if (!member) return { status: "error", message: "No encontramos a esa persona." }

  if (active) {
    const result = await subscribeToKiero(member.email)
    if (!result.ok) return { status: "error", message: FAILED }
    const { email, status, invitationToken, invitationExpiresAt } = result.data
    await save(userId, email, status, { token: invitationToken, expiresAt: invitationExpiresAt })
  } else {
    const result = await cancelKiero(member.email)
    if (!result.ok) return { status: "error", message: FAILED }
    await save(userId, result.data.email, result.data.status, { canceled: true })
  }

  refresh()
  return { status: "done" }
}
