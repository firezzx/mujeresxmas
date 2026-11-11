import type { Metadata } from "next"

import { PlansPage } from "@/components/plans/plans-page"
import { PLANS_PAGE } from "@/content/planes"

export const metadata: Metadata = {
  title: "Planes",
  description: PLANS_PAGE.description,
}

// Página de planes: abierta a todo el mundo y, con sesión, marca el plan que tiene la usuaria.
// Acá se va a contratar y pagar cuando estén los cobros.
export default function Page() {
  return <PlansPage />
}
