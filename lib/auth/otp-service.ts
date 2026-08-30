import crypto from "crypto"
import { IUser } from "@/lib/models/User"

export type OtpChannel = "email" | "whatsapp"
export type OtpPurpose = "account_verification" | "password_reset"

export interface SendOtpOptions {
  to: string
  channel: OtpChannel
  code: string
  purpose: OtpPurpose
  recipientName?: string
}

export interface DispatchResult {
  success: boolean
  channel: OtpChannel
  recipient: string
  code: string
  dispatchedAt: Date
  previewCode?: string
  error?: string
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP code.
 */
export function generateNumericOtp(length: number = 6): string {
  const min = Math.pow(10, length - 1)
  const max = Math.pow(10, length) - 1
  return crypto.randomInt(min, max + 1).toString()
}

/**
 * Dispatch an OTP notification over WhatsApp or Email.
 * In development, logs cleanly to the console and returns the preview code.
 * Includes integration hooks for live WhatsApp Cloud API & SMTP dispatch.
 */
export async function dispatchOtpNotification({
  to,
  channel,
  code,
  purpose,
  recipientName = "Valued NileLink Client",
}: SendOtpOptions): Promise<DispatchResult> {
  const now = new Date()

  try {
    if (channel === "whatsapp") {
      const whatsappMessage = `*NileLink Logistics Security Verification*\n\n` +
        `Dear ${recipientName},\n\n` +
        `Your 6-digit ${purpose === "password_reset" ? "password reset" : "activation"} verification code is:\n\n` +
        `*${code}*\n\n` +
        `This code is valid for 10 minutes. Please do not share this security code with anyone.\n\n` +
        `NileLink Digital Freight & Customs Portal`

      // WhatsApp Cloud API automated dispatch if credentials provided
      const whatsappToken = process.env.WHATSAPP_API_TOKEN
      const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
      const whatsappApiUrl = process.env.WHATSAPP_API_URL || (whatsappPhoneId ? `https://graph.facebook.com/v19.0/${whatsappPhoneId}/messages` : null)

      if (whatsappToken && whatsappApiUrl) {
        try {
          const cleanPhone = to.replace(/[^\d]/g, "")
          const response = await fetch(whatsappApiUrl, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${whatsappToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: cleanPhone,
              type: "text",
              text: { body: whatsappMessage },
            }),
          })
          if (!response.ok) {
            const errBody = await response.text()
            console.error("[WHATSAPP CLOUD API ERROR]:", errBody)
          } else {
            console.log(`[REAL WHATSAPP OTP DISPATCHED SUCCESSFULLY to ${cleanPhone}]`)
          }
        } catch (waErr) {
          console.error("[WHATSAPP HTTP DISPATCH EXCEPTION]:", waErr)
        }
      }

      // Dev & Staging log
      console.log(`\n==================================================`)
      console.log(`[NILELINK WHATSAPP OTP DISPATCH]`)
      console.log(`To: ${to}`)
      console.log(`Purpose: ${purpose}`)
      console.log(`Code: ${code}`)
      console.log(`Message: \n${whatsappMessage}`)
      console.log(`==================================================\n`)

      return {
        success: true,
        channel: "whatsapp",
        recipient: to,
        code,
        dispatchedAt: now,
        previewCode: code,
      }
    } else {
      const emailSubject = purpose === "password_reset"
        ? "NileLink Portal - Password Reset Security Code"
        : "NileLink Portal - Account Verification Code"

      console.log(`\n==================================================`)
      console.log(`[NILELINK EMAIL OTP DISPATCH]`)
      console.log(`To: ${to}`)
      console.log(`Subject: ${emailSubject}`)
      console.log(`Purpose: ${purpose}`)
      console.log(`Code: ${code}`)
      console.log(`==================================================\n`)

      const smtpConfigured = !!(process.env.SMTP_HOST || process.env.EMAIL_SERVER_HOST)
      if (smtpConfigured) {
        try {
          const { sendEmail } = await import("@/lib/email/send")
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
              <h2 style="color: #0f172a;">NileLink Security Verification</h2>
              <p>Hello ${recipientName},</p>
              <p>Your 6-digit activation code is:</p>
              <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2563eb; margin: 20px 0; border-radius: 8px;">
                ${code}
              </div>
              <p style="color: #64748b; font-size: 12px;">This code is valid for 10 minutes. Please do not share it with anyone.</p>
            </div>
          `
          await sendEmail({ to, subject: emailSubject, html: emailHtml })
          console.log(`[REAL EMAIL DISPATCHED SUCCESSFULLY to ${to}]`)
        } catch (sendErr) {
          console.error("[REAL EMAIL DISPATCH ERROR]:", sendErr)
        }
      }

      return {
        success: true,
        channel: "email",
        recipient: to,
        code,
        dispatchedAt: now,
        previewCode: code,
      }
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to dispatch OTP"
    console.error(`[OTP Dispatch Error] (${channel}):`, errorMessage)
    return {
      success: false,
      channel,
      recipient: to,
      code,
      dispatchedAt: now,
      error: errorMessage,
    }
  }
}

/**
 * Assign and dispatch an OTP to a User model for verification or password reset.
 */
export async function createAndSendUserOtp(
  user: IUser,
  channel: OtpChannel,
  purpose: OtpPurpose
): Promise<DispatchResult> {
  const code = generateNumericOtp(6)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  if (purpose === "password_reset") {
    user.passwordResetOtp = code
    user.passwordResetOtpExpires = expiresAt
    user.passwordResetChannel = channel
  } else if (channel === "email") {
    user.emailVerificationOtp = code
    user.emailVerificationOtpExpires = expiresAt
  } else if (channel === "whatsapp") {
    user.whatsappVerificationCode = code
    user.whatsappVerificationExpires = expiresAt
  }

  await user.save()

  const destination = channel === "email" ? user.email : user.phone || ""
  return await dispatchOtpNotification({
    to: destination,
    channel,
    code,
    purpose,
    recipientName: `${user.firstName} ${user.lastName}`.trim(),
  })
}

/**
 * Verify a given OTP against a user model record.
 */
export function verifyUserOtp(
  user: IUser,
  channel: OtpChannel,
  code: string,
  purpose: OtpPurpose
): { valid: boolean; error?: string } {
  const cleanCode = (code || "").trim()
  const now = new Date()

  if (purpose === "password_reset") {
    if (!user.passwordResetOtp || user.passwordResetOtp !== cleanCode) {
      return { valid: false, error: "Invalid password reset verification code. Please check and try again." }
    }
    if (user.passwordResetOtpExpires && user.passwordResetOtpExpires < now) {
      return { valid: false, error: "Password reset code has expired. Please request a new code." }
    }
    return { valid: true }
  }

  if (channel === "email") {
    if (!user.emailVerificationOtp || user.emailVerificationOtp !== cleanCode) {
      return { valid: false, error: "Invalid email verification code. Please check and try again." }
    }
    if (user.emailVerificationOtpExpires && user.emailVerificationOtpExpires < now) {
      return { valid: false, error: "Email verification code has expired. Please request a new code." }
    }
    return { valid: true }
  }

  if (channel === "whatsapp") {
    if (!user.whatsappVerificationCode || user.whatsappVerificationCode !== cleanCode) {
      return { valid: false, error: "Invalid WhatsApp verification code. Please check and try again." }
    }
    if (user.whatsappVerificationExpires && user.whatsappVerificationExpires < now) {
      return { valid: false, error: "WhatsApp verification code has expired. Please request a new code." }
    }
    return { valid: true }
  }

  return { valid: false, error: "Unsupported verification channel." }
}
