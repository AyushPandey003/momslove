import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const rateLimit = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60

export async function middleware(request: NextRequest) {
  const session = await auth()
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
  return NextResponse.next()
}

  // Optionally block unauthenticated users
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "anonymous"

  const now = Date.now()
  const existing = rateLimit.get(ip) ?? {
    count: 0,
    resetTime: now + RATE_LIMIT_WINDOW,
  }

  if (now > existing.resetTime) {
    existing.count = 0
    existing.resetTime = now + RATE_LIMIT_WINDOW
  }

  existing.count++
  rateLimit.set(ip, existing)

  if (existing.count > MAX_REQUESTS) {
    return new NextResponse("Too Many Requests", { status: 429 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/submit-story",
    "/view-story/:path*",
  ],
}
