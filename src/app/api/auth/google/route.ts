// src/app/api/auth/google/route.ts
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { createServerClient } from "@/lib/supabase"

async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`token_exchange_failed: ${res.status} ${body}`)
  }
  return res.json() as Promise<{ access_token: string }>
}

async function getGoogleUser(accessToken: string) {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`userinfo_failed: ${res.status}`)
  return res.json() as Promise<{ id: string; email: string; name: string; picture?: string }>
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(`${origin}/auth/login?error=google_cancelled`)
  }

  // Validate required env vars up-front
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("[google-oauth] Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET")
    return NextResponse.redirect(`${origin}/auth/login?error=google_failed&reason=missing_client_creds`)
  }
  if (!process.env.JWT_SECRET) {
    console.error("[google-oauth] Missing JWT_SECRET")
    return NextResponse.redirect(`${origin}/auth/login?error=google_failed&reason=missing_jwt_secret`)
  }

  try {
    const redirectUri = `${origin}/api/auth/google`
    const tokens = await exchangeCodeForTokens(code, redirectUri)
    const googleUser = await getGoogleUser(tokens.access_token)

    const supabase = createServerClient()

    // Try full upsert first; if columns are missing fall back to email-only
    type DbError = { message: string; code: string }
    type UserRow = { id: string; email: string; name?: string | null; plan?: string | null }

    let upserted: UserRow | null = null
    let upsertErr: DbError | null = null

    const fullResult = await supabase
      .from("users")
      .upsert(
        {
          email: googleUser.email,
          name: googleUser.name,
          avatar_url: googleUser.picture ?? null,
          auth_method: "google",
          plan: "free",
        },
        { onConflict: "email", ignoreDuplicates: false }
      )
      .select("id, email, name, plan, created_at")
      .single()

    if (fullResult.error?.code === "PGRST204") {
      console.warn("[google-oauth] falling back to minimal upsert — run ALTER TABLE to add missing columns")
      const minResult = await supabase
        .from("users")
        .upsert({ email: googleUser.email }, { onConflict: "email", ignoreDuplicates: true })
        .select("id, email, created_at")
        .single()
      upserted = minResult.data as UserRow | null
      upsertErr = minResult.error as DbError | null
    } else {
      upserted = fullResult.data as UserRow | null
      upsertErr = fullResult.error as DbError | null
    }

    if (upsertErr || !upserted) {
      console.error("[google-oauth] upsert error:", upsertErr?.message)
      return NextResponse.redirect(`${origin}/auth/login?error=google_failed&reason=db_${upsertErr?.code ?? "unknown"}`)
    }

    // Detect new vs returning user — new users get a welcome redirect
    const isNewUser = (() => {
      try {
        const created = (upserted as Record<string, unknown>).created_at
        if (!created) return false
        return Date.now() - new Date(created as string).getTime() < 30_000
      } catch {
        return false
      }
    })()

    const token = jwt.sign(
      { userId: upserted.id, email: upserted.email, plan: upserted.plan },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    const redirectPath = isNewUser ? "/dashboard?welcome=1" : "/dashboard"
    const response = NextResponse.redirect(`${origin}${redirectPath}`)
    response.cookies.set("mmfv_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("[google-oauth]", msg)
    return NextResponse.redirect(`${origin}/auth/login?error=google_failed&reason=${encodeURIComponent(msg.slice(0, 60))}`)
  }
}
