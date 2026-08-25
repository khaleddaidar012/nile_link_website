import nodemailer from "nodemailer"
import { EmailConfig, EmailProvider, SendEmailOptions } from "../types"

export function createSmtpProvider(config: EmailConfig): EmailProvider {
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  })

  return {
    name: "smtp",

    async send(options: SendEmailOptions) {
      const info = await transporter.sendMail({
        from: `"NileLink" <${config.from}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      })

      return { success: true, messageId: info.messageId }
    },
  }
}
