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

export function validatePasswordComplexity(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" }
  }
  return { valid: true }
}
