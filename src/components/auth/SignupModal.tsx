// src/components/auth/SignupModal.tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Props ───────────────────────────────────────────────────────────────────

interface SignupModalProps {
  onClose: () => void;
}

// ─── Logo ────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
        <defs>
          <linearGradient id="modal-logo-grad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF3B3B" />
            <stop offset="50%" stopColor="#C850C0" />
            <stop offset="100%" stopColor="#FFCC70" />
          </linearGradient>
        </defs>
        <circle cx="18" cy="18" r="17" stroke="url(#modal-logo-grad)" strokeWidth="1.5" opacity="0.5" />
        <path d="M14 11.5L26 18L14 24.5V11.5Z" fill="url(#modal-logo-grad)" />
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
      {loading ? "Creating account…" : "Continue with Google"}
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

// ─── Password strength ────────────────────────────────────────────────────────

function getStrength(pw: string): 0 | 1 | 2 | 3 {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9!@#$%^&*]/.test(pw)) score++;
  return Math.min(score, 3) as 0 | 1 | 2 | 3;
}

function PasswordStrength({ password }: { password: string }) {
  const strength = getStrength(password);
  if (!password) return null;

  const labels = ["", "Weak", "Fair", "Strong"];
  const colors = ["", "bg-[#ff453a]", "bg-[#ff6b35]", "bg-[#30d158]"];
  const textColors = ["", "text-[#ff453a]", "text-[#ff6b35]", "text-[#30d158]"];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= strength ? colors[strength] : "bg-[rgba(255,255,255,0.08)]"
            }`}
          />
        ))}
      </div>
      <p className={`font-body text-xs ${textColors[strength]}`}>
        {labels[strength]}
      </p>
    </div>
  );
}

// ─── OTP boxes ───────────────────────────────────────────────────────────────

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
      digits.split("").forEach((c, idx) => (next[idx] = c));
      onChange(next);
      refs.current[Math.min(digits.length, 5)]?.focus();
    },
    [onChange]
  );

  return (
    <div className="flex justify-center gap-2">
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
          className={`h-13 w-10 rounded-xl border bg-[#1a1a24] text-center text-xl font-semibold text-[#e8e8f0] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(255,45,85,0.25)] ${
            hasError
              ? "border-[#ff453a] bg-[rgba(255,69,58,0.08)]"
              : "border-[rgba(255,255,255,0.1)] focus:border-[#ff2d55]"
          }`}
          style={{ height: "3.25rem" }}
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

// ─── Spinner ─────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

type SignupMode = "email-password" | "otp-entry" | "otp-verify";

export default function SignupModal({ onClose }: SignupModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<SignupMode>("email-password");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function clearError() {
    if (error) setError("");
  }

  async function mockDelay() {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1500));
  }

  async function handleGoogleSignup() {
    await mockDelay();
    onClose();
    router.push("/dashboard");
  }

  async function handleEmailPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    await mockDelay();
    onClose();
    router.push("/dashboard");
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otpEmail) { setError("Enter your email address."); return; }
    await mockDelay();
    setLoading(false);
    setMode("otp-verify");
  }

  async function handleOtpVerify(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Enter all 6 digits."); return; }
    await mockDelay();
    if (code !== "123456") {
      setLoading(false);
      setError("Invalid code. (Hint: use 123456 for demo)");
      return;
    }
    onClose();
    router.push("/dashboard");
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5 py-8"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal card */}
      <div className="relative w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-8 sm:p-10">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[#6b6b80] transition-all duration-200 hover:bg-[rgba(255,255,255,0.06)] hover:text-[#e8e8f0]"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Logo */}
        <div className="mb-7">
          <Logo />
        </div>

        {/* Headline */}
        <h2 className="font-display text-4xl tracking-wider text-[#e8e8f0] mb-1">
          CREATE YOUR ACCOUNT
        </h2>
        <p className="font-body text-sm text-[#6b6b80] mb-7">
          Start making faceless videos today
        </p>

        {/* ── Email + password mode ── */}
        {(mode === "email-password") && (
          <>
            <GoogleButton onClick={handleGoogleSignup} loading={loading} />
            <div className="my-6"><Divider label="or sign up with email" /></div>

            <form onSubmit={handleEmailPasswordSubmit} className="flex flex-col gap-4">
              {/* Full name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-medium text-[#6b6b80] uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearError(); }}
                  placeholder="Your name"
                  className="input-dark w-full rounded-xl px-4 py-3 font-body text-sm"
                  required
                />
              </div>

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
                <label className="font-body text-xs font-medium text-[#6b6b80] uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    placeholder="Min. 6 characters"
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
                <PasswordStrength password={password} />
              </div>

              {error && <ErrorBox message={error} />}

              <button
                type="submit"
                disabled={loading}
                className="btn-red-glow mt-1 w-full rounded-xl py-3.5 font-body text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner /> Creating account…
                  </span>
                ) : "Create Account"}
              </button>
            </form>

            {/* OTP option */}
            <div className="mt-4 text-center">
              <button
                onClick={() => { setMode("otp-entry"); setError(""); }}
                className="font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]"
              >
                Sign up with just your email →
              </button>
            </div>
          </>
        )}

        {/* ── OTP email entry ── */}
        {mode === "otp-entry" && (
          <>
            <div className="my-6"><Divider label="sign up with email code" /></div>
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-body text-xs font-medium text-[#6b6b80] uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={otpEmail}
                  onChange={(e) => { setOtpEmail(e.target.value); clearError(); }}
                  placeholder="you@example.com"
                  className="input-dark w-full rounded-xl px-4 py-3 font-body text-sm"
                  required
                  autoFocus
                />
              </div>

              {error && <ErrorBox message={error} />}

              <button
                type="submit"
                disabled={loading}
                className="btn-red-glow w-full rounded-xl py-3.5 font-body text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner /> Sending code…
                  </span>
                ) : "Send Code"}
              </button>

              <button
                type="button"
                onClick={() => { setMode("email-password"); setError(""); }}
                className="text-center font-body text-xs text-[#6b6b80] transition-colors hover:text-[#e8e8f0]"
              >
                ← Back to email & password
              </button>
            </form>
          </>
        )}

        {/* ── OTP verification ── */}
        {mode === "otp-verify" && (
          <form onSubmit={handleOtpVerify} className="flex flex-col gap-5">
            <p className="text-center font-body text-sm text-[#6b6b80]">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold text-[#e8e8f0]">{otpEmail}</span>
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
                  <Spinner /> Verifying…
                </span>
              ) : "Verify & Create Account"}
            </button>

            <button
              type="button"
              onClick={() => { setMode("otp-entry"); setOtp(Array(6).fill("")); setError(""); }}
              className="text-center font-body text-xs text-[#6b6b80] transition-colors hover:text-[#e8e8f0]"
            >
              ← Back
            </button>
          </form>
        )}

        {/* Bottom links */}
        <div className="mt-7 flex flex-col gap-2 text-center">
          <p className="font-body text-sm text-[#6b6b80]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              onClick={onClose}
              className="font-semibold text-[#e8e8f0] transition-colors hover:text-[#ff2d55]"
            >
              Sign in
            </Link>
          </p>
          <p className="font-body text-xs text-[#6b6b80]">
            By signing up you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 transition-colors hover:text-[#e8e8f0]">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline underline-offset-2 transition-colors hover:text-[#e8e8f0]">Privacy Policy</Link>
          </p>
        </div>

      </div>
    </div>
  );
}
