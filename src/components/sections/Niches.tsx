"use client"
// src/components/sections/Niches.tsx

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
    <div style={{ overflow: "hidden", width: "100%", padding: "6px 0" }}>
      <div
        className={direction === "left" ? "ticker-track-left" : "ticker-track-right"}
        style={{ display: "flex", gap: 10, width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              padding: "8px 18px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 500,
              whiteSpace: "nowrap",
              userSelect: "none",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
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
    <section className="section" style={{ background: "var(--bg)", overflow: "hidden" }}>
      <div className="section-inner" style={{ marginBottom: 48 }}>
        <p className="label" style={{ marginBottom: 20 }}>/ 03 · PRESET NICHES</p>
        <h2 style={{ maxWidth: "20ch" }}>
          <span style={{ display: "block" }}>Pick a niche.</span>
          <span style={{ display: "block" }}>We know the format.</span>
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <TickerRow items={ROW_ONE} direction="left" />
        <TickerRow items={ROW_TWO} direction="right" />
      </div>
    </section>
  )
}
