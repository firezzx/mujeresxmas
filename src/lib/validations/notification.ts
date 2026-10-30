import { z } from "zod"

// Notificación que envía una administradora. Los límites coinciden con los check de la tabla.
export const notificationSchema = z.object({
  title: z.string().trim().min(1, "Escribí un título").max(120, "Título: hasta 120 caracteres"),
  body: z
    .string()
    .trim()
    .max(600, "Mensaje: hasta 600 caracteres")
    .transform((value) => value || null),
  link: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\/[^\s]*$/.test(value) || /^https:\/\/[^\s]+$/.test(value),
      "El link tiene que empezar con / (página del sitio) o con https://"
    )
    .transform((value) => value || null),
})

export type NotificationInput = z.input<typeof notificationSchema>
export type NotificationField = keyof NotificationInput
