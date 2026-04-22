// src/components/ui/EyebrowBadge.tsx
export function EyebrowBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1.5"
      style={{
        background: "rgba(255,255,255,0.8)",
        border: "1px solid rgba(0,0,0,0.06)",
        backdropFilter: "blur(8px)",
      }}
    >
      <span className="eyebrow">{children}</span>
    </span>
  )
}
