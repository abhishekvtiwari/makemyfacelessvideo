// src/app/auth/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import OTPInput from "@/components/auth/OTPInput";
import { sendOTP } from "@/lib/auth";

type AuthState = "idle" | "sending" | "otp_sent" | "verifying";

const PLAN_LABELS: Record<string, string> = {
  starter:       "Starter — $19.99/mo",
  growth:        "Growth — $29.99/mo",
  influencer:    "Influencer — $59.99/mo",
  ultra:         "Ultra — $89.99/mo",
  character_pro: "Character Pro — $129/mo",
};

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-[rgba(220,38,38,0.25)] bg-[rgba(220,38,38,0.06)] px-4 py-3">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="mt-px shrink-0">
        <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5" />
        <path d="M8 5v3.5M8 11h.01" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <p className="text-sm" style={{ color: '#DC2626', fontFamily: 'var(--font-geist)' }}>{message}</p>
    </div>
  );
}

function ResendButton({ onResend }: { onResend: () => void }) {
  const [secs, setSecs] = useState(60);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  if (secs > 0)
    return (
      <span className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>
        Resend in <span style={{ fontFamily: 'var(--font-geist-mono)', color: '#0A0A0A' }}>{secs}s</span>
      </span>
    );

  return (
    <button
      onClick={() => { setSecs(60); onResend(); }}
      className="text-sm font-semibold transition-colors"
      style={{ color: '#4633E0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-geist)' }}
      onMouseEnter={e => (e.currentTarget.style.color = '#3829c8')}
      onMouseLeave={e => (e.currentTarget.style.color = '#4633E0')}
    >
      Resend code
    </button>
  );
}

function AuthInner() {
  const router = useRouter();
  const params = useSearchParams();
  const planParam = params.get("plan");

  const [state, setState] = useState<AuthState>("idle");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const planLabel = planParam ? PLAN_LABELS[planParam] : null;

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard", redirect: true });
  }

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setState("sending");
    setError("");
    const res = await sendOTP(email);
    if (!res.ok) { setError(res.error ?? "Failed to send. Try again."); setState("idle"); return; }
    setState("otp_sent");
  }

  async function handleVerifyOTP(code: string) {
    setState("verifying");
    setError("");
    const res = await signIn("otp", { email, code, redirect: false });
    if (!res || res.error) {
      setError("Invalid or expired code. Please try again.");
      setState("otp_sent");
      setOtp(Array(6).fill(""));
      return;
    }
    router.push(planParam ? `/dashboard?plan=${planParam}` : "/dashboard");
  }

  async function handleOTPSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Enter all 6 digits."); return; }
    await handleVerifyOTP(code);
  }

  async function handleResend() {
    setOtp(Array(6).fill(""));
    setError("");
    const res = await sendOTP(email);
    if (!res.ok) setError(res.error ?? "Failed to resend.");
  }

  const showOTP = state === "otp_sent" || state === "verifying";

  return (
    <div className="flex min-h-screen" style={{ background: '#F5F2EE' }}>

      {/* Left panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden lg:flex lg:w-[420px] xl:w-[480px]"
        style={{ background: '#FFFFFF', borderRight: '1px solid rgba(0,0,0,0.07)', padding: '40px' }}>
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(70,51,224,0.06) 0%, rgba(10,122,112,0.04) 50%, transparent 75%)" }} />

        <div className="relative z-10">
          <Link href="/" className="text-2xl tracking-wider" style={{ fontFamily: 'var(--font-fraunces)', color: '#0A0A0A', textDecoration: 'none' }}>
            MMFV<span className="gradient-text">.</span>
          </Link>
        </div>

        <div className="relative z-10 flex flex-col gap-6">
          <h2 className="font-display text-4xl leading-tight tracking-wider" style={{ color: '#0A0A0A' }}>
            CREATE VIRAL<br />
            <span className="gradient-text">FACELESS VIDEOS</span><br />
            IN MINUTES
          </h2>
          <ul className="flex flex-col gap-3">
            {[
              "AI script + voiceover + B-roll",
              "Publish to YouTube, TikTok & IG",
              "50 free credits — no card needed",
              "Cancel anytime",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <path d="M3 8l3.5 3.5L13 5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10">
          <p className="text-xs" style={{ color: '#9CA3AF', fontFamily: 'var(--font-geist)' }}>© 2026 MakeMyFacelessVideo.com</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div aria-hidden className="pointer-events-none fixed left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 lg:hidden"
          style={{ background: "radial-gradient(circle, rgba(70,51,224,0.10) 0%, transparent 70%)" }} />

        <div className="relative z-10 w-full max-w-[420px]">

          <div className="mb-8 flex justify-center lg:hidden">
            <Link href="/" className="text-2xl tracking-wider" style={{ fontFamily: 'var(--font-fraunces)', color: '#0A0A0A', textDecoration: 'none' }}>
              MMFV<span className="gradient-text">.</span>
            </Link>
          </div>

          <div className="rounded-2xl p-8 sm:p-10" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

            {planLabel && (
              <div className="mb-5 flex items-center gap-2 rounded-xl px-4 py-2.5"
                style={{ background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.20)' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3.5 3.5L12 3" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm" style={{ color: '#059669', fontFamily: 'var(--font-geist)' }}>
                  Selected: <span className="font-semibold">{planLabel}</span>
                </span>
              </div>
            )}

            {!showOTP ? (
              <>
                <h1 className="font-display text-4xl tracking-wider" style={{ color: '#0A0A0A' }}>
                  {planLabel ? "COMPLETE SIGNUP" : "WELCOME"}
                </h1>
                <p className="mt-1 text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>
                  Sign in or create your account — it&apos;s the same thing.
                </p>
              </>
            ) : (
              <>
                <h1 className="font-display text-3xl tracking-wider" style={{ color: '#0A0A0A' }}>
                  CHECK YOUR EMAIL
                </h1>
                <p className="mt-1 text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold" style={{ color: '#0A0A0A' }}>{email}</span>
                </p>
              </>
            )}

            <div className="mt-7 flex flex-col gap-4">

              {!showOTP && (
                <>
                  <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3.5 text-sm font-medium transition-all disabled:opacity-60"
                    style={{
                      border: '1px solid rgba(0,0,0,0.12)',
                      background: '#FAFAFA',
                      color: '#0A0A0A',
                      fontFamily: 'var(--font-geist)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F5F2EE')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#FAFAFA')}
                  >
                    {googleLoading ? <Spinner /> : (
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.23C18.5 15.57 19.6 13.01 19.6 10.23Z" fill="#4285F4" />
                        <path d="M10 20c2.7 0 4.97-.9 6.62-2.43l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H1.08v2.58A9.99 9.99 0 0 0 10 20Z" fill="#34A853" />
                        <path d="M4.41 11.91A5.98 5.98 0 0 1 4.1 10c0-.66.12-1.3.31-1.91V5.51H1.08A10 10 0 0 0 0 10c0 1.61.38 3.14 1.08 4.49l3.33-2.58Z" fill="#FBBC05" />
                        <path d="M10 3.97c1.47 0 2.79.5 3.83 1.5l2.86-2.86C14.96.9 12.69 0 10 0A9.99 9.99 0 0 0 1.08 5.51l3.33 2.58C5.2 5.73 7.4 3.97 10 3.97Z" fill="#EA4335" />
                      </svg>
                    )}
                    {googleLoading ? "Connecting…" : "Continue with Google"}
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.08)' }} />
                    <span className="text-xs" style={{ color: '#9CA3AF', fontFamily: 'var(--font-geist)' }}>or use email</span>
                    <div className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.08)' }} />
                  </div>

                  <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium" style={{ color: '#0A0A0A', fontFamily: 'var(--font-geist)' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                        placeholder="you@example.com"
                        autoComplete="email"
                        autoFocus
                        className="input-light w-full"
                      />
                    </div>

                    {error && <ErrorBox message={error} />}

                    <button
                      type="submit"
                      disabled={state === "sending" || !email}
                      className="btn-violet w-full rounded-xl py-3.5 text-sm font-semibold disabled:opacity-60"
                    >
                      {state === "sending" ? (
                        <span className="flex items-center justify-center gap-2"><Spinner /> Sending…</span>
                      ) : "Send Login Code"}
                    </button>

                    <p className="text-center text-xs" style={{ color: '#9CA3AF', fontFamily: 'var(--font-geist)' }}>
                      No password needed. We&apos;ll email a 6-digit code.
                    </p>
                  </form>
                </>
              )}

              {showOTP && (
                <form onSubmit={handleOTPSubmit} className="flex flex-col gap-5">
                  <OTPInput
                    value={otp}
                    onChange={(v) => { setOtp(v); if (error) setError(""); }}
                    hasError={!!error}
                    onComplete={handleVerifyOTP}
                  />

                  {error && <ErrorBox message={error} />}

                  <button
                    type="submit"
                    disabled={state === "verifying"}
                    className="btn-violet w-full rounded-xl py-3.5 text-sm font-semibold disabled:opacity-60"
                  >
                    {state === "verifying" ? (
                      <span className="flex items-center justify-center gap-2"><Spinner /> Verifying…</span>
                    ) : "Verify & Sign In"}
                  </button>

                  <div className="flex items-center justify-between">
                    <ResendButton onResend={handleResend} />
                    <button
                      type="button"
                      onClick={() => { setState("idle"); setOtp(Array(6).fill("")); setError(""); }}
                      className="text-sm transition-colors"
                      style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-geist)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0A')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                    >
                      ← Change email
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <p className="mt-5 text-center text-xs" style={{ color: '#9CA3AF', fontFamily: 'var(--font-geist)' }}>
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2" style={{ color: '#4633E0' }}>Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline underline-offset-2" style={{ color: '#4633E0' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#F5F2EE' }}>
        <svg className="h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="none" style={{ color: '#4633E0' }}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    }>
      <AuthInner />
    </Suspense>
  );
}
