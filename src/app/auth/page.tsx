// src/app/auth/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleButton from "@/components/auth/GoogleButton";
import OTPInput from "@/components/auth/OTPInput";
import { sendOTP, verifyOTP, getGoogleOAuthUrl } from "@/lib/auth";

type AuthState = "idle" | "sending" | "otp_sent" | "verifying" | "error";

// ─── Logo ────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
        <defs>
          <linearGradient id="auth-logo-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF3B3B" />
            <stop offset="50%" stopColor="#C850C0" />
            <stop offset="100%" stopColor="#FFCC70" />
          </linearGradient>
        </defs>
        <circle cx="18" cy="18" r="17" stroke="url(#auth-logo-grad)" strokeWidth="1.5" opacity="0.5" />
        <path d="M14 11.5L26 18L14 24.5V11.5Z" fill="url(#auth-logo-grad)" />
        <circle cx="28" cy="8" r="2" fill="#FFCC70" opacity="0.9" />
      </svg>
      <span className="font-display text-2xl tracking-wider gradient-text">MMFV</span>
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-[rgba(255,255,255,0.07)]" />
      <span className="font-body text-xs text-[#6b6b80]">or</span>
      <div className="h-px flex-1 bg-[rgba(255,255,255,0.07)]" />
    </div>
  );
}

// ─── Error box ───────────────────────────────────────────────────────────────

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-[rgba(255,69,58,0.3)] bg-[rgba(255,69,58,0.08)] px-4 py-3">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
        <circle cx="8" cy="8" r="7" stroke="#FF453A" strokeWidth="1.5" />
        <path d="M8 5v3.5M8 11h.01" stroke="#FF453A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <p className="font-body text-sm text-[#ff453a]">{message}</p>
    </div>
  );
}

// ─── Resend countdown ────────────────────────────────────────────────────────

function ResendButton({ onResend }: { onResend: () => void }) {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  if (seconds > 0) {
    return (
      <span className="font-body text-sm text-[#6b6b80]">
        Resend code in <span className="font-mono text-[#e8e8f0]">{seconds}s</span>
      </span>
    );
  }

  return (
    <button
      onClick={() => { setSeconds(60); onResend(); }}
      className="font-body text-sm font-semibold text-[#ff2d55] transition-colors hover:text-[#ff375f]"
    >
      Resend code
    </button>
  );
}

// ─── Inner page (uses useSearchParams) ───────────────────────────────────────

function AuthInner() {
  const router = useRouter();
  const params = useSearchParams();
  const planParam = params.get("plan");

  const [state, setState] = useState<AuthState>("idle");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  function isValidEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setState("sending");
    setError("");
    const result = await sendOTP(email);
    if (!result.ok) {
      setError(result.error ?? "Failed to send code. Please try again.");
      setState("error");
      return;
    }
    setState("otp_sent");
  }

  async function handleVerifyOTP(code: string) {
    setState("verifying");
    setError("");
    const result = await verifyOTP(email, code);
    if (!result.ok) {
      setError(result.error ?? "Invalid or expired code.");
      setState("otp_sent");
      setOtp(Array(6).fill(""));
      return;
    }
    const redirect = planParam ? `/dashboard?plan=${planParam}` : "/dashboard";
    router.push(redirect);
  }

  async function handleOTPSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Enter all 6 digits."); return; }
    await handleVerifyOTP(code);
  }

  function handleGoogleLogin() {
    setGoogleLoading(true);
    window.location.href = getGoogleOAuthUrl();
  }

  async function handleResend() {
    setOtp(Array(6).fill(""));
    setError("");
    const result = await sendOTP(email);
    if (!result.ok) setError(result.error ?? "Failed to resend.");
  }

  const isLoading = state === "sending" || state === "verifying";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-5 py-12">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(255,45,85,0.10) 0%, rgba(191,90,242,0.06) 50%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-[460px]">
        <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-8 sm:p-10">

          {/* Logo */}
          <div className="mb-8">
            <Logo />
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl tracking-wider text-[#e8e8f0]">
            WELCOME BACK
          </h1>
          <p className="mt-1 font-body text-sm text-[#6b6b80]">
            Sign in or create your account
          </p>

          <div className="mt-8 flex flex-col gap-5">

            {/* Google */}
            <GoogleButton loading={googleLoading} onClick={handleGoogleLogin} />

            <Divider />

            {/* Email form */}
            {state !== "otp_sent" && state !== "verifying" ? (
              <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block font-body text-sm text-[#e8e8f0]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="input-dark w-full rounded-xl px-4 py-3 font-body text-sm focus:outline-none"
                  />
                </div>

                {(state === "error" || error) && <ErrorBox message={error} />}

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="btn-red-glow w-full rounded-xl py-3.5 font-body text-sm font-semibold disabled:opacity-60"
                >
                  {state === "sending" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    "Send Login Code"
                  )}
                </button>

                <p className="text-center font-body text-xs text-[#6b6b80]">
                  No password needed. We&apos;ll email you a 6-digit code.
                </p>
              </form>
            ) : (
              /* OTP entry */
              <form onSubmit={handleOTPSubmit} className="flex flex-col gap-5">
                <div className="text-center">
                  <p className="font-body text-sm text-[#6b6b80]">
                    We sent a code to{" "}
                    <span className="font-semibold text-[#e8e8f0]">{email}</span>
                  </p>
                </div>

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
                  className="btn-red-glow w-full rounded-xl py-3.5 font-body text-sm font-semibold disabled:opacity-60"
                >
                  {state === "verifying" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Verifying…
                    </span>
                  ) : (
                    "Verify Code"
                  )}
                </button>

                <div className="flex items-center justify-between">
                  <ResendButton onResend={handleResend} />
                  <button
                    type="button"
                    onClick={() => { setState("idle"); setOtp(Array(6).fill("")); setError(""); }}
                    className="font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]"
                  >
                    ← Change email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <p className="mt-6 text-center font-body text-xs text-[#6b6b80]">
          By continuing, you agree to our{" "}
          <a href="#" className="text-[#e8e8f0] underline underline-offset-2">Terms</a>{" "}
          and{" "}
          <a href="#" className="text-[#e8e8f0] underline underline-offset-2">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

// ─── Page (Suspense for useSearchParams) ─────────────────────────────────────

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
          <svg className="h-8 w-8 animate-spin text-[#ff2d55]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      }
    >
      <AuthInner />
    </Suspense>
  );
}
