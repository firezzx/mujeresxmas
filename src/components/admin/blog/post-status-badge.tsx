import { POST_STATUS_LABELS, type PostDisplayStatus } from "@/lib/blog-shared"
import { cn } from "@/lib/utils"

// Estado de una publicación, con "Programada" para las que tienen fecha futura.
export function PostStatusBadge({ status }: { status: PostDisplayStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-md px-2.5 text-xs font-medium whitespace-nowrap",
        status === "published" && "bg-brand-green/25 text-foreground",
        status === "scheduled" && "bg-brand-soft text-foreground",
        status === "draft" && "text-muted-foreground ring-1 ring-border",
        status === "archived" && "bg-foreground/[0.06] text-muted-foreground"
      )}
    >
      {POST_STATUS_LABELS[status]}
    </span>
  )
}
