import type { NextConfig } from "next"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

const nextConfig: NextConfig = {
  images: {
    // Todas las fotos del sitio se sirven con esta calidad (la predeterminada, 75, se notaba comprimida)
    qualities: [90],
    // Imágenes públicas de Supabase Storage (blog): el host sale de la variable de entorno
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: "https",
            hostname: new URL(supabaseUrl).hostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  // Los pilares pasaron a ser subpáginas de /pilares. La dirección vieja de Kiero lleva a /kiero, para que no se rompan links ya compartidos
  async redirects() {
    return [
      ...["desarrollo", "bienestar", "conexion"].map((slug) => ({
        source: `/${slug}`,
        destination: `/pilares/${slug}`,
        permanent: true,
      })),
      { source: "/quiero/:path*", destination: "/kiero/:path*", permanent: true },
    ]
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
}

export default nextConfig
