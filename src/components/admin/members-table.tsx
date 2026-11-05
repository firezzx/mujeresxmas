"use client"

import { useDeferredValue, useState } from "react"

import { SearchIcon, type SearchIconHandle } from "@/components/icons/search"
import { IconBadge } from "@/components/icon-badge"
import { UsersRoundIcon } from "@/components/icons/users-round"
import { UserAvatar } from "@/components/site-header/user-menu"
import { useIconAnimation } from "@/hooks/use-icon-animation"
import type { AdminMember } from "@/lib/admin"
import { cn } from "@/lib/utils"

export type MemberRow = AdminMember & { joinedLabel: string; lastSeenLabel: string | null }

const fullName = (m: MemberRow) => [m.firstName, m.lastName].filter(Boolean).join(" ")

function matches(member: MemberRow, query: string) {
  if (!query) return true
  return [fullName(member), member.email, member.city, member.businessName, member.phone]
    .filter(Boolean)
    .some((value) => value!.toLowerCase().includes(query))
}

function Badge({ tone = "soft", children }: { tone?: "soft" | "solid" | "outline"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-md px-2.5 text-xs font-medium whitespace-nowrap",
        tone === "soft" && "bg-brand-soft text-foreground",
        tone === "solid" && "bg-primary text-primary-foreground",
        tone === "outline" && "text-muted-foreground ring-1 ring-border"
      )}
    >
      {children}
    </span>
  )
}

function MemberBadges({ member }: { member: MemberRow }) {
  return (
    <>
      {member.isAdmin && <Badge tone="solid">Admin</Badge>}
      {!member.emailConfirmed && <Badge tone="outline">Sin confirmar</Badge>}
    </>
  )
}

function Identity({ member }: { member: MemberRow }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar user={member} className="size-10 shrink-0" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {fullName(member) || <span className="text-muted-foreground">Sin nombre</span>}
        </p>
        <p className="truncate text-sm text-muted-foreground">{member.email}</p>
      </div>
    </div>
  )
}

// Lista de usuarias con buscador: tabla en escritorio y tarjetas en celular.
export function MembersTable({ members }: { members: MemberRow[] }) {
  const [query, setQuery] = useState("")
  const { iconRef: searchIconRef, triggerProps: searchTriggerProps } = useIconAnimation<SearchIconHandle>()
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const visible = members.filter((member) => matches(member, deferredQuery))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label {...searchTriggerProps} className="relative block w-full sm:max-w-xs">
          <span className="sr-only">Buscar usuarios</span>
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
            placeholder="Buscar por nombre, correo, ciudad…"
            className="h-11 w-full rounded-lg border border-border bg-background/80 pr-4 pl-10 text-sm transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground/70 focus:border-foreground/25 focus:ring-3 focus:ring-ring/20"
          />
        </label>
        <p className="text-sm text-muted-foreground">
          {visible.length === members.length
            ? `${members.length} ${members.length === 1 ? "usuario" : "usuarios"}`
            : `${visible.length} de ${members.length}`}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded-lg border border-dashed border-border px-4 py-10 text-center">
          <IconBadge tone="pink">
            <UsersRoundIcon size={20} />
          </IconBadge>
          <p className="mt-4 font-heading text-lg font-semibold tracking-[-0.01em]">
            {members.length ? "No encontramos usuarios" : "Todavía no hay usuarios"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {members.length ? "Probá con otro nombre, correo o ciudad." : "Los registrados van a aparecer acá."}
          </p>
        </div>
      ) : (
        <>
          {/* Escritorio */}
          <div className="hidden overflow-hidden rounded-lg border border-border/70 md:block">
            <table className="w-full table-fixed text-left text-sm">
              <thead className="bg-foreground/[0.025] text-xs text-muted-foreground">
                <tr>
                  <th className="w-[34%] px-4 py-3 font-medium">Usuario</th>
                  <th className="w-[24%] px-4 py-3 font-medium">Emprendimiento</th>
                  <th className="w-[14%] px-4 py-3 font-medium">Plan</th>
                  <th className="w-[14%] px-4 py-3 font-medium">Se sumó</th>
                  <th className="w-[14%] px-4 py-3 font-medium">Último ingreso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {visible.map((member) => (
                  <tr key={member.id} className="transition-colors hover:bg-foreground/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Identity member={member} />
                        <div className="ml-auto flex gap-1.5">
                          <MemberBadges member={member} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="truncate">
                        {member.businessName || <span className="text-muted-foreground">—</span>}
                      </p>
                      {member.city && <p className="truncate text-sm text-muted-foreground">{member.city}</p>}
                    </td>
                    <td className="px-4 py-3">{member.planName ? <Badge>{member.planName}</Badge> : "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{member.joinedLabel}</td>
                    <td className="px-4 py-3 text-muted-foreground">{member.lastSeenLabel ?? "Nunca"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Celular */}
          <ul className="flex flex-col gap-2 md:hidden">
            {visible.map((member) => (
              <li key={member.id} className="rounded-lg border border-border/70 p-4">
                <Identity member={member} />
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {member.planName && <Badge>{member.planName}</Badge>}
                  <MemberBadges member={member} />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {member.businessName && (
                    <div className="col-span-2">
                      <dt className="text-muted-foreground">Emprendimiento</dt>
                      <dd className="truncate">{member.businessName}</dd>
                    </div>
                  )}
                  {member.city && (
                    <div className="col-span-2">
                      <dt className="text-muted-foreground">Ciudad</dt>
                      <dd className="truncate">{member.city}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-muted-foreground">Se sumó</dt>
                    <dd>{member.joinedLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Último ingreso</dt>
                    <dd>{member.lastSeenLabel ?? "Nunca"}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
