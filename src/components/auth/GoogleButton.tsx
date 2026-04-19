// src/components/auth/GoogleButton.tsx
"use client";

interface GoogleButtonProps {
  loading?: boolean;
  onClick: () => void;
}

export default function GoogleButton({ loading, onClick }: GoogleButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#1a1a24] px-5 py-3.5 font-body text-sm font-medium text-[#e8e8f0] transition-all duration-200 hover:border-[rgba(255,255,255,0.25)] hover:bg-[#222230] disabled:opacity-60"
    >
      {loading ? (
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.23c1.89-1.74 2.98-4.3 2.98-7.31Z" fill="#4285F4" />
          <path d="M10 20c2.7 0 4.97-.9 6.62-2.43l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H1.08v2.58A9.99 9.99 0 0 0 10 20Z" fill="#34A853" />
          <path d="M4.41 11.91A5.98 5.98 0 0 1 4.1 10c0-.66.12-1.3.31-1.91V5.51H1.08A10 10 0 0 0 0 10c0 1.61.38 3.14 1.08 4.49l3.33-2.58Z" fill="#FBBC05" />
          <path d="M10 3.97c1.47 0 2.79.5 3.83 1.5l2.86-2.86C14.96.9 12.69 0 10 0A9.99 9.99 0 0 0 1.08 5.51l3.33 2.58C5.2 5.73 7.4 3.97 10 3.97Z" fill="#EA4335" />
        </svg>
      )}
      {loading ? "Connecting…" : "Continue with Google"}
    </button>
  );
}
