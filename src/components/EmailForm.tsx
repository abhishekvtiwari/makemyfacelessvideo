// components/EmailForm.tsx
"use client";

import { useState } from "react";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Mock submission — no real API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[rgba(48,209,88,0.3)] bg-[rgba(48,209,88,0.08)] px-6 py-4 text-[#30d158] font-body">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10l4.5 4.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        You&apos;re on the list! We&apos;ll email you when we launch.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="input-dark flex-1 rounded-xl px-5 py-3.5 text-base font-body"
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-red-glow rounded-xl px-7 py-3.5 text-base font-semibold font-body whitespace-nowrap disabled:opacity-60"
      >
        {loading ? "Joining..." : "Get Early Access"}
      </button>
    </form>
  );
}
