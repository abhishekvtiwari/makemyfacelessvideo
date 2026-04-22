// src/app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { createServerClient } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const body = await req.json()
    const email: string = (body.email ?? "").trim().toLowerCase()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const supabase = createServerClient()

    // Delete any existing unused codes for this email
    await supabase.from("otp_codes").delete().eq("email", email).eq("used", false)

    const { error: insertError } = await supabase.from("otp_codes").insert({
      email,
      code: otp,
      expires_at: expiresAt,
      used: false,
    })

    if (insertError) {
      console.error("[send-otp] Supabase insert error:", insertError.message)
      return NextResponse.json({ error: "Failed to store code. Please try again." }, { status: 500 })
    }

    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
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

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[send-otp]", err)
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}
