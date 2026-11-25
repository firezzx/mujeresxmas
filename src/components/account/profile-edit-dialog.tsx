"use client"

import { Dialog } from "@base-ui/react/dialog"
import { useState } from "react"

import { AvatarUploader } from "@/components/account/avatar-uploader"
import { ProfileForm } from "@/components/account/profile-form"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"
import type { CurrentUser } from "@/lib/supabase/user"
import { cn } from "@/lib/utils"
import type { ProfileField } from "@/lib/validations/profile"

// Botón "Editar perfil" de Mi cuenta: abre una ventana con la foto y los datos. Al guardar se cierra
// y la página se actualiza con los datos nuevos.
export function ProfileEditDialog({
  user,
  values,
  className,
}: {
  user: CurrentUser
  values: Record<ProfileField, string>
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <IconHoverArea className={cn("inline-flex", className)}>
        <Dialog.Trigger className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background/70 px-4 text-sm font-medium transition-colors outline-none hover:border-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/40">
          <HoverIcon name="square-pen" size={17} />
          Editar perfil
        </Dialog.Trigger>
      </IconHoverArea>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-[3px] transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none" />
        <Dialog.Popup className="fixed inset-x-3 top-1/2 z-[60] mx-auto flex max-h-[calc(100svh-1.5rem)] w-auto max-w-2xl -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-background shadow-[0_24px_64px_-16px_rgb(26_26_26/0.4)] transition-[opacity,transform] duration-300 ease-premium outline-none data-[ending-style]:translate-y-[calc(-50%+1rem)] data-[ending-style]:opacity-0 data-[starting-style]:translate-y-[calc(-50%+1rem)] data-[starting-style]:opacity-0 motion-reduce:transition-none">
          <header className="flex items-start justify-between gap-4 border-b border-border/70 bg-mesh-soft p-5 sm:px-8">
            <div className="min-w-0">
              <Dialog.Title className="font-heading text-2xl leading-tight font-semibold tracking-[-0.01em]">
                Editar perfil
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-sm text-muted-foreground">
                Tu foto y tus datos. La portada se cambia desde la misma portada.
              </Dialog.Description>
            </div>
            <IconHoverArea className="inline-flex">
              <Dialog.Close
                aria-label="Cerrar"
                className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground/60 transition-colors outline-none hover:bg-foreground/[0.05] hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <HoverIcon name="x" size={18} />
              </Dialog.Close>
            </IconHoverArea>
          </header>
          <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto overscroll-contain p-5 sm:p-8">
            <AvatarUploader user={user} />
            <ProfileForm initialValues={values} onSaved={() => setOpen(false)} />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
