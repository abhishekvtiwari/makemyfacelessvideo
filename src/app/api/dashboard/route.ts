// src/app/api/dashboard/route.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

interface TokenPayload extends JwtPayload {
  userId: string
  email: string
  plan: string
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  // ── Auth check — verify mmfv_token httpOnly cookie ───────────────────────────
  const rawToken = req.cookies.get("mmfv_token")?.value;
  if (!rawToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: TokenPayload;
  try {
    payload = jwt.verify(rawToken, process.env.JWT_SECRET!) as TokenPayload;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = payload.email;

  // ── Supabase env check ────────────────────────────────────────────────────────
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    // Return token-derived defaults when Supabase isn't configured yet
    return NextResponse.json({
      user: {
        id: payload.userId,
        name: email.split("@")[0],
        email,
        plan: payload.plan ?? "free",
        credits_remaining: 3,
        credits_total: 3,
        credits_used: 0,
        avatar_url: null,
        created_at: new Date().toISOString(),
      },
      videos: [],
      activity: [],
    });
  }

  try {
    const supabase = getSupabase();

    // ── User profile ────────────────────────────────────────────────────────────
    const { data: dbUser, error: userError } = await supabase
      .from("users")
      .select("id, name, email, plan, credits_remaining, credits_total, credits_used, created_at, avatar_url")
      .eq("email", email)
      .maybeSingle();

    // User not in DB yet (e.g. first OTP login before upsert completed) — return safe defaults
    if (userError || !dbUser) {
      console.warn("[dashboard] user not found in DB for email:", email, userError?.message);
      return NextResponse.json({
        user: {
          id: payload.userId,
          name: email.split("@")[0],
          email,
          plan: payload.plan ?? "free",
          credits_remaining: 3,
          credits_total: 3,
          credits_used: 0,
          avatar_url: null,
          created_at: new Date().toISOString(),
        },
        videos: [],
        activity: [],
      });
    }

    // ── Recent videos — gracefully handle missing table ─────────────────────────
    let videos: unknown[] = [];
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("id, title, status, platform, created_at, video_url, thumbnail_url")
        .eq("user_id", dbUser.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (!error) videos = data ?? [];
    } catch {
      // table doesn't exist yet — skip silently
    }

    // ── Activity log — gracefully handle missing table ──────────────────────────
    let activity: unknown[] = [];
    try {
      const { data, error } = await supabase
        .from("activity_log")
        .select("id, action, metadata, ip_address, created_at")
        .eq("user_id", dbUser.id)
        .order("created_at", { ascending: false })
        .limit(15);
      if (!error) activity = data ?? [];
    } catch {
      // table doesn't exist yet — skip silently
    }

    return NextResponse.json({ user: dbUser, videos, activity });
  } catch (err) {
    console.error("[dashboard API] unexpected error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
