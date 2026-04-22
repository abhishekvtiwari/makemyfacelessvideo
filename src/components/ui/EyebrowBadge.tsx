// src/components/ui/EyebrowBadge.tsx
export function EyebrowBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{ boxShadow: "var(--pill-shadow)" }}
      className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-3 py-1.5 text-[10px] font-medium tracking-wider text-zinc-500 uppercase backdrop-blur-md"
    >
      {children}
    </span>
  )
}
