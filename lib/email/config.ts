import { EmailConfig } from "./types"
import { CONTACT } from "@/constants/contact"

export function getEmailConfig(): EmailConfig {
  const provider = (process.env.EMAIL_PROVIDER as EmailConfig["provider"]) || "smtp"

  return {
    provider,
    from: process.env.EMAIL_FROM || CONTACT.EMAIL,
    to: process.env.EMAIL_TO || CONTACT.EMAIL,
    smtpHost: process.env.SMTP_HOST || process.env.EMAIL_SERVER_HOST,
    smtpPort: parseInt(process.env.SMTP_PORT || process.env.EMAIL_SERVER_PORT || "587", 10),
    smtpUser: process.env.SMTP_USER || process.env.EMAIL_SERVER_USER,
    smtpPass: process.env.SMTP_PASS || process.env.EMAIL_SERVER_PASSWORD,
    smtpSecure: process.env.SMTP_SECURE === "true",
  }
}
