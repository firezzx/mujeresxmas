import Link from "next/link"

import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { pillLinkVariants } from "@/components/pill-link"
import { ROUTES } from "@/config/navigation"

const LINK_CLASS = pillLinkVariants({ variant: "outline", size: "md", className: "rounded-lg" })

type BlogPaginationProps = {
  page: number
  totalPages: number
  category: string | null
}

// Anterior y siguiente del blog, conservando el filtro de categoría.
export function BlogPagination({ page, totalPages, category }: BlogPaginationProps) {
  const href = (target: number) => {
    const params = new URLSearchParams()
    if (category) params.set("categoria", category)
    if (target > 1) params.set("pagina", String(target))
    const query = params.toString()
    return query ? `${ROUTES.blog}?${query}` : ROUTES.blog
  }

  return (
    <nav
      aria-label="Páginas del blog"
      className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:flex-nowrap sm:px-8"
    >
      {page > 1 ? (
        <IconHoverArea>
          <Link href={href(page - 1)} rel="prev" className={LINK_CLASS}>
            <HoverIcon name="arrow-left" size={16} />
            Anterior
          </Link>
        </IconHoverArea>
      ) : (
        <span />
      )}
      <p className="order-first w-full text-center text-[13px] text-muted-foreground sm:order-none sm:w-auto">
        Página {page} de {totalPages}
      </p>
      {page < totalPages ? (
        <IconHoverArea>
          <Link href={href(page + 1)} rel="next" className={LINK_CLASS}>
            Siguiente
            <HoverIcon name="arrow-right" size={16} />
          </Link>
        </IconHoverArea>
      ) : (
        <span />
      )}
    </nav>
  )
}
