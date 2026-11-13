import type { Metadata } from "next"
import { Suspense } from "react"

import { AdminLoadError, AdminSection, AdminSectionSkeleton } from "@/components/admin/admin-ui"
import { Band } from "@/components/page-band"
import { listCompanyLeads } from "@/lib/company-leads"
import { formatDateTime } from "@/lib/format"

export const metadata: Metadata = {
  title: "Empresas · Administración",
  robots: { index: false },
}

// Sección Empresas: los pedidos de propuesta que llegan desde /empresas.
export default function AdminCompaniesPage() {
  return (
    <Suspense
      fallback={
        <Band className="py-3 md:py-3">
          <AdminSectionSkeleton />
        </Band>
      }
    >
      <CompanyLeads />
    </Suspense>
  )
}

async function CompanyLeads() {
  const leads = await listCompanyLeads()
  if (!leads) {
    return (
      <Band className="py-3 md:py-3">
        <AdminLoadError />
      </Band>
    )
  }

  return (
    <AdminSection
      title="Pedidos de propuesta"
      description="Empresas y organizaciones que completaron el formulario de la página de Empresas."
    >
      {leads.length === 0 ? (
        <p className="text-[15px] text-muted-foreground">Todavía no llegó ningún pedido.</p>
      ) : (
        <ul className="divide-y divide-foreground/[0.06]">
          {leads.map((lead) => (
            <li key={lead.id} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="flex min-w-0 flex-col gap-1">
                <p className="font-medium">
                  {lead.company} <span className="font-normal text-muted-foreground">· {lead.fullName}</span>
                </p>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-sm break-all text-brand-green-strong underline-offset-4 hover:underline"
                >
                  {lead.email}
                </a>
                <p className="text-sm text-muted-foreground">{lead.audience}</p>
              </div>
              <time dateTime={lead.createdAt} className="shrink-0 text-sm text-muted-foreground">
                {formatDateTime(lead.createdAt)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </AdminSection>
  )
}
