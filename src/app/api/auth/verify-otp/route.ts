// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { getOTP, deleteOTP, incrementAttempts } from "@/lib/otp-store"
import { createServerClient } from "@/lib/supabase"

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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !serviceKey) {
      console.warn("[verify-otp] Supabase not configured — issuing demo token")
      const demoId = Buffer.from(email).toString("base64").slice(0, 24)
      const token = jwt.sign(
        { userId: demoId, email, plan: "free" },
        process.env.JWT_SECRET ?? "dev-secret",
        { expiresIn: "7d" }
      )
      const response = NextResponse.json({
        success: true,
        user: { id: demoId, email, firstName: firstName || null, lastName: lastName || null, plan: "free", videosUsed: 0 },
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

    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email, first_name, last_name, plan, videos_used_this_month")
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
      if (!firstName || !lastName) {
        return NextResponse.json({ error: "First and last name are required." }, { status: 400 })
      }
      if (!password) {
        return NextResponse.json({ error: "Password is required." }, { status: 400 })
      }

      const passwordHash = await bcrypt.hash(password, 12)

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
        })
        .select("id, email, first_name, last_name, plan, videos_used_this_month")
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

    if (!process.env.JWT_SECRET) {
      console.error("[verify-otp] JWT_SECRET not set")
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, plan: user.plan },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name ?? null,
        lastName: user.last_name ?? null,
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
