import type { Metadata } from "next"

import { MembershipPage } from "@/components/plans/membership-page"
import { MEMBERSHIP_PAGE } from "@/content/membresia"

export const metadata: Metadata = {
  title: "Membresía",
  description: MEMBERSHIP_PAGE.metaDescription,
}

// Membresía: abierta a todo el mundo y, con sesión, marca el plan que tiene la usuaria.
// Acá se va a contratar y pagar cuando estén los cobros.
export default function Page() {
  return <MembershipPage />
}
