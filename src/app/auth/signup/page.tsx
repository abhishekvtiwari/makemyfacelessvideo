"use client"
// src/app/auth/signup/page.tsx
import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getGoogleOAuthUrl } from "@/lib/auth"

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "1px solid var(--border)",
  borderRadius: 10,
  fontSize: 14,
  color: "var(--text)",
  background: "var(--bg-input)",
  outline: "none",
  transition: "border-color 0.15s",
}

function validatePassword(pw: string): string {
  if (pw.length < 8) return "At least 8 characters."
  if (!/[A-Z]/.test(pw)) return "At least 1 uppercase letter."
  if (!/[a-z]/.test(pw)) return "At least 1 lowercase letter."
  if (!/[0-9]/.test(pw)) return "At least 1 number."
  if (!/[^A-Za-z0-9]/.test(pw)) return "At least 1 special character."
  return ""
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ]
  const score = checks.filter(Boolean).length
  const color = score <= 2 ? "var(--red)" : score <= 3 ? "#f59e0b" : "var(--green)"
  const label = score <= 2 ? "Weak" : score <= 3 ? "Fair" : score === 4 ? "Good" : "Strong"
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i <= score ? color : "var(--border)",
              transition: "background 0.2s",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 11, color }}>{label}</span>
    </div>
  )
}

function GoogleButton({ onClick, loading, error }: { onClick: () => void; loading: boolean; error: string }) {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "12px 20px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 500,
          color: "var(--text)",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
          transition: "border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.borderColor = "var(--border-hover)"
            e.currentTarget.style.background = "rgba(255,255,255,0.09)"
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)"
          e.currentTarget.style.background = "rgba(255,255,255,0.06)"
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C18.622 14.042 17.64 11.734 17.64 9.2z" fill="#4285F4" />
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
          <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05" />
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
        {loading ? "Redirecting…" : "Continue with Google"}
      </button>
      {error && (
        <p style={{ fontSize: 12, color: "var(--red)", marginTop: 8, textAlign: "center" }}>{error}</p>
      )}
    </div>
  )
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or</span>
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  )
}

function OtpBoxes({
  value,
  onChange,
  disabled,
}: {
  value: string[]
  onChange: (v: string[]) => void
  disabled: boolean
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = useCallback(
    (i: number, raw: string) => {
      const char = raw.replace(/\D/g, "").slice(-1)
      const next = [...value]
      next[i] = char
      onChange(next)
      if (char && i < 5) refs.current[i + 1]?.focus()
    },
    [value, onChange]
  )

  const handleKeyDown = useCallback(
    (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus()
    },
    [value]
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault()
      const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
      const next = Array(6).fill("")
      digits.split("").forEach((c, i) => { next[i] = c })
      onChange(next)
      refs.current[Math.min(digits.length, 5)]?.focus()
    },
    [onChange]
  )

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 48,
            height: 56,
            textAlign: "center",
            fontSize: 22,
            fontWeight: 700,
            border: "1px solid var(--border)",
            borderRadius: 10,
            background: "var(--bg-input)",
            color: "var(--text)",
            outline: "none",
            transition: "border-color 0.15s",
            cursor: disabled ? "not-allowed" : "text",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-pink)" }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
        />
      ))}
    </div>
  )
}

function Spinner() {
  return (
    <svg
      style={{ width: 16, height: 16, animation: "spin 0.8s linear infinite", display: "inline-block" }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function LabeledInput({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        style={INPUT_STYLE}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-pink)" }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
      />
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<"info" | "otp">("info")

  // Info step fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // OTP step
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))

  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [googleError, setGoogleError] = useState(() => {
    const e = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("error") : null
    if (e === "google_cancelled") return "Google sign-in was cancelled."
    if (e === "google_failed") return "Google sign-in failed. Please try again."
    return ""
  })
  const [error, setError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)
  const googleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (step === "otp" && otp.every((d) => d !== "") && !loading) {
      handleVerify()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  useEffect(() => {
    return () => {
      if (googleTimerRef.current) clearTimeout(googleTimerRef.current)
    }
  }, [])

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!firstName.trim()) { setError("First name is required."); return }
    if (!lastName.trim()) { setError("Last name is required."); return }
    if (!email.trim()) { setError("Email address is required."); return }

    const pwError = validatePassword(password)
    if (pwError) { setError(pwError); return }
    if (password !== confirmPassword) { setError("Passwords do not match."); return }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed to send code."); return }
      setStep("otp")
      setResendCooldown(30)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify() {
    setError("")
    const code = otp.join("")
    if (code.length < 6) { setError("Enter all 6 digits."); return }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          isSignup: true,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.redirect === "/auth/login") {
          setError("Account already exists. Redirecting to sign in…")
          setTimeout(() => router.push("/auth/login"), 1800)
          return
        }
        setError(data.detail ? `${data.error} (${data.detail})` : (data.error ?? "Invalid code."))
        setOtp(Array(6).fill(""))
        return
      }
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (resendCooldown > 0) return
    setError("")
    setOtp(Array(6).fill(""))
    setLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Failed to resend."); return }
      setResendCooldown(30)
    } finally {
      setLoading(false)
    }
  }

  function handleGoogleClick() {
    setGoogleError("")
    setGoogleLoading(true)
    googleTimerRef.current = setTimeout(() => {
      setGoogleLoading(false)
      setGoogleError("Something went wrong. Please try again.")
    }, 10000)
    window.location.href = getGoogleOAuthUrl()
  }

  const cardStyle: React.CSSProperties = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: 40,
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={cardStyle}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="ig-text" style={{ fontSize: 36, fontWeight: 800, lineHeight: 1, marginBottom: 4 }}>
              MMFV
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: 1 }}>
              MakeMyFacelessVideo
            </p>
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginBottom: 4, textAlign: "center", letterSpacing: "-0.5px" }}>
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center", marginBottom: 28 }}>
            Start creating faceless videos today
          </p>

          {step === "info" && (
            <>
              <GoogleButton onClick={handleGoogleClick} loading={googleLoading} error={googleError} />
              <Divider />

              <form onSubmit={handleSendCode} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <LabeledInput
                      label="First name"
                      type="text"
                      value={firstName}
                      onChange={(v) => { setFirstName(v); setError("") }}
                      placeholder="John"
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <LabeledInput
                      label="Last name"
                      type="text"
                      value={lastName}
                      onChange={(v) => { setLastName(v); setError("") }}
                      placeholder="Doe"
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <LabeledInput
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(v) => { setEmail(v); setError("") }}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />

                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError("") }}
                      placeholder="Min 8 chars, 1 upper, 1 number, 1 special"
                      required
                      autoComplete="new-password"
                      style={{ ...INPUT_STYLE, paddingRight: 44 }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-pink)" }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, lineHeight: 1 }}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </div>

                <LabeledInput
                  label="Confirm password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(v) => { setConfirmPassword(v); setError("") }}
                  placeholder="Re-enter password"
                  required
                  autoComplete="new-password"
                />
                {confirmPassword && confirmPassword !== password && (
                  <p style={{ fontSize: 12, color: "var(--red)", marginTop: -8 }}>Passwords do not match.</p>
                )}

                {error && (
                  <p style={{ fontSize: 13, color: "var(--red)", padding: "10px 14px", background: "rgba(239,68,68,0.08)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: "100%", padding: "13px 20px", gap: 8, marginTop: 4 }}
                >
                  {loading && <Spinner />}
                  {loading ? "Sending…" : "Send Verification Code"}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-secondary)" }}>
                We sent a 6-digit code to{" "}
                <strong style={{ color: "var(--text)" }}>{email}</strong>
              </p>

              <OtpBoxes value={otp} onChange={setOtp} disabled={loading} />

              {error && (
                <p style={{ fontSize: 13, color: "var(--red)", padding: "10px 14px", background: "rgba(239,68,68,0.08)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", textAlign: "center" }}>
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleVerify}
                disabled={loading || otp.some((d) => !d)}
                className="btn-primary"
                style={{ width: "100%", padding: "13px 20px", gap: 8 }}
              >
                {loading && <Spinner />}
                {loading ? "Creating account…" : "Verify & Create Account"}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                  type="button"
                  onClick={() => { setStep("info"); setOtp(Array(6).fill("")); setError("") }}
                  style={{ fontSize: 13, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  style={{
                    fontSize: 13,
                    color: resendCooldown > 0 ? "var(--text-muted)" : "var(--accent-pink)",
                    background: "none",
                    border: "none",
                    cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                    padding: 0,
                    fontWeight: 500,
                  }}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)", marginTop: 20 }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--text)", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
