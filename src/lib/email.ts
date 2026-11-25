import nodemailer from "nodemailer"
import { Resend } from "resend"

// Envío de correos. Funciona con SMTP (p. ej. el correo de Hostinger), Brevo o Resend según las
// variables de entorno (ver .env.example):
// - SMTP: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD y EMAIL_FROM con la misma casilla que SMTP_USER.
// - Brevo: BREVO_API_KEY y EMAIL_FROM con un remitente verificado en Brevo.
// - Resend: RESEND_API_KEY y EMAIL_FROM. Sin dominio verificado, solo llega al dueño de la cuenta.
// EMAIL_PROVIDER ("smtp", "brevo" o "resend") elige uno si hay varios configurados; si no, se usa el que haya.

type Provider = "smtp" | "brevo" | "resend"

function getProvider(): Provider | null {
  const available: Record<Provider, boolean> = {
    smtp: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD),
    brevo: Boolean(process.env.BREVO_API_KEY),
    resend: Boolean(process.env.RESEND_API_KEY),
  }
  const chosen = process.env.EMAIL_PROVIDER as Provider | undefined
  if (chosen && chosen in available) return available[chosen] ? chosen : null
  return (Object.keys(available) as Provider[]).find((provider) => available[provider]) ?? null
}

export function isEmailConfigured() {
  return Boolean(getProvider() && process.env.EMAIL_FROM)
}

export type OutgoingEmail = {
  to: string
  subject: string
  html: string
  text: string
  unsubscribeUrl?: string
}

type SendResult = { sent: number; failed: number }

// Envía los correos con el proveedor configurado. Devuelve cuántos salieron y cuántos fallaron.
export async function sendEmails(emails: OutgoingEmail[]): Promise<SendResult> {
  const provider = getProvider()
  if (provider === "smtp") return sendWithSmtp(emails)
  return provider === "brevo" ? sendWithBrevo(emails) : sendWithResend(emails)
}

// SMTP: una sola conexión que se reutiliza, de a pocos correos a la vez, con una pausa corta entre
// tandas para no superar el límite por minuto del servidor de correo (Hostinger corta si se envía muy rápido).
const SMTP_BATCH_SIZE = 5
const SMTP_PAUSE_MS = 1500

async function sendWithSmtp(emails: OutgoingEmail[]): Promise<SendResult> {
  const port = Number(process.env.SMTP_PORT || 465)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    pool: true,
    maxConnections: 1,
  })
  const from = process.env.EMAIL_FROM!
  let sent = 0
  let failed = 0

  try {
    for (let start = 0; start < emails.length; start += SMTP_BATCH_SIZE) {
      if (start > 0) await new Promise((resolve) => setTimeout(resolve, SMTP_PAUSE_MS))
      await Promise.all(
        emails.slice(start, start + SMTP_BATCH_SIZE).map(async (email) => {
          try {
            await transporter.sendMail({
              from,
              to: email.to,
              subject: email.subject,
              html: email.html,
              text: email.text,
              list: email.unsubscribeUrl ? { unsubscribe: email.unsubscribeUrl } : undefined,
            })
            sent++
          } catch (error) {
            failed++
            console.error("[sendWithSmtp]", error instanceof Error ? error.message : error)
          }
        })
      )
    }
  } finally {
    transporter.close()
  }
  return { sent, failed }
}

// "Mujeres x Más <hola@dominio.com>" → nombre y correo por separado (Brevo los pide así)
function parseSender(from: string) {
  const match = from.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/)
  return match ? { name: match[1] || undefined, email: match[2] } : { email: from.trim() }
}

// Brevo: un pedido por correo, de a 10 en paralelo para no pasar el límite de la API.
const BREVO_CONCURRENCY = 10

async function sendWithBrevo(emails: OutgoingEmail[]): Promise<SendResult> {
  const sender = parseSender(process.env.EMAIL_FROM!)
  let sent = 0
  let failed = 0

  const sendOne = async (email: OutgoingEmail) => {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": process.env.BREVO_API_KEY!,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          sender,
          to: [{ email: email.to }],
          subject: email.subject,
          htmlContent: email.html,
          textContent: email.text,
          headers: email.unsubscribeUrl ? { "List-Unsubscribe": `<${email.unsubscribeUrl}>` } : undefined,
        }),
      })
      if (response.ok) {
        sent++
      } else {
        failed++
        console.error("[sendWithBrevo]", response.status, await response.text())
      }
    } catch (error) {
      failed++
      console.error("[sendWithBrevo]", error)
    }
  }

  for (let start = 0; start < emails.length; start += BREVO_CONCURRENCY) {
    await Promise.all(emails.slice(start, start + BREVO_CONCURRENCY).map(sendOne))
  }
  return { sent, failed }
}

// Resend acepta hasta 100 correos por pedido.
const RESEND_BATCH_SIZE = 100

async function sendWithResend(emails: OutgoingEmail[]): Promise<SendResult> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.EMAIL_FROM!
  let sent = 0
  let failed = 0

  for (let start = 0; start < emails.length; start += RESEND_BATCH_SIZE) {
    const chunk = emails.slice(start, start + RESEND_BATCH_SIZE)
    const { data, error } = await resend.batch.send(
      chunk.map((email) => ({
        from,
        to: email.to,
        subject: email.subject,
        html: email.html,
        text: email.text,
        headers: email.unsubscribeUrl ? { "List-Unsubscribe": `<${email.unsubscribeUrl}>` } : undefined,
      })),
      { batchValidation: "permissive" }
    )
    if (error || !data) {
      console.error("[sendWithResend]", error?.name, error?.message)
      failed += chunk.length
      continue
    }
    const errors = "errors" in data && Array.isArray(data.errors) ? data.errors.length : 0
    failed += errors
    sent += chunk.length - errors
  }

  return { sent, failed }
}

// El diseño de los correos está en email-templates.ts
export { adminNoticeEmail, campaignEmail, personalize, thankYouEmail, welcomeEmail } from "./email-templates"

// Casilla del equipo que recibe los avisos importantes (registros, pedidos de empresas, cuentas nuevas).
const adminNoticeAddress = () => process.env.ADMIN_NOTIFY_EMAIL?.trim() || null

// Manda un aviso a la casilla del equipo, si hay una configurada y el envío de correos funciona.
export async function notifyTeam(subject: string, message: { html: string; text: string }) {
  const to = adminNoticeAddress()
  if (!to || !isEmailConfigured()) return
  const { failed } = await sendEmails([{ to, subject, ...message }])
  if (failed) console.error("[notifyTeam] no salió el aviso:", subject)
}
