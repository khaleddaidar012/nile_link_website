import { EmailConfig, EmailProvider } from "../types"
import { createSmtpProvider } from "./smtp"

const providers: Record<string, (config: EmailConfig) => EmailProvider> = {
  smtp: createSmtpProvider,
}

export function getProvider(config: EmailConfig): EmailProvider {
  const factory = providers[config.provider]

  if (!factory) {
    throw new Error(
      `Unknown email provider: "${config.provider}". Available providers: ${Object.keys(providers).join(", ")}`
    )
  }

  return factory(config)
}

export function registerProvider(type: string, factory: (config: EmailConfig) => EmailProvider): void {
  providers[type] = factory
}
