import Link from "next/link"

import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { pillLinkVariants } from "@/components/pill-link"
import { blogHref } from "@/lib/blog-shared"

const LINK_CLASS = pillLinkVariants({ variant: "outline", size: "md", className: "rounded-lg" })

type BlogPaginationProps = {
  page: number
  totalPages: number
  category: string | null
  query: string | null
}

// Anterior y siguiente del blog, conservando el filtro de categoría y la búsqueda.
export function BlogPagination({ page, totalPages, category, query }: BlogPaginationProps) {
  const href = (target: number) => blogHref({ category, query, page: target })

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
      <p className="order-first w-full text-center text-sm text-muted-foreground sm:order-none sm:w-auto">
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
