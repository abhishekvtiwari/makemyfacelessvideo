// src/lib/auth.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export interface User {
  id: string;
  email: string;
  name: string;
  plan: "free" | "starter" | "growth" | "influencer" | "ultra" | "character_pro";
  creditsRemaining: number;
  creditsTotal: number;
}

export async function sendOTP(email: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Failed to send code." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function verifyOTP(
  email: string,
  code: string
): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "Invalid code." };
    return { ok: true, user: data.user };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function getSession(): Promise<User | null> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // ignore
  }
}

export function getGoogleOAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  const redirectUri = `${typeof window !== "undefined" ? window.location.origin : ""}/api/auth/google`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}
