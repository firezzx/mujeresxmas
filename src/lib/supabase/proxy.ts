import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import { GUEST_ONLY_ROUTES } from "@/config/navigation"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  // Sin credenciales configuradas (p. ej. en local recién clonado) no hay sesión que refrescar.
  if (!url || !key) return response

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  // Refresca el token de sesión si venció. No agregar lógica entre createServerClient y esta llamada.
  const { data } = await supabase.auth.getClaims()

  // Con sesión iniciada no tiene sentido ver el registro ni el login
  const path = request.nextUrl.pathname
  if (data?.claims && GUEST_ONLY_ROUTES.some((route) => path === route)) {
    const redirectResponse = NextResponse.redirect(new URL("/", request.url))
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie))
    return redirectResponse
  }

  return response
}
