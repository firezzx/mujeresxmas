import { z } from "zod"

// Perfil de la usuaria. Para sumar un dato nuevo (empresa, trabajo, país, etc.):
//   1. Migración que agrega la columna a public.profiles.
//   2. Una línea en profileSchema.
//   3. Una entrada en PROFILE_FIELDS (así aparece en el formulario).
// Lo demás (guardar, precargar y validar en cliente y servidor) sale de acá.

// Texto opcional: recorta espacios y guarda null si queda vacío
const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label}: hasta ${max} caracteres`)
    .transform((value) => value || null)

export const profileSchema = z.object({
  first_name: z.string().trim().min(1, "Contanos tu nombre").max(60, "Nombre: hasta 60 caracteres"),
  last_name: optionalText(60, "Apellido"),
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\+?[\d\s()-]{6,20}$/.test(value), "Revisá el teléfono: solo números, espacios, + y guiones")
    .transform((value) => value || null),
  city: optionalText(80, "Ciudad"),
  business_name: optionalText(100, "Emprendimiento"),
})

export type ProfileInput = z.input<typeof profileSchema>
export type ProfileField = keyof ProfileInput

type FieldConfig = {
  name: ProfileField
  label: string
  placeholder?: string
  autoComplete?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
  type?: "text" | "tel"
  optional?: boolean
  // Ocupa media fila en pantallas medianas
  half?: boolean
}

export const PROFILE_FIELDS: FieldConfig[] = [
  { name: "first_name", label: "Nombre", autoComplete: "given-name", placeholder: "Tu nombre", half: true },
  { name: "last_name", label: "Apellido", autoComplete: "family-name", placeholder: "Tu apellido", optional: true, half: true },
  { name: "phone", label: "Teléfono", type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "+54 9 11 1234 5678", optional: true, half: true },
  { name: "city", label: "Ciudad", autoComplete: "address-level2", placeholder: "Dónde vivís", optional: true, half: true },
  { name: "business_name", label: "Emprendimiento", autoComplete: "organization", placeholder: "Nombre de tu emprendimiento", optional: true },
]

// Foto de perfil: debe coincidir con el bucket avatars (supabase/migrations/*_storage_avatars.sql)
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024
export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"] as const
// La foto original puede pesar más: el navegador la recorta y comprime antes de subirla
export const AVATAR_SOURCE_MAX_BYTES = 10 * 1024 * 1024
export const AVATAR_SIZE_PX = 512
