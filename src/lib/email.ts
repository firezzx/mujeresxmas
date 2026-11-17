import { Resend } from "resend"

import { BRAND_HEX } from "@/config/brand-effects"

// Envío de correos con Resend. Necesita RESEND_API_KEY y EMAIL_FROM (ver .env.example).
// Mientras el dominio no esté verificado en Resend, EMAIL_FROM tiene que ser
// "Mujeres x Más <onboarding@resend.dev>" y los correos solo llegan al dueño de la cuenta.

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
}

export type OutgoingEmail = {
  to: string
  subject: string
  html: string
  text: string
  unsubscribeUrl?: string
}

// Grises del pie del correo (los clientes de correo no leen las variables CSS del sitio)
const EMAIL_MUTED = "#6B6B6B"
const EMAIL_RULE = "#EEEEEE"

// Resend acepta hasta 100 correos por pedido.
const BATCH_SIZE = 100

// Envía los correos en tandas. Devuelve cuántos salieron y cuántos fallaron.
export async function sendEmails(emails: OutgoingEmail[]): Promise<{ sent: number; failed: number }> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.EMAIL_FROM!
  let sent = 0
  let failed = 0

  for (let start = 0; start < emails.length; start += BATCH_SIZE) {
    const chunk = emails.slice(start, start + BATCH_SIZE)
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
      console.error("[sendEmails]", error?.name, error?.message)
      failed += chunk.length
      continue
    }
    const errors = "errors" in data && Array.isArray(data.errors) ? data.errors.length : 0
    failed += errors
    sent += chunk.length - errors
  }

  return { sent, failed }
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

// {nombre} en el asunto o el mensaje se reemplaza por el primer nombre de cada persona.
export function personalize(template: string, fullName: string) {
  const firstName = fullName.trim().split(/\s+/)[0] ?? ""
  return template.replace(/\{nombre\}/gi, firstName)
}

// Texto escrito en el panel → HTML simple: párrafos por línea en blanco, saltos de línea y
// links automáticos. Todo se escapa antes, así que no se puede inyectar HTML.
function textToHtml(text: string) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => {
      const html = escapeHtml(paragraph.trim())
        .replace(/(https?:\/\/[^\s<]+)/g, `<a href="$1" style="color:${BRAND_HEX.brand}">$1</a>`)
        .replace(/\n/g, "<br>")
      return `<p style="margin:0 0 16px">${html}</p>`
    })
    .join("")
}

// Estructura de marca de todos los correos: franja verde con el logo en negro (como pide el
// manual), contenido sobre blanco y pie con la baja. El logo es PNG porque Gmail no muestra SVG.
function brandLayout({ siteUrl, content, footer }: { siteUrl: string; content: string; footer: string }) {
  return `<!doctype html>
<html lang="es">
<body style="margin:0;padding:0;background:${BRAND_HEX.pinkTint};font-family:Helvetica,Arial,sans-serif;color:${BRAND_HEX.ink}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_HEX.pinkTint};padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${BRAND_HEX.white};border-radius:8px;overflow:hidden">
        <tr><td style="background:${BRAND_HEX.green};padding:28px 32px">
          <a href="${siteUrl}"><img src="${siteUrl}/brand/mujeresxmas-logo-email.png" width="200" height="43" alt="Mujeres x Más" style="display:block;border:0;color:${BRAND_HEX.ink};font-size:22px;font-weight:700"></a>
        </td></tr>
        <tr><td style="padding:32px 32px 12px;font-size:16px;line-height:1.6">${content}</td></tr>
        <tr><td style="padding:16px 32px 28px;font-size:12px;line-height:1.5;color:${EMAIL_MUTED};border-top:1px solid ${EMAIL_RULE}">${footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function unsubscribeFooter(unsubscribeUrl?: string) {
  return unsubscribeUrl
    ? `Recibís este correo porque te sumaste a Mujeres x Más. <a href="${unsubscribeUrl}" style="color:${BRAND_HEX.ink}">Darme de baja</a>`
    : "Correo de prueba enviado desde el panel de Mujeres x Más."
}

// Correo masivo escrito en el panel.
export function campaignEmail({
  body,
  siteUrl,
  unsubscribeUrl,
}: {
  body: string
  siteUrl: string
  unsubscribeUrl?: string
}) {
  const html = brandLayout({ siteUrl, content: textToHtml(body), footer: unsubscribeFooter(unsubscribeUrl) })
  const text = unsubscribeUrl
    ? `${body}

—
Para darte de baja: ${unsubscribeUrl}`
    : body
  return { html, text }
}

// Correo de agradecimiento al sumarse en /sumate. El botón va en naranja con texto blanco
// semibold, como los botones principales del sitio.
export function thankYouEmail({
  copy,
  fullName,
  siteUrl,
  unsubscribeUrl,
}: {
  copy: {
    subject: string
    title: string
    paragraphs: readonly string[]
    cta: string
    signature: string
    hashtag: string
  }
  fullName: string
  siteUrl: string
  unsubscribeUrl: string
}) {
  const title = escapeHtml(personalize(copy.title, fullName))
  const paragraphs = copy.paragraphs.map((p) => `<p style="margin:0 0 16px">${escapeHtml(p)}</p>`).join("")
  const content = `
    <h1 style="margin:0 0 20px;font-size:28px;line-height:1.15;letter-spacing:-0.02em;font-weight:700">${title}</h1>
    ${paragraphs}
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 28px"><tr>
      <td style="background:${BRAND_HEX.brand};border-radius:8px">
        <a href="${siteUrl}" style="display:inline-block;padding:14px 26px;color:${BRAND_HEX.white};font-weight:600;font-size:15px;text-decoration:none">${escapeHtml(copy.cta)}</a>
      </td>
    </tr></table>
    <p style="margin:0 0 8px">${escapeHtml(copy.signature).replace(/\n/g, "<br>")}</p>
    <p style="margin:0 0 8px;font-family:'Caveat','Brush Script MT',cursive;font-size:24px;color:${BRAND_HEX.green};font-weight:700">${escapeHtml(copy.hashtag)}</p>`

  const text = [
    personalize(copy.title, fullName),
    ...copy.paragraphs,
    `${copy.cta}: ${siteUrl}`,
    copy.signature,
    copy.hashtag,
    `—\nPara darte de baja: ${unsubscribeUrl}`,
  ].join("\n\n")

  return {
    subject: personalize(copy.subject, fullName),
    html: brandLayout({ siteUrl, content, footer: unsubscribeFooter(unsubscribeUrl) }),
    text,
  }
}
