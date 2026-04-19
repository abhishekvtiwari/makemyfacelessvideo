// src/app/auth/verify/page.tsx
"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// ─── Logo ────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
        <defs>
          <linearGradient id="verify-logo-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF3B3B" />
            <stop offset="50%" stopColor="#C850C0" />
            <stop offset="100%" stopColor="#FFCC70" />
          </linearGradient>
        </defs>
        <circle cx="18" cy="18" r="17" stroke="url(#verify-logo-grad)" strokeWidth="1.5" opacity="0.5" />
        <path d="M14 11.5L26 18L14 24.5V11.5Z" fill="url(#verify-logo-grad)" />
        <circle cx="28" cy="8" r="2" fill="#FFCC70" opacity="0.9" />
      </svg>
      <span className="font-display text-2xl tracking-wider gradient-text">MMFV</span>
    </div>
  );
}

// ─── OTP boxes ───────────────────────────────────────────────────────────────

function OtpBoxes({
  value,
  onChange,
  hasError,
  onComplete,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  hasError: boolean;
  onComplete: (code: string) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback(
    (i: number, raw: string) => {
      const char = raw.replace(/\D/g, "").slice(-1);
      const next = [...value];
      next[i] = char;
      onChange(next);
      if (char) {
        if (i < 5) {
          refs.current[i + 1]?.focus();
        } else {
          // Last box filled — check if all filled for auto-submit
          const complete = next.every((d) => d !== "");
          if (complete) onComplete(next.join(""));
        }
      }
    },
    [value, onChange, onComplete]
  );

  const handleKeyDown = useCallback(
    (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !value[i] && i > 0) {
        refs.current[i - 1]?.focus();
      }
    },
    [value]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      const next = Array(6).fill("");
      digits.split("").forEach((c, idx) => (next[idx] = c));
      onChange(next);
      const focusIdx = Math.min(digits.length, 5);
      refs.current[focusIdx]?.focus();
      if (next.every((d) => d !== "")) onComplete(next.join(""));
    },
    [onChange, onComplete]
  );

  return (
    <div
      className={`flex justify-center gap-3 transition-all duration-200 ${
        hasError ? "animate-[shake_0.35s_ease]" : ""
      }`}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          autoFocus={i === 0}
          className={`h-14 w-11 rounded-xl border bg-[#1a1a24] text-center font-body text-xl font-semibold text-[#e8e8f0] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(255,45,85,0.25)] sm:h-16 sm:w-13 ${
            hasError
              ? "border-[#ff453a] bg-[rgba(255,69,58,0.1)] text-[#ff453a]"
              : value[i]
              ? "border-[#ff2d55]"
              : "border-[rgba(255,255,255,0.1)] focus:border-[#ff2d55]"
          }`}
          style={{ width: "2.75rem" }}
        />
      ))}
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
        Resend code in{" "}
        <span className="font-mono text-[#e8e8f0]">{seconds}s</span>
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

// ─── Inner page (uses searchParams) ──────────────────────────────────────────

function VerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const emailParam = params.get("email") ?? "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function mockVerify(code: string) {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1500));
    if (code !== "123456") {
      setLoading(false);
      setError("Invalid code. Please try again. (Hint: use 123456 for demo)");
      return;
    }
    router.push("/dashboard");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Enter all 6 digits."); return; }
    await mockVerify(code);
  }

  async function handleResend() {
    setOtp(Array(6).fill(""));
    setError("");
    // Mock resend — no real API call
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-5 py-12">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(191,90,242,0.12) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Card */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-8 sm:p-10">

          {/* Logo */}
          <div className="mb-8">
            <Logo />
          </div>

          {/* Email icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a1a24] border border-[rgba(191,90,242,0.2)]">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="3" y="7" width="26" height="18" rx="3" stroke="#BF5AF2" strokeWidth="1.5" fill="none" />
                <path d="M3 11l13 8 13-8" stroke="#BF5AF2" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <h1 className="mb-1 text-center font-display text-4xl tracking-wider text-[#e8e8f0]">
            CHECK YOUR EMAIL
          </h1>
          <p className="mb-8 text-center font-body text-sm text-[#6b6b80]">
            We sent a 6-digit code to{" "}
            {emailParam ? (
              <span className="font-semibold text-[#e8e8f0]">{emailParam}</span>
            ) : (
              "your email address"
            )}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <OtpBoxes
              value={otp}
              onChange={(v) => { setOtp(v); if (error) setError(""); }}
              hasError={!!error}
              onComplete={mockVerify}
            />

            {error && <ErrorBox message={error} />}

            <button
              type="submit"
              disabled={loading}
              className="btn-red-glow w-full rounded-xl py-3.5 font-body text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Verifying…
                </span>
              ) : "Verify"}
            </button>

            {/* Resend */}
            <div className="flex justify-center">
              <ResendButton onResend={handleResend} />
            </div>
          </form>

          {/* Different email link */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]"
            >
              ← Use a different email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page (Suspense wrapper required for useSearchParams) ────────────────────

export default function VerifyPage() {
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
      <VerifyInner />
    </Suspense>
  );
}
