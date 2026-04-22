"use client"
// src/components/sections/Features.tsx

const FEATURES = [
  {
    num: "01",
    title: "Script Engine",
    desc: "Writes hook-led scripts tuned to your niche, tone, and duration. Paced for 30–600 seconds.",
    icon: "✍️",
  },
  {
    num: "02",
    title: "Voice Cast",
    desc: "Studio-grade AI voices. Hindi + English. Choose tone, speed, and emotion. Zero recording needed.",
    icon: "🎙️",
  },
  {
    num: "03",
    title: "Visual Engine",
    desc: "Cinematic stock footage sourced scene-by-scene from your script keywords. Auto-matched to pacing.",
    icon: "🎬",
  },
  {
    num: "04",
    title: "Auto Render",
    desc: "Assembled into a finished MP4 with captions. Download or publish in the same session.",
    icon: "⚡",
  },
]

export function Features() {
  return (
    <section id="features" className="section" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <p className="label" style={{ marginBottom: 20 }}>/ 02 · MODULES</p>
        <h2 style={{ marginBottom: 12, maxWidth: "20ch" }}>
          <span style={{ display: "block" }}>Four steps.</span>
          <span style={{ display: "block" }}>One prompt.</span>
        </h2>
        <p style={{ marginBottom: 56, maxWidth: "48ch", color: "var(--text-secondary)" }}>
          Every faceless video needs a hook, a voice, a visual loop, and a pace. We handle all four simultaneously.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.num}
              className="card"
              style={{ padding: 28 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "var(--ig)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <span className="label">MODULE {f.num}</span>
              </div>
              <h3 style={{ marginBottom: 8, fontSize: 17 }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-secondary)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
