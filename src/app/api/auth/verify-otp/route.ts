// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { getOTP, deleteOTP, incrementAttempts } from "@/lib/otp-store"
import { createServerClient } from "@/lib/supabase"

function setCookieAndRespond(
  payload: { userId: string; email: string; plan: string },
  body: Record<string, unknown>
): NextResponse {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" })
  const response = NextResponse.json(body)
  response.cookies.set("mmfv_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
  return response
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email: string = (body.email ?? "").trim().toLowerCase()
    const code: string = (body.code ?? "").trim()
    const isSignup: boolean = body.isSignup === true
    const firstName: string = (body.firstName ?? "").trim()
    const lastName: string = (body.lastName ?? "").trim()
    const password: string = body.password ?? ""

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required." }, { status: 400 })
    }

    if (!process.env.JWT_SECRET) {
      console.error("[verify-otp] JWT_SECRET not set")
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 })
    }

    // ── 1. Validate OTP ───────────────────────────────────────────────────────
    const record = await getOTP(email)

    if (!record) {
      return NextResponse.json({ error: "No code found. Please request a new one." }, { status: 400 })
    }
    if (Date.now() > record.expiresAt) {
      deleteOTP(email) // fire & forget
      return NextResponse.json({ error: "Code expired. Please request a new one." }, { status: 400 })
    }
    if (record.attempts >= 3) {
      deleteOTP(email) // fire & forget
      return NextResponse.json({ error: "Too many attempts. Please request a new code." }, { status: 429 })
    }
    if (record.code !== code) {
      incrementAttempts(email) // fire & forget
      const remaining = 3 - (record.attempts + 1)
      return NextResponse.json(
        { error: `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.` },
        { status: 400 }
      )
    }

    // Code is correct — delete OTP asynchronously, don't block on it
    deleteOTP(email)

    // ── 2. No-DB fast path ────────────────────────────────────────────────────
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      const demoId = Buffer.from(email).toString("base64").slice(0, 24)
      return setCookieAndRespond(
        { userId: demoId, email, plan: "free" },
        { success: true, user: { id: demoId, email, firstName: firstName || null, lastName: lastName || null, plan: "free", videosUsed: 0 } }
      )
    }

    const supabase = createServerClient()

    // ── 3. Signup: hash password + check existence in parallel ────────────────
    if (isSignup) {
      if (!firstName || !lastName) {
        return NextResponse.json({ error: "First and last name are required." }, { status: 400 })
      }
      if (!password) {
        return NextResponse.json({ error: "Password is required." }, { status: 400 })
      }

      // Run bcrypt hash and DB existence check simultaneously
      const [passwordHash, { data: existingUser }] = await Promise.all([
        bcrypt.hash(password, 10), // 10 rounds: ~100ms, still secure
        supabase.from("users").select("id").eq("email", email).maybeSingle(),
      ])

      if (existingUser) {
        return NextResponse.json({ error: "Account already exists.", redirect: "/auth/login" }, { status: 409 })
      }

      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          email,
          first_name: firstName,
          last_name: lastName,
          name: `${firstName} ${lastName}`,
          password_hash: passwordHash,
          auth_method: "email",
          plan: "free",
          credits_total: 3,
          credits_used: 0,
          credits_remaining: 3,
          videos_used_this_month: 0,
        })
        .select("id, email, first_name, last_name, plan, videos_used_this_month")
        .single()

      if (createError || !newUser) {
        // Always log the real error — visible in Vercel function logs
        console.error("[verify-otp] user create error:", createError?.code, createError?.message, createError?.details)
        return NextResponse.json(
          { error: "Failed to create account.", code: createError?.code, detail: createError?.message },
          { status: 500 }
        )
      }

      return setCookieAndRespond(
        { userId: newUser.id, email: newUser.email, plan: newUser.plan },
        { success: true, user: { id: newUser.id, email: newUser.email, firstName: newUser.first_name ?? null, lastName: newUser.last_name ?? null, plan: newUser.plan, videosUsed: newUser.videos_used_this_month ?? 0 } }
      )
    }

    // ── 4. Login: just look up existing user ──────────────────────────────────
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, plan, videos_used_this_month")
      .eq("email", email)
      .maybeSingle()

    if (!existingUser) {
      return NextResponse.json({ error: "No account found.", redirect: "/auth/signup" }, { status: 404 })
    }

    return setCookieAndRespond(
      { userId: existingUser.id, email: existingUser.email, plan: existingUser.plan },
      { success: true, user: { id: existingUser.id, email: existingUser.email, firstName: existingUser.first_name ?? null, lastName: existingUser.last_name ?? null, plan: existingUser.plan, videosUsed: existingUser.videos_used_this_month ?? 0 } }
    )
  } catch (err) {
    console.error("[verify-otp]", err)
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}
