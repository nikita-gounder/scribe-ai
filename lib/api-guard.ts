import { NextRequest, NextResponse } from 'next/server'

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 10
const GEMINI_TIMEOUT_MS = 30 * 1000

const requestCounts = new Map<string, { count: number; resetTime: number }>()

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return req.headers.get('x-real-ip') || 'unknown'
}

export function checkRateLimit(req: NextRequest) {
  const now = Date.now()
  const ip = getClientIp(req)

  for (const [key, entry] of requestCounts.entries()) {
    if (entry.resetTime <= now) {
      requestCounts.delete(key)
    }
  }

  const existing = requestCounts.get(ip)

  if (!existing || existing.resetTime <= now) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    })
    return null
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    )
  }

  existing.count += 1
  requestCounts.set(ip, existing)
  return null
}

export async function withGeminiTimeout<T>(task: Promise<T>) {
  const timeout = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      reject(new Error('GEMINI_TIMEOUT'))
    }, GEMINI_TIMEOUT_MS)
  })

  return Promise.race([task, timeout])
}

export function isGeminiTimeout(error: unknown) {
  return error instanceof Error && error.message === 'GEMINI_TIMEOUT'
}
