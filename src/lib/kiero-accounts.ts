import { createClient } from "@/lib/supabase/server"

// Lo que quedó guardado de cada usuaria en Kiero (tabla kiero_accounts).
export type KieroAccount = {
  userId: string
  email: string
  status: string
  invitationToken: string | null
  invitationExpiresAt: string | null
  canceledAt: string | null
  updatedAt: string
}

type KieroAccountRow = {
  user_id: string
  email: string
  status: string
  invitation_token: string | null
  invitation_expires_at: string | null
  canceled_at: string | null
  updated_at: string
}

const COLUMNS = "user_id, email, status, invitation_token, invitation_expires_at, canceled_at, updated_at"

const toAccount = (row: KieroAccountRow): KieroAccount => ({
  userId: row.user_id,
  email: row.email,
  status: row.status,
  invitationToken: row.invitation_token,
  invitationExpiresAt: row.invitation_expires_at,
  canceledAt: row.canceled_at,
  updatedAt: row.updated_at,
})

// Cuenta de Kiero de una usuaria (la RLS deja ver solo la propia, o todas a las administradoras)
export async function getKieroAccount(userId: string): Promise<KieroAccount | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("kiero_accounts").select(COLUMNS).eq("user_id", userId).maybeSingle()
  if (error) console.error("[getKieroAccount]", error.code, error.message)
  return data ? toAccount(data as KieroAccountRow) : null
}

// Todas las cuentas, para el panel de administración
export async function listKieroAccounts(): Promise<Map<string, KieroAccount>> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("kiero_accounts").select(COLUMNS)
  if (error) console.error("[listKieroAccounts]", error.code, error.message)
  return new Map((data as KieroAccountRow[] | null)?.map((row) => [row.user_id, toAccount(row)]) ?? [])
}

// Estados que puede devolver Kiero, en palabras. Si llega uno que no está acá, se muestra tal cual.
const STATUS_LABELS: Record<string, string> = {
  invited: "Invitación enviada",
  pending: "Invitación enviada",
  active: "Activa",
  registered: "Activa",
  suspended: "Suspendida",
  scheduled_suspension: "Baja programada",
  canceled: "Dada de baja",
  cancelled: "Dada de baja",
}

export function kieroStatusLabel(account: Pick<KieroAccount, "status" | "canceledAt">) {
  if (account.canceledAt && !STATUS_LABELS[account.status.toLowerCase()]) return "Dada de baja"
  return STATUS_LABELS[account.status.toLowerCase()] ?? account.status
}
