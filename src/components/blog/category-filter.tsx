import Link from "next/link"

import { ROUTES } from "@/config/navigation"
import type { PublicCategory } from "@/lib/blog"
import { cn } from "@/lib/utils"

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-10 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors sm:px-4 duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        active ? "bg-brand-soft text-foreground" : "text-foreground/55 hover:text-foreground"
      )}
    >
      {active && <span aria-hidden className="size-1.5 rounded-full bg-brand" />}
      {children}
    </Link>
  )
}

// Filtro por categoría del blog. Son links reales: cada filtro tiene su dirección y se puede compartir.
export function CategoryFilter({ categories, active }: { categories: PublicCategory[]; active: string | null }) {
  return (
    <nav aria-label="Filtrar por categoría">
      <ul className="flex w-fit max-w-full flex-wrap gap-1 rounded-lg bg-foreground/[0.035] p-1">
        <li>
          <FilterLink href={ROUTES.blog} active={!active}>
            Todas
          </FilterLink>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <FilterLink href={`${ROUTES.blog}?categoria=${category.slug}`} active={active === category.slug}>
              {category.name}
            </FilterLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
