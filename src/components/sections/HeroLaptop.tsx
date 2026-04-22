"use client"
// src/components/sections/HeroLaptop.tsx
import { useEffect, useRef, useState, useCallback } from "react"

type Phase = "typing" | "generating" | "rotating" | "result" | "resetting"

const FULL_TEXT = "How AI is changing the future of work in 2025"
const STAGES = ["Script", "Voice", "Visuals", "Render"]

export function HeroLaptop() {
  const [phase, setPhase] = useState<Phase>("typing")
  const [typeText, setTypeText] = useState("")
  const [progress, setProgress] = useState(0)
  const [stageIndex, setStageIndex] = useState(-1)
  const [rotY, setRotY] = useState(-25)
  const [rotX, setRotX] = useState(20)
  const [showResult, setShowResult] = useState(false)
  const mountedRef = useRef(true)

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      const id = setTimeout(resolve, ms)
      return () => clearTimeout(id)
    })

  const runLoop = useCallback(async () => {
    while (mountedRef.current) {
      // PHASE 1: TYPING
      setPhase("typing")
      setTypeText("")
      setProgress(0)
      setStageIndex(-1)
      setShowResult(false)
      setRotY(-25)
      setRotX(20)

      for (let i = 0; i <= FULL_TEXT.length; i++) {
        if (!mountedRef.current) return
        setTypeText(FULL_TEXT.slice(0, i))
        await sleep(42)
      }
      await sleep(500)

      // PHASE 2: GENERATING
      setPhase("generating")
      for (let i = 0; i <= 100; i++) {
        if (!mountedRef.current) return
        setProgress(i)
        setStageIndex(Math.floor(i / 26))
        await sleep(18)
      }
      await sleep(300)

      // PHASE 3: ROTATING
      setPhase("rotating")
      setRotY(0)
      setRotX(-3)
      await sleep(1600)

      // PHASE 4: RESULT
      setPhase("result")
      setShowResult(true)
      await sleep(3000)

      // PHASE 5: RESET
      setPhase("resetting")
      setShowResult(false)
      await sleep(400)
      setRotY(-25)
      setRotX(20)
      await sleep(800)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    runLoop()
    return () => {
      mountedRef.current = false
    }
  }, [runLoop])

  const isRotating = phase === "rotating" || phase === "resetting"

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/* LAPTOP WRAPPER */}
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: isRotating
            ? "transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)"
            : "none",
          position: "relative",
          width: 520,
        }}
      >
        {/* SCREEN LID */}
        <div
          style={{
            width: 520,
            height: 330,
            background: "#111",
            borderRadius: "14px 14px 0 0",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "none",
            boxShadow:
              phase === "result"
                ? "0 0 0 1px rgba(221,42,123,0.4), 0 0 60px rgba(221,42,123,0.2), 0 0 120px rgba(129,52,175,0.15), 0 20px 60px rgba(0,0,0,0.8)"
                : "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
            transition: "box-shadow 0.8s ease",
          }}
        >
          {/* SCREEN BEZEL */}
          <div
            style={{
              position: "absolute",
              inset: 10,
              background: "#000",
              borderRadius: 8,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* BROWSER CHROME BAR */}
            <div
              style={{
                height: 30,
                background: "#0a0a0a",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", gap: 5 }}>
                {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 9,
                      height: 9,
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
                    background: "#1a1a1a",
                    borderRadius: 20,
                    padding: "3px 18px",
                    fontSize: 9,
                    color: "#555",
                    letterSpacing: "0.5px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  makemyfacelessvideo.com
                </div>
              </div>
            </div>

            {/* BROWSER CONTENT */}
            <div
              style={{
                flex: 1,
                background: "#0d0d0d",
                padding: "14px 16px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* TYPING + GENERATING PHASES */}
              {(phase === "typing" || phase === "generating") && (
                <div>
                  <p
                    style={{
                      fontSize: 8,
                      color: "#555",
                      fontFamily: "monospace",
                      letterSpacing: 2,
                      marginBottom: 8,
                      textTransform: "uppercase",
                    }}
                  >
                    Create Video
                  </p>

                  {/* TEXTAREA */}
                  <div
                    style={{
                      background: "#141414",
                      borderRadius: 8,
                      padding: "8px 10px",
                      marginBottom: 10,
                      minHeight: 50,
                      border: "1px solid rgba(221,42,123,0.25)",
                      boxShadow: "0 0 12px rgba(221,42,123,0.08)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 9,
                        color: "#e0e0e0",
                        lineHeight: 1.6,
                      }}
                    >
                      {typeText}
                      <span
                        style={{
                          display: "inline-block",
                          width: 1,
                          height: 11,
                          background:
                            "linear-gradient(to bottom, #f58529, #dd2a7b)",
                          marginLeft: 1,
                          verticalAlign: "middle",
                          animation: "blink 1s step-end infinite",
                        }}
                      />
                    </p>
                  </div>

                  {/* OPTION PILLS */}
                  <div
                    style={{
                      display: "flex",
                      gap: 5,
                      marginBottom: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    {["YouTube", "Educational", "English"].map((tag, i) => (
                      <div
                        key={tag}
                        style={{
                          background: "#1a1a1a",
                          color: "#a0a0a0",
                          borderRadius: 20,
                          padding: "3px 9px",
                          fontSize: 8,
                          fontWeight: 600,
                          border: "1px solid rgba(255,255,255,0.1)",
                          opacity: typeText.length > i * 12 ? 1 : 0,
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>

                  {/* GENERATE BUTTON */}
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)",
                      borderRadius: 8,
                      padding: "6px 12px",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "white",
                      textAlign: "center",
                      marginBottom: 10,
                      cursor: "pointer",
                      transform:
                        phase === "generating" && progress < 5
                          ? "scale(0.97)"
                          : "scale(1)",
                      transition: "transform 0.15s ease",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Generate Video →
                  </div>

                  {/* PROGRESS BAR */}
                  {phase === "generating" && (
                    <div>
                      <div
                        style={{
                          background: "#1a1a1a",
                          borderRadius: 20,
                          height: 4,
                          overflow: "hidden",
                          marginBottom: 6,
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <div
                          style={{
                            background:
                              "linear-gradient(90deg, #f58529, #dd2a7b, #8134af, #515bd4)",
                            height: "100%",
                            width: `${progress}%`,
                            borderRadius: 20,
                            transition: "width 0.05s linear",
                          }}
                        />
                      </div>

                      {/* STAGE LABELS */}
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          justifyContent: "space-between",
                        }}
                      >
                        {STAGES.map((stage, i) => (
                          <div
                            key={stage}
                            style={{
                              fontSize: 7,
                              fontFamily: "monospace",
                              color: stageIndex >= i ? "#dd2a7b" : "#444",
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              transition: "color 0.3s ease",
                            }}
                          >
                            <span>
                              {stageIndex > i
                                ? "✓"
                                : stageIndex === i
                                  ? "▸"
                                  : "·"}
                            </span>
                            {stage}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ROTATING PHASE — LOADING SCREEN */}
              {phase === "rotating" && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#000",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      border: "2px solid #1a1a1a",
                      borderTop: "2px solid #dd2a7b",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                  <p
                    style={{
                      fontSize: 8,
                      color: "#555",
                      fontFamily: "monospace",
                      letterSpacing: 2,
                    }}
                  >
                    RENDERING
                  </p>
                </div>
              )}

              {/* RESULT PHASE */}
              {(phase === "result" || showResult) && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#050505",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 20px",
                  }}
                >
                  {/* 9:16 VIDEO CARD */}
                  <div
                    style={{
                      width: 88,
                      height: 156,
                      background:
                        "linear-gradient(135deg, #1a0a2e, #2d1b4e)",
                      borderRadius: 10,
                      flexShrink: 0,
                      position: "relative",
                      overflow: "hidden",
                      border: "1px solid rgba(221,42,123,0.3)",
                      boxShadow: "0 0 30px rgba(221,42,123,0.2)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, rgba(245,133,41,0.3), rgba(221,42,123,0.3), rgba(129,52,175,0.3))",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 28,
                        height: 28,
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <div
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: "10px solid white",
                          borderTop: "7px solid transparent",
                          borderBottom: "7px solid transparent",
                          marginLeft: 2,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        fontSize: 7,
                        color: "rgba(255,255,255,0.5)",
                        fontWeight: 800,
                        letterSpacing: 1,
                      }}
                    >
                      MMFV
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        fontSize: 7,
                        color: "rgba(255,255,255,0.5)",
                        fontFamily: "monospace",
                      }}
                    >
                      3:42
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "rgba(255,255,255,0.1)",
                      }}
                    >
                      <div
                        style={{
                          width: "28%",
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #f58529, #dd2a7b)",
                        }}
                      />
                    </div>
                  </div>

                  {/* VIDEO DETAILS */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 7,
                        color: "#dd2a7b",
                        fontFamily: "monospace",
                        letterSpacing: 1,
                        marginBottom: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span style={{ color: "#28c840" }}>✓</span> READY
                    </div>
                    <p
                      style={{
                        fontSize: 10,
                        color: "#e0e0e0",
                        fontWeight: 600,
                        lineHeight: 1.4,
                        marginBottom: 10,
                      }}
                    >
                      How AI is Changing the Future of Work
                    </p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)",
                          borderRadius: 20,
                          padding: "4px 10px",
                          fontSize: 8,
                          color: "white",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        ↓ MP4
                      </div>
                      <div
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: 20,
                          padding: "4px 10px",
                          fontSize: 8,
                          color: "#a0a0a0",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        Share
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SCREEN GLARE */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)",
              pointerEvents: "none",
              borderRadius: "14px 14px 0 0",
            }}
          />
        </div>

        {/* HINGE LINE */}
        <div
          style={{
            width: 520,
            height: 3,
            background:
              "linear-gradient(90deg, #0a0a0a, #2a2a2a, #1a1a1a)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "30%",
              height: 1,
              background: "rgba(255,255,255,0.08)",
            }}
          />
        </div>

        {/* LAPTOP BASE */}
        <div
          style={{
            width: 520,
            height: 26,
            background:
              "linear-gradient(180deg, #1e1e1e 0%, #141414 100%)",
            borderRadius: "0 0 10px 10px",
            border: "1px solid rgba(255,255,255,0.07)",
            borderTop: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              width: 70,
              height: 14,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </div>

        {/* GROUND SHADOW */}
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: "10%",
            right: "10%",
            height: 20,
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
      </div>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}
