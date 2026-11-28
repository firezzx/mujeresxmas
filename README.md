# Mujeres x Más

Sitio comunidad de [Mujeres x Más](https://mujeresxmas.com): capacitar, relacionar e incluir a mujeres y emprendedoras.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- [Magic UI](https://magicui.design) como librería principal de componentes (vía registro de shadcn) + Motion
- Supabase: base de datos, Auth (email + contraseña) y Storage
- Resend + React Email
- Zod
- Deploy en Vercel

## Desarrollo local

```bash
cp .env.example .env.local   # completar con las credenciales
npm install
npm run dev
```

El sitio queda en http://localhost:3000.

## Base de datos (migraciones)

Todo cambio de la base va como migración en `supabase/migrations`, nunca solo desde el editor SQL
del dashboard. Con la CLI vinculada al proyecto (`npx supabase login` y
`npx supabase link --project-ref <ref>`; en PowerShell con scripts bloqueados, `npx.cmd`):

```bash
npx supabase migration new nombre_del_cambio   # crear
npx supabase migration list --linked           # comparar local y remoto
npx supabase db push                           # aplicar las pendientes
```

El 28/11/2026 se reparó el historial remoto: 18 migraciones estaban aplicadas a mano y no figuraban,
así que se marcaron con `supabase migration repair --status applied`. Hoy local y remoto coinciden.
Si vuelve a pasar, no correr `db push` sin revisar: algunas migraciones de datos (por ejemplo
`20261125150000_blog_notas_anteriores.sql`) borran y recargan tablas.

## Componentes de Magic UI

Se agregan con el CLI de shadcn y quedan en `src/components/ui`:

```bash
npx shadcn@latest add @magicui/<componente>
```

## Estructura

- `src/app`: rutas
- `src/components/ui`: componentes de Magic UI / shadcn
- `src/lib/supabase`: clientes de Supabase para navegador, servidor y proxy
- `src/proxy.ts`: refresco de la sesión de Supabase en cada request

## Pasar a producción

Lo que falta para publicar en las cuentas de la clienta está en [docs/PRODUCCION.md](docs/PRODUCCION.md).
