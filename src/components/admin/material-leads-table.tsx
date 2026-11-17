"use client"

import { useDeferredValue, useState, useTransition } from "react"

import { setLeadSubscribed } from "@/app/actions/email-campaigns"
import { IconBadge } from "@/components/icon-badge"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { SearchIcon, type SearchIconHandle } from "@/components/icons/search"
import { ALL_AUDIENCE } from "@/content/sumate"
import { useIconAnimation } from "@/hooks/use-icon-animation"
import type { MaterialLead } from "@/lib/material-leads"
import { cn } from "@/lib/utils"

export type MaterialLeadRow = MaterialLead & { createdLabel: string }

function matches(lead: MaterialLeadRow, query: string, country: string) {
  if (country !== ALL_AUDIENCE && lead.country !== country) return false
  if (!query) return true
  return [lead.fullName, lead.email, lead.country].some((value) => value.toLowerCase().includes(query))
}

// Planilla con los datos visibles (se abre en Excel o Google Sheets)
function downloadCsv(leads: MaterialLeadRow[]) {
  const cell = (value: string) => `"${value.replace(/"/g, '""')}"`
  const rows = [
    ["Nombre y apellido", "Email", "País", "Origen", "Suscripta", "Fecha"],
    ...leads.map((lead) => [
      lead.fullName,
      lead.email,
      lead.country,
      lead.material,
      lead.subscribed ? "Sí" : "No",
      lead.createdAt.slice(0, 10),
    ]),
  ]
  // BOM: para que Excel lea bien los acentos
  const csv = "﻿" + rows.map((row) => row.map(cell).join(";")).join("\r\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: `contactos-${new Date().toISOString().slice(0, 10)}.csv`,
  })
  link.click()
  URL.revokeObjectURL(url)
}

function SubscribedToggle({ lead }: { lead: MaterialLeadRow }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => setLeadSubscribed(lead.id, !lead.subscribed))}
      title={lead.subscribed ? "Dar de baja de los correos" : "Volver a suscribir"}
      className={cn(
        "inline-flex h-7 shrink-0 cursor-pointer items-center rounded-md px-2.5 text-xs font-medium whitespace-nowrap transition-colors disabled:cursor-wait disabled:opacity-60",
        lead.subscribed
          ? "bg-brand-green/20 text-foreground hover:bg-brand-green/30"
          : "text-muted-foreground ring-1 ring-border hover:bg-foreground/[0.04]"
      )}
    >
      {lead.subscribed ? "Suscripta" : "De baja"}
    </button>
  )
}

// Contactos de la página /sumate, con buscador, filtro por país y planilla para bajar.
export function MaterialLeadsTable({ leads, countries }: { leads: MaterialLeadRow[]; countries: string[] }) {
  const [query, setQuery] = useState("")
  const [country, setCountry] = useState<string>(ALL_AUDIENCE)
  const { iconRef: searchIconRef, triggerProps: searchTriggerProps } = useIconAnimation<SearchIconHandle>()
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const visible = leads.filter((lead) => matches(lead, deferredQuery, country))

  const controlClass =
    "h-11 rounded-lg border border-border bg-background/80 text-sm transition-[border-color,box-shadow] outline-none focus:border-foreground/25 focus:ring-3 focus:ring-ring/20"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label {...searchTriggerProps} className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Buscar registros</span>
            <SearchIcon
              ref={searchIconRef}
              size={16}
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o correo…"
              className={cn(controlClass, "w-full pr-4 pl-10 placeholder:text-muted-foreground/70")}
            />
          </label>
          <label className="block">
            <span className="sr-only">Filtrar por país</span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={cn(controlClass, "w-full cursor-pointer px-4 sm:w-48")}
            >
              <option value={ALL_AUDIENCE}>Todos los países</option>
              {countries.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <p className="text-sm text-muted-foreground">
            {visible.length === leads.length
              ? `${leads.length} ${leads.length === 1 ? "contacto" : "contactos"}`
              : `${visible.length} de ${leads.length}`}
          </p>
          <IconHoverArea>
            <button
              type="button"
              disabled={!visible.length}
              onClick={() => downloadCsv(visible)}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg px-4 text-sm font-medium ring-1 ring-border transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              <HoverIcon name="download" size={16} />
              Exportar planilla
            </button>
          </IconHoverArea>
        </div>
      </div>

      {visible.length === 0 ? (
        <IconHoverArea>
          <div className="flex flex-col items-center rounded-lg border border-dashed border-border px-4 py-10 text-center">
            <IconBadge tone="pink">
              <HoverIcon name="users-round" size={20} />
            </IconBadge>
            <p className="mt-4 font-heading text-lg font-semibold tracking-[-0.01em]">
              {leads.length ? "No encontramos contactos" : "Todavía no hay contactos"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {leads.length
                ? "Probá con otro nombre, correo o país."
                : "Quienes se sumen desde la página de registro van a aparecer acá."}
            </p>
          </div>
        </IconHoverArea>
      ) : (
        <>
          {/* Escritorio */}
          <div className="hidden overflow-hidden rounded-lg border border-border/70 md:block">
            <table className="w-full table-fixed text-left text-sm">
              <thead className="bg-foreground/[0.025] text-xs text-muted-foreground">
                <tr>
                  <th className="w-[26%] px-4 py-3 font-medium">Nombre y apellido</th>
                  <th className="w-[34%] px-4 py-3 font-medium">Email</th>
                  <th className="w-[15%] px-4 py-3 font-medium">País</th>
                  <th className="w-[13%] px-4 py-3 font-medium">Fecha</th>
                  <th className="w-[12%] px-4 py-3 font-medium">Correos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {visible.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-foreground/[0.02]">
                    <td className="truncate px-4 py-3 font-medium">{lead.fullName}</td>
                    <td className="truncate px-4 py-3">
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-brand-green-strong underline-offset-4 hover:underline"
                      >
                        {lead.email}
                      </a>
                    </td>
                    <td className="truncate px-4 py-3">{lead.country}</td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.createdLabel}</td>
                    <td className="px-4 py-3">
                      <SubscribedToggle lead={lead} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Celular */}
          <ul className="flex flex-col divide-y divide-border/70 md:hidden">
            {visible.map((lead) => (
              <li key={lead.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{lead.fullName}</p>
                  <p className="truncate text-sm text-muted-foreground">{lead.email}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {lead.country} · {lead.createdLabel}
                  </p>
                </div>
                <SubscribedToggle lead={lead} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
