"use client"
// src/components/sections/Niches.tsx
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection"
import { EyebrowBadge } from "@/components/ui/EyebrowBadge"

const ROW_ONE = [
  "Motivational", "Mind-Blowing Facts", "Story Time", "Finance",
  "True Crime", "History", "Tech Explained", "News Recap",
  "Life Hacks", "Psychology",
]

const ROW_TWO = [
  "Top 10 Lists", "Book Summaries", "Science Facts", "Business Tips",
  "Productivity", "Health", "Investing", "World Records",
  "Mysteries", "Philosophy",
]

function TickerRow({ items, direction }: { items: string[]; direction: "left" | "right" }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden w-full py-1.5">
      <div
        className={direction === "left" ? "ticker-track-left" : "ticker-track-right"}
        style={{ display: "flex", gap: 10, width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap select-none transition-colors duration-200"
            style={{
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Niches() {
  return (
    <section className="section overflow-hidden relative" style={{ background: "var(--bg-secondary)" }}>
      {/* Subtle top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "var(--ig-gradient)", opacity: 0.25 }}
      />

      <div className="section-inner mb-12">
        <AnimatedSection>
          <AnimatedItem>
            <EyebrowBadge>/ 03 · PRESET NICHES</EyebrowBadge>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="mt-5 max-w-[20ch]">
              <span className="block">Pick a niche.</span>
              <span className="block">We know the format.</span>
            </h2>
          </AnimatedItem>
        </AnimatedSection>
      </div>

      <div className="flex flex-col gap-3 w-full overflow-hidden">
        <TickerRow items={ROW_ONE} direction="left" />
        <TickerRow items={ROW_TWO} direction="right" />
      </div>
    </section>
  )
}
