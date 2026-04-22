// src/lib/otp-store.ts
// Supabase-backed OTP store — works across Vercel serverless instances.
// Requires table: otp_codes(email TEXT PK, code TEXT, expires_at TIMESTAMPTZ, attempts INT)
// Falls back to in-memory if Supabase is unavailable (local dev safety net).

import { createClient } from "@supabase/supabase-js";

interface OTPRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

// ── In-memory fallback ────────────────────────────────────────────────────────
const memStore = new Map<string, OTPRecord>();

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function setOTP(email: string, code: string): Promise<void> {
  const expiresAt = Date.now() + 10 * 60 * 1000;
  const supabase = getSupabase();

  if (supabase) {
    const { error } = await supabase.from("otp_codes").upsert({
      email,
      code,
      expires_at: new Date(expiresAt).toISOString(),
      attempts: 0,
    });
    if (!error) return;
    console.warn("[otp-store] Supabase write failed, falling back to memory:", error.message);
  }

  memStore.set(email, { code, expiresAt, attempts: 0 });
}

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getOTP(email: string): Promise<OTPRecord | null> {
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("otp_codes")
      .select("code, expires_at, attempts")
      .eq("email", email)
      .maybeSingle();

    if (!error && data) {
      return {
        code: data.code,
        expiresAt: new Date(data.expires_at).getTime(),
        attempts: data.attempts,
      };
    }
  }

  return memStore.get(email) ?? null;
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteOTP(email: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) await supabase.from("otp_codes").delete().eq("email", email);
  memStore.delete(email);
}

// ── Increment attempts ────────────────────────────────────────────────────────

export async function incrementAttempts(email: string): Promise<void> {
  const supabase = getSupabase();

  if (supabase) {
    const { data } = await supabase
      .from("otp_codes")
      .select("attempts")
      .eq("email", email)
      .maybeSingle();

    await supabase
      .from("otp_codes")
      .update({ attempts: (data?.attempts ?? 0) + 1 })
      .eq("email", email);
    return;
  }

  const rec = memStore.get(email);
  if (rec) rec.attempts++;
}
