import crypto from "crypto"

const SCRYPT_KEYLEN = 64
const SCRYPT_COST = 16384
const SCRYPT_BLOCKSIZE = 8
const SCRYPT_PARALLELIZATION = 1

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex")
    crypto.scrypt(
      password,
      salt,
      SCRYPT_KEYLEN,
      {
        cost: SCRYPT_COST,
        blockSize: SCRYPT_BLOCKSIZE,
        parallelization: SCRYPT_PARALLELIZATION,
      },
      (err, derivedKey) => {
        if (err) return reject(err)
        resolve(`${salt}:${derivedKey.toString("hex")}`)
      }
    )
  })
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!storedHash || !storedHash.includes(":")) {
      return resolve(false)
    }

    const [salt, key] = storedHash.split(":")
    crypto.scrypt(
      password,
      salt,
      SCRYPT_KEYLEN,
      {
        cost: SCRYPT_COST,
        blockSize: SCRYPT_BLOCKSIZE,
        parallelization: SCRYPT_PARALLELIZATION,
      },
      (err, derivedKey) => {
        if (err) return resolve(false)
        try {
          const keyBuffer = Buffer.from(key, "hex")
          const isMatch = crypto.timingSafeEqual(keyBuffer, derivedKey)
          resolve(isMatch)
        } catch {
          resolve(false)
        }
      }
    )
  })
}

export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString("hex")
}

export const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.fr",
  "yahoo.es",
  "yahoo.it",
  "yahoo.com.br",
  "ymail.com",
  "rocketmail.com",
  "hotmail.com",
  "hotmail.co.uk",
  "hotmail.fr",
  "hotmail.es",
  "hotmail.it",
  "outlook.com",
  "outlook.sa",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "aim.com",
  "mail.com",
  "email.com",
  "gmx.com",
  "gmx.net",
  "yandex.com",
  "yandex.ru",
  "mail.ru",
  "inbox.ru",
  "list.ru",
  "bk.ru",
  "proton.me",
  "protonmail.com",
  "tutanota.com",
  "tutamail.com",
  "zoho.com",
  "fastmail.com",
  "hushmail.com",
])

export function isBusinessEmail(email: string): boolean {
  if (!email || !email.includes("@")) return false
  const parts = email.toLowerCase().trim().split("@")
  if (parts.length !== 2) return false
  const domain = parts[1]
  if (!domain || !domain.includes(".")) return false
  return !FREE_EMAIL_DOMAINS.has(domain)
}

export interface PasswordCriteria {
  minLength: boolean
  hasUpper: boolean
  hasLower: boolean
  hasNumber: boolean
  hasSpecial: boolean
  isValid: boolean
  strengthScore: number // 0 - 100
}

export function evaluatePasswordStrength(password: string): PasswordCriteria {
  const p = password || ""
  const minLength = p.length >= 8
  const hasUpper = /[A-Z]/.test(p)
  const hasLower = /[a-z]/.test(p)
  const hasNumber = /[0-9]/.test(p)
  const hasSpecial = /[^A-Za-z0-9]/.test(p)

  let score = 0
  if (p.length >= 8) score += 20
  if (p.length >= 12) score += 10
  if (hasUpper) score += 20
  if (hasLower) score += 20
  if (hasNumber) score += 15
  if (hasSpecial) score += 15

  const isValid = minLength && hasUpper && hasLower && hasNumber && hasSpecial

  return {
    minLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    isValid,
    strengthScore: Math.min(100, score),
  }
}

export function validatePasswordComplexity(password: string): { valid: boolean; error?: string } {
  const criteria = evaluatePasswordStrength(password)
  if (!criteria.minLength) {
    return { valid: false, error: "Password must be at least 8 characters long" }
  }
  if (!criteria.hasUpper) {
    return { valid: false, error: "Password must contain at least one uppercase letter (A-Z)" }
  }
  if (!criteria.hasLower) {
    return { valid: false, error: "Password must contain at least one lowercase letter (a-z)" }
  }
  if (!criteria.hasNumber) {
    return { valid: false, error: "Password must contain at least one number (0-9)" }
  }
  if (!criteria.hasSpecial) {
    return { valid: false, error: "Password must contain at least one special character (!@#$%^&*)" }
  }
  return { valid: true }
}

