// src/app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { randomInt } from "crypto";
import { setOTP, getOTP } from "@/lib/otp-store";

function generateOTP(): string {
  return String(randomInt(100000, 999999));
}

async function sendOTPEmail(email: string, code: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[send-otp] RESEND_API_KEY not set — OTP:", code);
    return true;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL ?? "noreply@makemyfacelessvideo.com",
      to: email,
      subject: "Your MakeMyFacelessVideo login code",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#111118;color:#e8e8f0;padding:40px;border-radius:12px;">
          <h1 style="font-size:32px;margin:0 0 8px;color:#e8e8f0;letter-spacing:2px;">MMFV</h1>
          <p style="color:#6b6b80;margin:0 0 32px;">MakeMyFacelessVideo.com</p>
          <p style="margin:0 0 16px;">Your login code is:</p>
          <div style="background:#1a1a24;border-radius:8px;padding:24px;text-align:center;letter-spacing:12px;font-size:36px;font-weight:bold;color:#ff2d55;margin:0 0 24px;">
            ${code}
          </div>
          <p style="color:#6b6b80;font-size:13px;margin:0;">Expires in 10 minutes. Never share this code.</p>
        </div>
      `,
    }),
  });

  return res.ok;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string = (body.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Rate limit: block if sent within last minute
    const existing = await getOTP(email);
    if (existing && existing.expiresAt - 9 * 60 * 1000 > Date.now()) {
      return NextResponse.json(
        { error: "Please wait before requesting a new code." },
        { status: 429 }
      );
    }

    const code = generateOTP();
    await setOTP(email, code);

    const sent = await sendOTPEmail(email, code);
    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[send-otp]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
