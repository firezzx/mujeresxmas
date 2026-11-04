"use client"

import { HoverIcon, IconHoverArea, type IconName } from "@/components/icons/hover-icon"
import { pillLinkVariants } from "@/components/pill-link"
import { useToast } from "@/components/toast/toaster"

const BUTTON_CLASS = pillLinkVariants({ variant: "outline", className: "h-11 cursor-pointer rounded-lg px-4" })

function ShareLink({ href, icon, children }: { href: string; icon: IconName; children: React.ReactNode }) {
  return (
    <IconHoverArea>
      <a href={href} target="_blank" rel="noopener noreferrer" className={BUTTON_CLASS}>
        <HoverIcon name={icon} size={16} />
        {children}
      </a>
    </IconHoverArea>
  )
}

// Compartir una publicación por WhatsApp o LinkedIn, o copiar su dirección.
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const { toast } = useToast()

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      toast({ id: "blog-share", tone: "success", title: "Listo", message: "Copiamos el link de la nota." })
    } catch {
      toast({ id: "blog-share", tone: "error", title: "Algo no salió bien", message: "No pudimos copiar el link." })
    }
  }

  return (
    <section aria-label="Compartir esta nota" className="mt-8">
      <p className="text-sm font-medium">Compartí esta nota</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <ShareLink href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} icon="message-circle">
          WhatsApp
        </ShareLink>
        <ShareLink
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          icon="linkedin"
        >
          LinkedIn
        </ShareLink>
        <IconHoverArea>
          <button type="button" onClick={copyLink} className={BUTTON_CLASS}>
            <HoverIcon name="link" size={16} />
            Copiar link
          </button>
        </IconHoverArea>
      </div>
    </section>
  )
}
