"use client"

import { useLayoutEffect } from "react"

// Corre antes de pintar la página: mira si está la cookie de sesión de Supabase (sin leer su contenido)
// y lo anota en <html data-session>. Así el HTML estático ya muestra los botones que correspondan
// (clases only-guest y only-member de globals.css), en vez de cambiarlos cuando responde el servidor.
const SESSION_HINT_SCRIPT = String.raw`document.documentElement.dataset.session=/(?:^|; )sb-[^=]+-auth-token(?:\.\d+)?=/.test(document.cookie)?"in":"out"`

export function SessionHintScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SESSION_HINT_SCRIPT }}
    />
  )
}

// Con la sesión ya confirmada por el servidor, corrige el aviso: el script solo corre al cargar la
// página y sin esto quedaría viejo al iniciar o cerrar sesión sin recargar.
export function SessionHintSync({ signedIn }: { signedIn: boolean }) {
  useLayoutEffect(() => {
    document.documentElement.dataset.session = signedIn ? "in" : "out"
  }, [signedIn])
  return null
}
