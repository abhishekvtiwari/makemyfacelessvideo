// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = [
  "/",
  "/auth/login",
  "/auth/signup",
  "/auth/verify",
  "/pricing",
  "/privacy",
  "/terms",
  "/api/auth",
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("mmfv_token")?.value
  const path = request.nextUrl.pathname

  const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + "/"))

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (token && (path === "/auth/login" || path === "/auth/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)" ],
}
