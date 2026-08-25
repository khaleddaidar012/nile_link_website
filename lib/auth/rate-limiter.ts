interface RateLimitRecord {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

// Clean up expired records every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitOptions {
  windowMs: number
  maxAttempts: number
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 15 * 60 * 1000, maxAttempts: 5 }
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + options.windowMs,
    })
    return {
      allowed: true,
      remaining: options.maxAttempts - 1,
      retryAfterSeconds: 0,
    }
  }

  if (record.count >= options.maxAttempts) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000)
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    }
  }

  record.count += 1
  return {
    allowed: true,
    remaining: options.maxAttempts - record.count,
    retryAfterSeconds: 0,
  }
}

export function resetRateLimit(identifier: string) {
  rateLimitMap.delete(identifier)
}
