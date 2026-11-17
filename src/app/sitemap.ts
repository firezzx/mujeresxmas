import type { MetadataRoute } from "next"

import { ROUTES } from "@/config/navigation"
import { REGISTRATION_ONLY } from "@/config/site-mode"
import { listPostsForSitemap } from "@/lib/blog"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

// Páginas públicas y publicaciones del blog, para los buscadores.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // En modo solo registro, la única página pública es la de registro
  if (REGISTRATION_ONLY) return [{ url: `${SITE_URL}${ROUTES.sumate}` }]
  const posts = await listPostsForSitemap()
  return [
    { url: SITE_URL },
    { url: `${SITE_URL}${ROUTES.pilares}` },
    { url: `${SITE_URL}${ROUTES.desarrollo}` },
    { url: `${SITE_URL}${ROUTES.bienestar}` },
    { url: `${SITE_URL}${ROUTES.conexion}` },
    { url: `${SITE_URL}${ROUTES.kiero}` },
    { url: `${SITE_URL}${ROUTES.membresia}` },
    { url: `${SITE_URL}${ROUTES.empresas}` },
    { url: `${SITE_URL}${ROUTES.sumate}` },
    { url: `${SITE_URL}${ROUTES.blog}` },
    ...posts.map((post) => ({ url: `${SITE_URL}${ROUTES.blog}/${post.slug}`, lastModified: post.updatedAt })),
  ]
}
