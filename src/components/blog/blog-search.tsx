import Form from "next/form"
import Link from "next/link"

import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import { ROUTES } from "@/config/navigation"
import { blogHref, SEARCH_MAX } from "@/lib/blog-shared"

const ICON_BUTTON_CLASS =
  "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-foreground/55 transition-colors duration-300 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"

// Buscador del blog. Es un formulario real: cada búsqueda tiene su dirección y funciona sin JavaScript.
export function BlogSearch({ query, category }: { query: string | null; category: string | null }) {
  return (
    <Form
      action={ROUTES.blog}
      scroll={false}
      role="search"
      className="flex min-w-0 flex-1 items-center gap-1 rounded-lg border border-border bg-background pl-3 transition-[border-color,box-shadow] duration-300 ease-premium focus-within:border-foreground/30 focus-within:ring-4 focus-within:ring-ring/15 lg:max-w-sm"
    >
      {category && <input type="hidden" name="categoria" value={category} />}
      <input
        // Se vuelve a crear cuando cambia la búsqueda en la dirección
        key={query}
        type="search"
        name="q"
        defaultValue={query ?? ""}
        maxLength={SEARCH_MAX}
        enterKeyHint="search"
        aria-label="Buscar en el blog"
        placeholder="Buscar notas"
        className="h-10 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/70 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <IconHoverArea>
          <Link
            href={blogHref({ category })}
            scroll={false}
            aria-label="Borrar la búsqueda"
            className={ICON_BUTTON_CLASS}
          >
            <HoverIcon name="x" size={16} />
          </Link>
        </IconHoverArea>
      )}
      <IconHoverArea>
        <button type="submit" aria-label="Buscar" className={ICON_BUTTON_CLASS}>
          <HoverIcon name="search" size={16} />
        </button>
      </IconHoverArea>
    </Form>
  )
}
