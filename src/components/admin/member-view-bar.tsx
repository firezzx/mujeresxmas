import { setMemberView } from "@/app/actions/admin"
import { HoverIcon, IconHoverArea } from "@/components/icons/hover-icon"

// Barra fija abajo mientras una administradora mira el sitio como usuaria común.
export function MemberViewBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <IconHoverArea className="pointer-events-auto max-w-full">
        <form
          action={setMemberView.bind(null, false)}
          className="flex max-w-full items-center gap-3 rounded-full bg-primary py-1.5 pr-1.5 pl-4 text-primary-foreground shadow-[0_16px_40px_-16px_rgb(40_20_40/0.6)]"
        >
          <HoverIcon name="eye" size={16} className="text-brand" />
          <p className="truncate text-[13px]">Estás viendo el sitio como usuaria</p>
          <button
            type="submit"
            className="h-8 shrink-0 cursor-pointer rounded-full bg-primary-foreground px-3.5 text-[13px] font-medium text-primary transition-opacity hover:opacity-90"
          >
            Volver a admin
          </button>
        </form>
      </IconHoverArea>
    </div>
  )
}
