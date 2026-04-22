"use client"
// src/app/auth/signup/page.tsx
import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getGoogleOAuthUrl } from "@/lib/auth"

// ── Shared sub-components ────────────────────────────────────────────────────

function GoogleButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
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
        background: "white",
        border: "1.5px solid var(--border)",
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 600,
        color: "var(--text-primary)",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)"
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"
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
            border: "1.5px solid var(--border)",
            borderRadius: 12,
            background: "white",
            color: "var(--text-primary)",
            outline: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            transition: "border-color 0.15s",
            cursor: disabled ? "not-allowed" : "text",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#dd2a7b" }}
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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)

  // Auto-submit when all 6 OTP digits filled
  useEffect(() => {
    if (step === "otp" && otp.every((d) => d !== "") && !loading) {
      handleVerify()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp])

  // Resend cooldown countdown
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!firstName.trim()) { setError("Enter your first name."); return }
    if (!email) { setError("Enter your email address."); return }
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
        body: JSON.stringify({ email, code, isSignup: true, name: `${firstName.trim()} ${lastName.trim()}`.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.redirect === "/auth/login") {
          setError("Account already exists. Redirecting to sign in…")
          setTimeout(() => router.push("/auth/login"), 1800)
          return
        }
        setError(data.error ?? "Invalid code.")
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
    setLoading(true)
    window.location.href = getGoogleOAuthUrl()
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="card-surface" style={{ padding: 48 }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                background: "var(--ig-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              MMFV
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: 1 }}>
              MakeMyFacelessVideo
            </p>
          </div>

          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 4,
              textAlign: "center",
              letterSpacing: "-0.5px",
            }}
          >
            Create your account
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", textAlign: "center", marginBottom: 28 }}>
            Start creating faceless videos today
          </p>

          {step === "email" && (
            <>
              <GoogleButton onClick={handleGoogleClick} loading={loading} />
              <Divider />

              <form onSubmit={handleSendCode} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Name row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                      First name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); setError("") }}
                      placeholder="Alex"
                      required
                      style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--border)", borderRadius: 12, fontSize: 14, color: "var(--text-primary)", background: "white", outline: "none", transition: "border-color 0.15s" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "#dd2a7b" }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
                      Last name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Smith"
                      style={{ width: "100%", padding: "12px 14px", border: "1.5px solid var(--border)", borderRadius: 12, fontSize: 14, color: "var(--text-primary)", background: "white", outline: "none", transition: "border-color 0.15s" }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "#dd2a7b" }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError("") }}
                    placeholder="you@example.com"
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "1.5px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 14,
                      color: "var(--text-primary)",
                      background: "white",
                      outline: "none",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "#dd2a7b" }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
                  />
                </div>

                {error && (
                  <p style={{ fontSize: 13, color: "#ef4444", padding: "10px 14px", background: "rgba(239,68,68,0.06)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "13px 20px",
                    borderRadius: 12,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading && <Spinner />}
                  {loading ? "Sending…" : "Send Code"}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-secondary)" }}>
                We sent a code to{" "}
                <strong style={{ color: "var(--text-primary)" }}>{email}</strong>
              </p>

              <OtpBoxes value={otp} onChange={setOtp} disabled={loading} />

              {error && (
                <p style={{ fontSize: 13, color: "#ef4444", padding: "10px 14px", background: "rgba(239,68,68,0.06)", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", textAlign: "center" }}>
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleVerify}
                disabled={loading || otp.some((d) => !d)}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: 12,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading && <Spinner />}
                {loading ? "Verifying…" : "Verify & Create Account"}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                  type="button"
                  onClick={() => { setStep("email"); setOtp(Array(6).fill("")); setError("") }}
                  style={{ fontSize: 13, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                >
                  ← Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  style={{
                    fontSize: 13,
                    color: resendCooldown > 0 ? "var(--text-muted)" : "#dd2a7b",
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
          <Link href="/auth/login" style={{ color: "var(--text-primary)", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
