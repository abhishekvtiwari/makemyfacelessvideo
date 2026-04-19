// src/app/api/dashboard/route.ts
import { getToken } from "next-auth/jwt";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  // ── Auth check — getToken reads the JWT cookie directly (works in App Router) ─
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = token.email as string;

  // ── Supabase env check ────────────────────────────────────────────────────────
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    // Return session-derived defaults when Supabase isn't configured yet
    return NextResponse.json({
      user: {
        id: null,
        name: (token.name as string) ?? email.split("@")[0],
        email,
        plan: "free",
        credits_remaining: 50,
        credits_total: 50,
        credits_used: 0,
        avatar_url: (token.picture as string) ?? null,
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
          id: null,
          name: (token.name as string) ?? email.split("@")[0],
          email,
          plan: "free",
          credits_remaining: 50,
          credits_total: 50,
          credits_used: 0,
          avatar_url: (token.picture as string) ?? null,
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
