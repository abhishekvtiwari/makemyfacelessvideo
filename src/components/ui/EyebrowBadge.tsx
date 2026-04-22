// src/components/ui/EyebrowBadge.tsx
export function EyebrowBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1.5"
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <span className="eyebrow">{children}</span>
    </span>
  )
}
