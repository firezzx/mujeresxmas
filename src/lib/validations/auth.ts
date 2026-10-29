import { z } from "zod"

// Validaciones de autenticación compartidas por el formulario (cliente) y las acciones (servidor).
// Las reglas de contraseña tienen que coincidir con las de Supabase Auth
// (minimum_password_length y password_requirements en supabase/config.toml).
// Supabase solo cuenta letras sin tilde (a-z), por eso la regla no usa \p{L}.

export const PASSWORD_MIN = 8
// bcrypt, que usa Supabase, ignora lo que pase de 72 bytes
export const PASSWORD_MAX = 72

export const PASSWORD_RULES = [
  { id: "length", label: `${PASSWORD_MIN} caracteres o más`, test: (v: string) => v.length >= PASSWORD_MIN },
  { id: "letter", label: "Una letra (a-z)", test: (v: string) => /[a-zA-Z]/.test(v) },
  { id: "number", label: "Un número", test: (v: string) => /\d/.test(v) },
] as const

export const emailSchema = z
  .string({ error: "Ingresá tu correo" })
  .trim()
  .toLowerCase()
  .min(1, "Ingresá tu correo")
  .max(254, "El correo es demasiado largo")
  .pipe(z.email("Revisá el correo, parece que no es válido"))

export const passwordSchema = z
  .string({ error: "Ingresá una contraseña" })
  .min(PASSWORD_MIN, `La contraseña necesita al menos ${PASSWORD_MIN} caracteres`)
  .max(PASSWORD_MAX, `La contraseña puede tener hasta ${PASSWORD_MAX} caracteres`)
  .regex(/[a-zA-Z]/,"Sumale al menos una letra sin tilde (a-z)")
  .regex(/\d/, "Sumale al menos un número")

// Nombre del campo trampa anti-bots del registro
export const HONEYPOT_FIELD = "hp_mxm_extra"

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type SignUpInput = z.infer<typeof signUpSchema>

// En el login no se exigen las reglas de creación: solo que no venga vacía.
export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string({ error: "Ingresá tu contraseña" })
    .min(1, "Ingresá tu contraseña")
    .max(PASSWORD_MAX, "La contraseña es demasiado larga"),
})

export const newPasswordSchema = z.object({ password: passwordSchema })
