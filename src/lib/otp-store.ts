// src/lib/otp-store.ts
// Shared in-memory OTP store for development.
// In production, replace with Redis (e.g. Upstash).

interface OTPRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Module-level singleton — shared across API routes in a single Node.js process.
const store = new Map<string, OTPRecord>();

export function setOTP(email: string, code: string) {
  store.set(email, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });
}

export function getOTP(email: string): OTPRecord | undefined {
  return store.get(email);
}

export function deleteOTP(email: string) {
  store.delete(email);
}

export function incrementAttempts(email: string) {
  const record = store.get(email);
  if (record) record.attempts++;
}
