import type { Metadata } from "next"
import { Suspense } from "react"

import { AdminLoadError, AdminSection, AdminSectionSkeleton } from "@/components/admin/admin-ui"
import { PlanForm } from "@/components/admin/plan-form"
import { Band } from "@/components/page-band"
import { listPlans } from "@/lib/plans"

export const metadata: Metadata = {
  title: "Planes · Administración",
  robots: { index: false },
}

// Sección Planes: nombre, precio, descripción y beneficios de cada plan.
export default function AdminPlansPage() {
  return (
    <Suspense
      fallback={
        <Band className="py-3 md:py-3">
          <AdminSectionSkeleton />
        </Band>
      }
    >
      <PlanSections />
    </Suspense>
  )
}

async function PlanSections() {
  const plans = await listPlans()
  if (!plans) {
    return (
      <Band className="py-3 md:py-3">
        <AdminLoadError />
      </Band>
    )
  }

  return plans.map((plan) => (
    <AdminSection
      key={plan.id}
      title={plan.name}
      description={
        plan.isActive ? "Disponible para los usuarios." : "Todavía no se puede contratar: faltan los cobros."
      }
    >
      <PlanForm plan={plan} />
    </AdminSection>
  ))
}
