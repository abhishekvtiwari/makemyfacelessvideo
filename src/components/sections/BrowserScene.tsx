"use client"
// src/components/sections/BrowserScene.tsx
import { motion, MotionValue, useTransform } from "framer-motion"

const FEED_ITEMS = [
  {
    phase: "input",
    label: "YOUR TOPIC",
    content: "How AI is changing the future of work in 2025",
    color: "#1a1a2e",
    bg: "#f8f7ff",
    border: "rgba(81,91,212,0.2)",
  },
  {
    phase: "script",
    label: "✦ SCRIPT GENERATED",
    content:
      "Hook: Did you know AI replaced 800K jobs last year — but created 2.3M new ones? Here's what no one tells you...",
    color: "#8134af",
    bg: "#fdf4ff",
    border: "rgba(129,52,175,0.2)",
  },
  {
    phase: "voice",
    label: "🎙 VOICE CAST",
    content:
      "Studio Voice · English · Neutral · 1.0× Speed · ElevenLabs HD",
    color: "#dd2a7b",
    bg: "#fff5f9",
    border: "rgba(221,42,123,0.2)",
  },
  {
    phase: "visuals",
    label: "🎬 VISUALS SOURCED",
    content:
      "Scene 1: Office time-lapse · Scene 2: Robot assembly · Scene 3: Developer at laptop · Scene 4: Data center",
    color: "#f58529",
    bg: "#fff9f0",
    border: "rgba(245,133,41,0.2)",
  },
  {
    phase: "render",
    label: "⚡ RENDERING",
    content:
      "1080p · 3:42 duration · YouTube 16:9 · Auto-captions included · MP4 ready",
    color: "#515bd4",
    bg: "#f0f2ff",
    border: "rgba(81,91,212,0.2)",
  },
]

const DOT_LABELS = ["Idea", "Script", "Voice", "Video", "Done"]

// Extracted as a named component so hooks are always called at component top level
function ProgressDot({
  progress,
  index,
  label,
}: {
  progress: MotionValue<number>
  index: number
  label: string
}) {
  const dotProgress = useTransform(
    progress,
    [index * 0.2, index * 0.2 + 0.15],
    [0, 1]
  )
  const bgColor = useTransform(
    dotProgress,
    [0, 1],
    ["rgba(0,0,0,0.15)", "#dd2a7b"]
  )
  const scale = useTransform(dotProgress, [0, 1], [1, 1.3])

  return (
    <motion.div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <motion.div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: bgColor,
          scale,
        }}
      />
      <motion.span
        style={{
          fontSize: 9,
          fontFamily: "monospace",
          letterSpacing: 1,
          textTransform: "uppercase" as const,
          opacity: dotProgress,
          color: "#dd2a7b",
          whiteSpace: "nowrap" as const,
        }}
      >
        {label}
      </motion.span>
    </motion.div>
  )
}

export function BrowserScene({ progress }: { progress: MotionValue<number> }) {
  // All transforms defined at component top level
  const browserX = useTransform(progress, [0, 0.15], [200, 0])
  const browserOpacity = useTransform(progress, [0.05, 0.2], [0, 1])
  const browserRotateY = useTransform(
    progress,
    [0.05, 0.2, 0.6, 0.8],
    [-20, -10, -10, 0]
  )
  const browserRotateX = useTransform(
    progress,
    [0.05, 0.2, 0.6, 0.8],
    [10, 5, 5, 0]
  )
  const browserScale = useTransform(
    progress,
    [0.05, 0.2, 0.6, 0.8, 1],
    [0.85, 1, 1, 0.9, 0.85]
  )
  const feedY = useTransform(progress, [0.2, 0.65], ["0px", "-280px"])

  const videoZ = useTransform(progress, [0.65, 0.82, 0.95], [0, 80, 180])
  const videoScale = useTransform(progress, [0.65, 0.82, 0.95], [0.5, 0.9, 1.1])
  const videoOpacity = useTransform(progress, [0.65, 0.72], [0, 1])
  const videoRotateX = useTransform(
    progress,
    [0.65, 0.82, 0.95],
    [30, 8, -4]
  )
  // Matching structure for smooth interpolation
  const videoShadow = useTransform(
    progress,
    [0.65, 0.85],
    [
      "0 10px 30px rgba(0,0,0,0.15), 0 0px 0px rgba(221,42,123,0.00)",
      "0 40px 80px rgba(0,0,0,0.20), 0 20px 40px rgba(221,42,123,0.30)",
    ]
  )
  const screenGlow = useTransform(progress, [0.6, 0.7, 0.8], [0, 1, 0])

  return (
    <div
      style={{
        position: "absolute",
        right: "clamp(-40px, 2vw, 40px)",
        top: "50%",
        transform: "translateY(-50%)",
        perspective: 1200,
        perspectiveOrigin: "40% 50%",
        zIndex: 5,
        width: 680,
        height: 500,
      }}
    >
      {/* 3D BROWSER */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          translateX: browserX,
          opacity: browserOpacity,
          rotateY: browserRotateY,
          rotateX: browserRotateX,
          scale: browserScale,
          transformStyle: "preserve-3d",
        }}
      >
        {/* BROWSER CONTAINER — clay style */}
        <div
          style={{
            width: 620,
            height: 400,
            background: "#ffffff",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "var(--shadow-float)",
            border: "1px solid rgba(0,0,0,0.06)",
            position: "relative",
          }}
        >
          {/* BROWSER CHROME */}
          <div
            style={{
              height: 40,
              background: "#f5f4f2",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: c,
                  }}
                />
              ))}
            </div>
            <div
              style={{ flex: 1, display: "flex", justifyContent: "center" }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: 20,
                  padding: "5px 20px",
                  fontSize: 11,
                  color: "#888",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  fontFamily: "monospace",
                  letterSpacing: 0.5,
                }}
              >
                makemyfacelessvideo.com/create
              </div>
            </div>
          </div>

          {/* BROWSER CONTENT — scrolling feed */}
          <div
            style={{
              height: "calc(100% - 40px)",
              overflow: "hidden",
              padding: "20px 24px",
              position: "relative",
            }}
          >
            <motion.div style={{ y: feedY }}>
              {FEED_ITEMS.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: item.bg,
                    borderRadius: 14,
                    padding: "14px 16px",
                    marginBottom: 12,
                    border: `1px solid ${item.border}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: 9,
                      fontFamily: "monospace",
                      fontWeight: 700,
                      color: item.color,
                      letterSpacing: 1.5,
                      marginBottom: 6,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#1a1a2e",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.content}
                  </p>
                  {item.phase === "render" && (
                    <div
                      style={{
                        marginTop: 10,
                        background: "rgba(0,0,0,0.06)",
                        borderRadius: 20,
                        height: 4,
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 20,
                          background:
                            "linear-gradient(90deg, #f58529, #dd2a7b, #8134af, #515bd4)",
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* SCREEN GLOW when video breaks out */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(245,133,41,0.15), rgba(221,42,123,0.2), rgba(129,52,175,0.15))",
              opacity: screenGlow,
              pointerEvents: "none",
              borderRadius: 20,
            }}
          />
        </div>

        {/* CLAY FLOATING ICONS — CSS animation, not Framer Motion */}
        <div
          className="float-1"
          style={{
            position: "absolute",
            top: -30,
            right: -20,
            width: 64,
            height: 64,
            background: "linear-gradient(135deg, #f58529, #dd2a7b)",
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 12px 32px rgba(221,42,123,0.4), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
            fontSize: 24,
          }}
        >
          🎬
        </div>

        <div
          className="float-2"
          style={{
            position: "absolute",
            bottom: -24,
            left: -28,
            width: 56,
            height: 56,
            background: "linear-gradient(135deg, #8134af, #515bd4)",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 12px 32px rgba(129,52,175,0.4), 0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)",
            fontSize: 22,
          }}
        >
          ✦
        </div>

        <div
          className="float-3"
          style={{
            position: "absolute",
            top: "40%",
            right: -44,
            width: 48,
            height: 48,
            background: "linear-gradient(135deg, #dd2a7b, #8134af)",
            borderRadius: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 8px 24px rgba(221,42,123,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
            fontSize: 20,
          }}
        >
          🎙
        </div>
      </motion.div>

      {/* VIDEO CARD — breaks out of browser */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
          scale: videoScale,
          opacity: videoOpacity,
          rotateX: videoRotateX,
          z: videoZ,
          zIndex: 20,
          transformStyle: "preserve-3d",
          boxShadow: videoShadow,
          borderRadius: 20,
        }}
      >
        <div
          style={{
            width: 160,
            height: 284,
            borderRadius: 20,
            overflow: "hidden",
            background:
              "linear-gradient(160deg, #1a0a2e 0%, #2d1060 40%, #1a0530 100%)",
            position: "relative",
            border: "2px solid rgba(255,255,255,0.15)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(160deg, rgba(245,133,41,0.4) 0%, rgba(221,42,123,0.3) 40%, rgba(81,91,212,0.4) 100%)",
            }}
          />

          {/* Play button */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 44,
              height: 44,
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(255,255,255,0.3)",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "16px solid white",
                borderTop: "11px solid transparent",
                borderBottom: "11px solid transparent",
                marginLeft: 3,
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              right: 14,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: "rgba(255,255,255,0.6)",
                fontFamily: "monospace",
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              MMFV
            </div>
            <div
              style={{
                fontSize: 9,
                color: "white",
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              How AI is Changing Work
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "12px 14px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 8,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "monospace",
                }}
              >
                0:47
              </span>
              <span
                style={{
                  fontSize: 8,
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "monospace",
                }}
              >
                3:42
              </span>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: 20,
                height: 3,
              }}
            >
              <div
                style={{
                  width: "20%",
                  height: "100%",
                  borderRadius: 20,
                  background: "linear-gradient(90deg, #f58529, #dd2a7b)",
                }}
              />
            </div>
          </div>

          {/* READY badge */}
          <div
            style={{
              position: "absolute",
              top: -12,
              right: -8,
              background: "linear-gradient(135deg, #28c840, #20a835)",
              borderRadius: 20,
              padding: "4px 10px",
              fontSize: 8,
              color: "white",
              fontWeight: 700,
              fontFamily: "monospace",
              boxShadow: "0 4px 12px rgba(40,200,64,0.4)",
            }}
          >
            ✓ READY
          </div>
        </div>
      </motion.div>

      {/* SIDE PROGRESS DOTS — rendered via component to satisfy Rules of Hooks */}
      <div
        style={{
          position: "fixed",
          right: 28,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 50,
        }}
      >
        {DOT_LABELS.map((label, i) => (
          <ProgressDot key={label} progress={progress} index={i} label={label} />
        ))}
      </div>
    </div>
  )
}
