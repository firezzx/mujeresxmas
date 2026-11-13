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
