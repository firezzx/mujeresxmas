import { z } from "zod"

// Presentación de /sumate que se edita desde /admin/contactos (tabla site_texts, key = "sumate").
export const signupIntroSchema = z.object({
  title: z.string().trim().min(2, "Escribí el título").max(80, "Título: hasta 80 caracteres"),
  titleHighlight: z.string().trim().max(40, "Palabra destacada: hasta 40 caracteres"),
  description: z.string().trim().min(2, "Escribí la descripción").max(400, "Descripción: hasta 400 caracteres"),
  // Un punto por línea en el formulario
  bullets: z.array(z.string().trim().min(1).max(100, "Cada punto: hasta 100 caracteres")).max(6, "Hasta 6 puntos"),
})

export type SignupIntro = z.infer<typeof signupIntroSchema>
export type SignupIntroField = keyof SignupIntro
