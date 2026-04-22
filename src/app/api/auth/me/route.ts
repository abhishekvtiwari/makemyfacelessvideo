// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

function verifyToken(token: string): { sub: string; email: string; plan: string } | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    const [header, body, sig] = token.split(".");
    if (!header || !body || !sig) return null;

    const expected = createHmac("sha256", secret)
      .update(`${header}.${body}`)
      .digest("base64url");

    if (expected !== sig) return null;

    return JSON.parse(Buffer.from(body, "base64url").toString());
  } catch {
    return null;
  }
}

async function fetchUser(userId: string, email: string) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return {
      id: userId,
      email,
      name: email.split("@")[0],
      plan: "free",
      creditsRemaining: 50,
      creditsTotal: 50,
    };
  }

  const res = await fetch(
    `${supabaseUrl}/rest/v1/users?id=eq.${userId}&select=*`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  );

  if (!res.ok) return null;
  const rows = await res.json();
  if (!rows[0]) return null;

  const u = rows[0];
  return {
    id: u.id,
    email: u.email,
    name: u.name ?? u.email.split("@")[0],
    plan: u.plan ?? "free",
    creditsRemaining: u.credits_remaining ?? 50,
    creditsTotal: u.credits_total ?? 50,
  };
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("mmfv_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  try {
    const user = await fetchUser(payload.sub, payload.email);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (err) {
    console.error("[me]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
