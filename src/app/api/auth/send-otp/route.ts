// src/app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { setOTP, getOTP } from "@/lib/otp-store"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email: string = (body.email ?? "").trim().toLowerCase()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
    }

    // Rate-limit: block if a code was sent in the last 60 seconds
    const existing = await getOTP(email)
    if (existing && existing.expiresAt - 9 * 60 * 1000 > Date.now()) {
      return NextResponse.json(
        { error: "Please wait before requesting a new code." },
        { status: 429 }
      )
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store via otp-store (Supabase-backed with in-memory fallback)
    await setOTP(email, otp)

    // Send email — fall back to console log if RESEND_API_KEY not set
    if (!process.env.RESEND_API_KEY) {
      console.log(`[send-otp] DEV MODE — OTP for ${email}: ${otp}`)
      return NextResponse.json({ success: true })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error: emailError } = await resend.emails.send({
      from: process.env.FROM_EMAIL ?? "noreply@makemyfacelessvideo.com",
      to: email,
      subject: "Your MMFV login code",
      html: `
        <div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:40px 20px">
          <h1 style="font-size:32px;font-weight:800;margin-bottom:8px">MMFV</h1>
          <p style="color:#666;margin-bottom:32px">MakeMyFacelessVideo</p>
          <p style="color:#333;margin-bottom:16px">Your login code:</p>
          <div style="background:#f5f5f5;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
            <span style="font-size:48px;font-weight:800;letter-spacing:12px;color:#1a1a2e">${otp}</span>
          </div>
          <p style="color:#999;font-size:13px">Expires in 10 minutes. Do not share this code.</p>
        </div>
      `,
    })

    if (emailError) {
      console.error("[send-otp] Resend error:", emailError)
      return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[send-otp]", err)
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}
