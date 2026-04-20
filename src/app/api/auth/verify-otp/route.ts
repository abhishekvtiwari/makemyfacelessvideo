// src/app/api/auth/verify-otp/route.ts
// Legacy endpoint — OTP login now goes through NextAuth CredentialsProvider.
// Kept for backwards compatibility with the mmfv_token cookie flow.
import { NextRequest, NextResponse } from "next/server";
import { getOTP, deleteOTP, incrementAttempts } from "@/lib/otp-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const code: string  = (body.code  ?? "").trim();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
    }

    const record = await getOTP(email);

    if (!record) {
      return NextResponse.json({ error: "No code found. Please request a new one." }, { status: 400 });
    }

    if (Date.now() > record.expiresAt) {
      await deleteOTP(email);
      return NextResponse.json({ error: "Code expired. Please request a new one." }, { status: 400 });
    }

    if (record.attempts >= 3) {
      await deleteOTP(email);
      return NextResponse.json({ error: "Too many attempts. Please request a new code." }, { status: 429 });
    }

    await incrementAttempts(email);

    if (record.code !== code) {
      const remaining = 3 - (record.attempts + 1);
      return NextResponse.json(
        { error: `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.` },
        { status: 400 }
      );
    }

    await deleteOTP(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[verify-otp]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
