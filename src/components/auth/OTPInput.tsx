// src/components/auth/OTPInput.tsx
"use client";

import { useRef, useCallback } from "react";

interface OTPInputProps {
  value: string[];
  onChange: (v: string[]) => void;
  hasError: boolean;
  onComplete: (code: string) => void;
}

export default function OTPInput({ value, onChange, hasError, onComplete }: OTPInputProps) {
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
        } else if (next.every((d) => d !== "")) {
          onComplete(next.join(""));
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
      refs.current[Math.min(digits.length, 5)]?.focus();
      if (next.every((d) => d !== "")) onComplete(next.join(""));
    },
    [onChange, onComplete]
  );

  return (
    <div
      className={`flex justify-center gap-3 ${hasError ? "animate-[shake_0.35s_ease]" : ""}`}
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
          className={`h-14 rounded-xl border bg-[#1a1a24] text-center font-body text-xl font-semibold text-[#e8e8f0] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgba(255,45,85,0.25)] ${
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
