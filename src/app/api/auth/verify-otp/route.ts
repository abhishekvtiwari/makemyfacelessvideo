// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
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

    const supabase = createServerClient()

    // Validate OTP
    const { data: otpRecord, error: otpError } = await supabase
      .from("otp_codes")
      .select("id, code, expires_at, used")
      .eq("email", email)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (otpError || !otpRecord) {
      return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 })
    }

    if (new Date(otpRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: "Code expired. Please request a new one." }, { status: 400 })
    }

    if (otpRecord.code !== code) {
      return NextResponse.json({ error: "Invalid code." }, { status: 400 })
    }

    // Mark OTP as used
    await supabase.from("otp_codes").update({ used: true }).eq("id", otpRecord.id)

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

    // Create new user on signup
    if (isSignup && !existingUser) {
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({ email, name: name || null, auth_method: "email", plan: "free" })
        .select("id, email, name, plan, videos_used_this_month")
        .single()

      if (createError || !newUser) {
        console.error("[verify-otp] user create error:", createError?.message)
        return NextResponse.json({ error: "Failed to create account." }, { status: 500 })
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
