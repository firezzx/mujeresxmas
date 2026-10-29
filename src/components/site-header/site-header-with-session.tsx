import { SiteHeader } from "@/components/site-header/site-header"
import { getCurrentUser } from "@/lib/supabase/user"

// Lee la sesión en el servidor y entrega el header con la usuaria resuelta.
// Va dentro de <Suspense>; el fallback es el mismo header en estado "pending".
export async function SiteHeaderWithSession() {
  const user = await getCurrentUser()
  return <SiteHeader user={user} />
}
