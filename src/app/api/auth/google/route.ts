// src/app/api/auth/google/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

function signToken(payload: object): string {
  const secret = process.env.JWT_SECRET ?? "dev_secret_change_in_production";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) })).toString("base64url");
  const sig = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error("Token exchange failed");
  return res.json();
}

async function getGoogleUser(accessToken: string) {
  const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Failed to fetch Google user");
  return res.json();
}

async function upsertUser(email: string, name: string, googleId: string) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return {
      id: `usr_${Buffer.from(email).toString("base64").slice(0, 12)}`,
      email,
      name,
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
      name,
      google_id: googleId,
      plan: "free",
      credits_remaining: 50,
      credits_total: 50,
    }),
  });

  if (!res.ok) throw new Error("Supabase upsert failed");
  const rows = await res.json();
  return rows[0];
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${origin}/auth?error=google_cancelled`);
  }

  try {
    const redirectUri = `${origin}/api/auth/google`;
    const tokens = await exchangeCodeForTokens(code, redirectUri);
    const googleUser = await getGoogleUser(tokens.access_token);

    const dbUser = await upsertUser(googleUser.email, googleUser.name, googleUser.id);

    const token = signToken({
      sub: dbUser.id,
      email: dbUser.email,
      plan: dbUser.plan ?? "free",
    });

    const response = NextResponse.redirect(`${origin}/dashboard`);

    response.cookies.set("mmfv_token", token, {
      httpOnly: true,
      secure: process.env.APP_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[google-oauth]", err);
    return NextResponse.redirect(`${origin}/auth?error=google_failed`);
  }
}
