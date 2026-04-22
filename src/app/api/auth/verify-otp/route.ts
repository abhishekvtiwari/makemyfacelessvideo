// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getOTP, deleteOTP, incrementAttempts } from "@/lib/otp-store"
import { createServerClient } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email: string = (body.email ?? "").trim().toLowerCase()
    const code: string = (body.code ?? "").trim()
    const isSignup: boolean = body.isSignup === true
    const name: string = (body.name ?? "").trim()

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required." }, { status: 400 })
    }

    // Validate OTP via otp-store (Supabase + memory fallback)
    const record = await getOTP(email)

    if (!record) {
      return NextResponse.json({ error: "No code found. Please request a new one." }, { status: 400 })
    }

    if (Date.now() > record.expiresAt) {
      await deleteOTP(email)
      return NextResponse.json({ error: "Code expired. Please request a new one." }, { status: 400 })
    }

    if (record.attempts >= 3) {
      await deleteOTP(email)
      return NextResponse.json({ error: "Too many attempts. Please request a new code." }, { status: 429 })
    }

    if (record.code !== code) {
      await incrementAttempts(email)
      const remaining = 3 - (record.attempts + 1)
      return NextResponse.json(
        { error: `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.` },
        { status: 400 }
      )
    }

    await deleteOTP(email)

    // Check if Supabase is configured before doing user operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !serviceKey) {
      // No DB configured — issue a demo JWT and redirect
      console.warn("[verify-otp] Supabase not configured — issuing demo token")
      const demoId = Buffer.from(email).toString("base64").slice(0, 24)
      const token = jwt.sign(
        { userId: demoId, email, plan: "free" },
        process.env.JWT_SECRET ?? "dev-secret",
        { expiresIn: "7d" }
      )
      const response = NextResponse.json({
        success: true,
        user: { id: demoId, email, name: name || null, plan: "free", videosUsed: 0 },
      })
      response.cookies.set("mmfv_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
      return response
    }

    const supabase = createServerClient()

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email, name, plan, videos_used_this_month")
      .eq("email", email)
      .maybeSingle()

    if (isSignup && existingUser) {
      return NextResponse.json(
        { error: "Account already exists.", redirect: "/auth/login" },
        { status: 409 }
      )
    }

    if (!isSignup && !existingUser) {
      return NextResponse.json(
        { error: "No account found.", redirect: "/auth/signup" },
        { status: 404 }
      )
    }

    let user = existingUser

    if (isSignup && !existingUser) {
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({ email, name: name || null, auth_method: "email", plan: "free" })
        .select("id, email, name, plan, videos_used_this_month")
        .single()

      if (createError || !newUser) {
        const detail = createError?.message ?? "unknown"
        console.error("[verify-otp] user create error:", detail)
        return NextResponse.json(
          {
            error: "Failed to create account.",
            detail: process.env.NODE_ENV !== "production" ? detail : undefined,
          },
          { status: 500 }
        )
      }
      user = newUser
    }

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 500 })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, plan: user.plan },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    )

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        plan: user.plan,
        videosUsed: user.videos_used_this_month ?? 0,
      },
    })

    response.cookies.set("mmfv_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (err) {
    console.error("[verify-otp]", err)
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}
