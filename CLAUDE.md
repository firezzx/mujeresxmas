@AGENTS.md

# Mujeres x Más

## Principios del proyecto

- **Todo transferible:** el proyecto va a pasar de cuentas de prueba (Supabase, Vercel, Resend) a las cuentas de la clienta. Nada puede depender de configuración hecha a mano en un panel sin quedar registrada en el repo.
  - Credenciales y URLs solo por variables de entorno; toda variable nueva se agrega a `.env.example`.
  - Cambios de base de datos (tablas, RLS, triggers, funciones) siempre como migraciones de Supabase CLI en `supabase/migrations`, nunca solo desde el dashboard.
  - Configuración de Auth (Site URL, redirects, plantillas de email) en `supabase/config.toml` o documentada en el README.
- **Fácil de escalar:** separar lógica de datos (`src/lib`), validaciones con Zod reutilizables y componentes de UI desacoplados del contenido.
- **Componentes:** Magic UI (magicui.design) es la librería principal; se agregan con `npx shadcn@latest add @magicui/<componente>`.
- **Íconos animados:** Lucide Animated (lucide-animated.com, MIT). Se agregan con `npx shadcn@latest add "https://lucide-animated.com/r/<icono>.json"` y se mueven a `src/components/icons/`. Para animarlos al pasar sobre todo el botón, usar `useIconAnimation`.
- **Botones:** los CTAs que navegan son links (`ShimmerLink` principal, `HoverRevealLink` secundario, `IconLink` para íconos), adaptados de los botones de Magic UI.
- **Tipografías:** Outfit para títulos y Poppins para textos y botones.
- **Colores de marca:** Naranja `#FF4F00`, Rosa `#EABBD2`, Verde `#5AAD8B`, Negro 90% `#1A1A1A` y Blanco `#FFFFFF`. Se usan los tokens de `globals.css` (`brand`, `brand-soft`, `brand-green`) y `BRAND_HEX` de `src/config/brand-effects.ts`, nunca hex sueltos en los componentes.
- **Idioma:** español rioplatense con voseo, tono cercano, inclusivo y profesional.

## Documento de funciones MVP

[docs/FUNCIONES-MVP.md](docs/FUNCIONES-MVP.md) es la lista oficial de funciones. Respetar las reglas que están al principio del archivo: no escribir contenido propio, solo agregar las funciones que dicte la persona a cargo (una vez aprobado el texto) y actualizar su estado (⏳ Pendiente, ✅ Completo, ❌ Error) a medida que se trabaja.
