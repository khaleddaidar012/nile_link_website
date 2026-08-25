import { getEmailConfig } from "./config"
import { getProvider } from "./providers"
import { SendEmailOptions } from "./types"

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const config = getEmailConfig()
  const provider = getProvider(config)

  const result = await provider.send({
    to: config.to,
    subject: options.subject,
    html: options.html,
  })

  if (!result.success) {
    throw new Error(`Email send failed: ${result.error}`)
  }
}
