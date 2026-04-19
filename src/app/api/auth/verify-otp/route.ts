// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getOTP, deleteOTP, incrementAttempts } from "@/lib/otp-store";

function signToken(payload: object): string {
  const secret = process.env.JWT_SECRET ?? "dev_secret_change_in_production";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) })
  ).toString("base64url");
  const sig = createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${sig}`;
}

async function upsertUser(email: string) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return {
      id: `usr_${Buffer.from(email).toString("base64").slice(0, 12)}`,
      email,
      name: email.split("@")[0],
      plan: "free",
      credits_remaining: 50,
      credits_total: 50,
    };
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/users`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      email,
      name: email.split("@")[0],
      plan: "free",
      credits_remaining: 50,
      credits_total: 50,
    }),
  });

  if (!res.ok) throw new Error("Supabase upsert failed");
  const rows = await res.json();
  return rows[0];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const code: string = (body.code ?? "").trim();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
    }

    const record = getOTP(email);

    if (!record) {
      return NextResponse.json(
        { error: "No code found. Please request a new one." },
        { status: 400 }
      );
    }

    if (Date.now() > record.expiresAt) {
      deleteOTP(email);
      return NextResponse.json(
        { error: "Code expired. Please request a new one." },
        { status: 400 }
      );
    }

    incrementAttempts(email);

    if (record.attempts > 3) {
      deleteOTP(email);
      return NextResponse.json(
        { error: "Too many attempts. Please request a new code." },
        { status: 429 }
      );
    }

    if (record.code !== code) {
      const remaining = 3 - record.attempts;
      return NextResponse.json(
        { error: `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.` },
        { status: 400 }
      );
    }

    deleteOTP(email);

    const dbUser = await upsertUser(email);

    const token = signToken({
      sub: dbUser.id,
      email: dbUser.email,
      plan: dbUser.plan ?? "free",
    });

    const user = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name ?? email.split("@")[0],
      plan: dbUser.plan ?? "free",
      creditsRemaining: dbUser.credits_remaining ?? 50,
      creditsTotal: dbUser.credits_total ?? 50,
    };

    const response = NextResponse.json({ ok: true, user });
    response.cookies.set("mmfv_token", token, {
      httpOnly: true,
      secure: process.env.APP_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[verify-otp]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
