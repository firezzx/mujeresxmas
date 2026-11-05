import { z } from "zod"

// Plan que reciben todas las cuentas al registrarse (trigger on_auth_user_created): su precio es siempre 0.
export const FREE_PLAN_ID = "gratis"

const MAX_FEATURES = 12
const MAX_FEATURE_LENGTH = 120
const PRICE_MESSAGE = "Escribí el precio en pesos, sin centavos. Ej.: 24.999"

// Plan que edita una administradora. El precio admite 24999 o 24.999; los beneficios van uno por línea.
export const planSchema = z.object({
  name: z.string().trim().min(1, "Escribí un nombre").max(40, "Nombre: hasta 40 caracteres"),
  description: z
    .string()
    .trim()
    .max(200, "Descripción: hasta 200 caracteres")
    .transform((value) => value || null),
  price: z
    .string()
    .trim()
    .refine((value) => /^(\d{1,9}|\d{1,3}(\.\d{3}){1,2})$/.test(value), PRICE_MESSAGE)
    .transform((value) => Number(value.replace(/\./g, ""))),
  features: z
    .string()
    .transform((value) =>
      value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    )
    .refine((lines) => lines.length > 0, "Escribí al menos un beneficio")
    .refine((lines) => lines.length <= MAX_FEATURES, `Hasta ${MAX_FEATURES} beneficios`)
    .refine(
      (lines) => lines.every((line) => line.length <= MAX_FEATURE_LENGTH),
      `Cada beneficio: hasta ${MAX_FEATURE_LENGTH} caracteres`
    ),
})

export type PlanInput = z.input<typeof planSchema>
export type PlanField = keyof PlanInput
