@AGENTS.md

# Mujeres x Más

## Principios del proyecto

- **Todo transferible:** el proyecto va a pasar de cuentas de prueba (Supabase, Vercel, Resend) a las cuentas de la clienta. Nada puede depender de configuración hecha a mano en un panel sin quedar registrada en el repo.
  - Credenciales y URLs solo por variables de entorno; toda variable nueva se agrega a `.env.example`.
  - Cambios de base de datos (tablas, RLS, triggers, funciones) siempre como migraciones de Supabase CLI en `supabase/migrations`, nunca solo desde el dashboard.
  - Configuración de Auth (Site URL, redirects, plantillas de email) en `supabase/config.toml` o documentada en el README.
- **Fácil de escalar:** separar lógica de datos (`src/lib`), validaciones con Zod reutilizables y componentes de UI desacoplados del contenido.
- **Componentes:** Magic UI (magicui.design) es la librería principal; se agregan con `npx shadcn@latest add @magicui/<componente>`.
- **Idioma:** español rioplatense con voseo, tono cercano, inclusivo y profesional.

## Documento de funciones MVP

[docs/FUNCIONES-MVP.md](docs/FUNCIONES-MVP.md) es la lista oficial de funciones. Respetar las reglas que están al principio del archivo: no escribir contenido propio, solo agregar las funciones que dicte la persona a cargo (una vez aprobado el texto) y actualizar su estado (⏳ Pendiente, ✅ Completo, ❌ Error) a medida que se trabaja.
