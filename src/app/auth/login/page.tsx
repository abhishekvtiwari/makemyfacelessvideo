// src/app/auth/login/page.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Logo ────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF3B3B" />
            <stop offset="50%" stopColor="#C850C0" />
            <stop offset="100%" stopColor="#FFCC70" />
          </linearGradient>
        </defs>
        <circle cx="18" cy="18" r="17" stroke="url(#logo-grad)" strokeWidth="1.5" opacity="0.5" />
        <path d="M14 11.5L26 18L14 24.5V11.5Z" fill="url(#logo-grad)" />
        <circle cx="28" cy="8" r="2" fill="#FFCC70" opacity="0.9" />
      </svg>
      <span className="font-display text-2xl tracking-wider gradient-text">MMFV</span>
    </div>
  );
}

// ─── Google button ────────────────────────────────────────────────────────────

function GoogleButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#1a1a24] px-5 py-3.5 font-body text-sm font-semibold text-[#e8e8f0] transition-all duration-200 hover:border-[rgba(255,255,255,0.25)] hover:bg-[#222230] disabled:opacity-50"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
        <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
      </svg>
      {loading ? "Signing in…" : "Continue with Google"}
    </button>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-[rgba(255,255,255,0.07)]" />
      <span className="font-body text-xs text-[#6b6b80]">{label}</span>
      <div className="h-px flex-1 bg-[rgba(255,255,255,0.07)]" />
    </div>
  );
}

// ─── OTP input ───────────────────────────────────────────────────────────────

function OtpBoxes({
  value,
  onChange,
  hasError,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  hasError: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback(
    (i: number, raw: string) => {
      const char = raw.replace(/\D/g, "").slice(-1);
      const next = [...value];
      next[i] = char;
      onChange(next);
      if (char && i < 5) refs.current[i + 1]?.focus();
    },
    [value, onChange]
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
      digits.split("").forEach((c, i) => (next[i] = c));
      onChange(next);
      refs.current[Math.min(digits.length, 5)]?.focus();
    },
    [onChange]
  );

  return (
    <div className="flex justify-center gap-2.5">
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
          className={`h-14 w-11 rounded-xl border bg-[#1a1a24] text-center text-xl font-semibold text-[#e8e8f0] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(255,45,85,0.25)] ${
            hasError
              ? "border-[#ff453a] bg-[rgba(255,69,58,0.08)]"
              : "border-[rgba(255,255,255,0.1)] focus:border-[#ff2d55]"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Error message ────────────────────────────────────────────────────────────

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

// ─── Page ────────────────────────────────────────────────────────────────────

type Mode = "password" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function clearError() {
    if (error) setError("");
  }

  async function mockDelay() {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1500));
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    await mockDelay();
    // Mock: any credentials succeed
    router.push("/dashboard");
  }

  async function handleGoogleSignIn() {
    await mockDelay();
    router.push("/dashboard");
  }

  async function handleSendOtp() {
    if (!email) { setError("Enter your email first."); return; }
    await mockDelay();
    setLoading(false);
    setMode("otp");
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Enter all 6 digits."); return; }
    await mockDelay();
    if (code !== "123456") {
      setLoading(false);
      setError("Invalid code. (Hint: use 123456 for demo)");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-5 py-12">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(255,45,85,0.1) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Card */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-8 sm:p-10">

          {/* Logo */}
          <div className="mb-8">
            <Logo />
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl tracking-wider text-[#e8e8f0] mb-1">
            WELCOME BACK
          </h1>
          <p className="font-body text-sm text-[#6b6b80] mb-8">
            Sign in to continue creating
          </p>

          {/* Google */}
          <GoogleButton onClick={handleGoogleSignIn} loading={loading} />

          <div className="my-6">
            <Divider label="or continue with email" />
          </div>

          {/* ── Password mode ── */}
          {mode === "password" && (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-medium text-[#6b6b80] uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  placeholder="you@example.com"
                  className="input-dark w-full rounded-xl px-4 py-3 font-body text-sm"
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-body text-xs font-medium text-[#6b6b80] uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    className="font-body text-xs text-[#ff2d55] transition-colors hover:text-[#ff375f]"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    placeholder="••••••••"
                    className="input-dark w-full rounded-xl px-4 py-3 pr-11 font-body text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6b6b80] transition-colors hover:text-[#e8e8f0]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <path d="M3 3l14 14M8.5 8.577A2 2 0 0 0 11.415 11.5M6.5 6.5C4.5 7.8 3 10 3 10s2.5 4 7 4c1.4 0 2.6-.4 3.6-1M14 13c1.5-1.2 3-3 3-3s-2.5-4-7-4c-.7 0-1.3.1-1.9.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4C5.5 4 3 10 3 10s2.5 6 7 6 7-6 7-6-2.5-6-7-6z" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <ErrorBox message={error} />}

              <button
                type="submit"
                disabled={loading}
                className="btn-red-glow mt-1 w-full rounded-xl py-3.5 font-body text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Signing in…
                  </span>
                ) : "Sign In"}
              </button>

              {/* OTP option */}
              <div className="mt-1 flex items-center justify-center gap-2">
                <span className="font-body text-xs text-[#6b6b80]">Prefer a login code?</span>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="font-body text-xs font-semibold text-[#e8e8f0] underline-offset-2 transition-colors hover:text-[#ff2d55]"
                >
                  Send me a code instead
                </button>
              </div>
            </form>
          )}

          {/* ── OTP mode ── */}
          {mode === "otp" && (
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5">
              <p className="text-center font-body text-sm text-[#6b6b80]">
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold text-[#e8e8f0]">{email || "your email"}</span>
              </p>

              <OtpBoxes value={otp} onChange={setOtp} hasError={!!error} />

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
                ) : "Verify Code"}
              </button>

              <button
                type="button"
                onClick={() => { setMode("password"); setOtp(Array(6).fill("")); setError(""); }}
                className="text-center font-body text-xs text-[#6b6b80] transition-colors hover:text-[#e8e8f0]"
              >
                ← Back to password
              </button>
            </form>
          )}
        </div>

        {/* Sign up link */}
        <p className="mt-6 text-center font-body text-sm text-[#6b6b80]">
          Don&apos;t have an account?{" "}
          <Link
            href="/?signup=true"
            className="font-semibold text-[#e8e8f0] transition-colors hover:text-[#ff2d55]"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
