# CLAUDE.md — MakeMyFacelessVideo.com

## Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript — strict mode, no `any`
- **Backend:** Python FastAPI — async, typed, modular routes
- **Database:** Supabase (PostgreSQL) — RLS on every table
- **Payments:** Razorpay ONLY — never Stripe, never any other processor
- **Storage:** Cloudflare R2 — signed URLs for all media assets
- **AI:** Claude API (Anthropic) — one call returns full JSON blueprint
- **Email:** AWS SES — transactional emails only
- **Deployment:** Vercel (frontend) · Render (backend)

---

## Design System — Dark Luxury Cinema

- **Theme:** Always dark. Apply `data-theme="dark"` on `#app`.
- **Base bg:** `#060C1C`
- **Surface:** `#0D1426`
- **Elevated:** `#131D30`
- **Violet (primary):** `#5B47F5`
- **Teal (secondary):** `#0D9488`
- **Text:** `#E2E8F0`
- **Muted:** `#64748B`
- **Border:** `rgba(255,255,255,0.06)`
- **Error:** `#EF4444`
- **Success:** `#10B981`

All colors must come from CSS custom properties — never hardcoded hex in components.
Theme is applied globally via `data-theme=dark` on `#app` — no per-component overrides.

---

## Single Source of Truth

**`src/lib/plans.ts`** is the only place plan pricing, credit limits, and feature flags live.
- All frontend components read from `plans.ts`
- Backend mirrors this data in the `plans` Supabase table
- Never hardcode plan data in JSX, API routes, or prompts

---

## Claude API Rules

- One Claude API call per video — never sequential calls for the same job
- Creative tasks (blueprint generation) → `claude-sonnet-4-6`
- Simple tasks (title suggestions, tag generation) → `claude-haiku-4-5-20251001`
- Always cache the system prompt:
  ```python
  system=[{"type": "text", "text": SYSTEM_PROMPT,
           "cache_control": {"type": "ephemeral"}}]
  ```
- Output is always a validated JSON blueprint — never raw text

---

## Payment Rules

- **Razorpay is the only payment processor.** Never use Stripe, PayPal, or any other.
- All amounts in INR (paise for Razorpay API)
- Always verify Razorpay signature server-side before granting credits
- On payment failure → log to `payments` table + notify admin via SES

---

## Hard Rules

1. Never stub routes — every endpoint must be fully implemented or not created
2. Never break modularity — one responsibility per file/component
3. Always cache Claude API system prompt (ephemeral cache_control)
4. Razorpay is the only payment processor
5. JWT in httpOnly cookie only — never localStorage or sessionStorage
6. RLS enabled on every Supabase table — no exceptions
7. Never expose secret keys to the frontend
8. Never hardcode plan limits — always read from `src/lib/plans.ts`
9. Full file path as comment at the top of every file
10. Mobile first — 375px minimum width

---

## Architecture

### Video Blueprint Flow
1. User submits `VideoInput` form
2. Pre-flight checks (credits, rate limit, token estimate)
3. Single Claude API call → full JSON blueprint
4. Post-response validation (title, script, scenes, voiceover, metadata)
5. TTS via ElevenLabs → audio segments
6. Stock visuals via Pexels / AI-gen via Pollinations
7. FFmpeg render → upload to R2
8. Deduct 1 credit from Supabase → return video URL

### JSON Blueprint Schema
```json
{
  "title": "string (max 60 chars)",
  "hook": "string (under 15 words)",
  "script": "string",
  "scenes": [{"id": 1, "visual_description": "string", "stock_keywords": ["string"], "transition": "cut|fade|slide"}],
  "voiceover_segments": [{"id": 1, "text": "string", "emotion": "neutral|excited|calm|serious|inspiring", "pace": "slow|normal|fast"}],
  "background_music": {"mood": "string", "tempo": "slow|medium|fast", "genre": "string"},
  "metadata": {"description": "string", "hashtags": ["string"], "tags": ["string"], "category": "string", "duration_seconds": 60},
  "thumbnail_prompt": "string"
}
```

---

## Rule Files

Detailed conventions live in `.claude/rules/`:
- `api-conventions.md` — FastAPI structure, Razorpay, 3-layer usage tracking, JWT
- `code-style.md` — TypeScript strict, CSS tokens, Chart.js, Python async
- `database.md` — Supabase RLS, 3-layer usage schema, plans table
- `error-handling.md` — typed errors, Claude retry, Razorpay verification
- `security.md` — JWT cookies, input validation, R2 signed URLs
- `project-structure.md` — exact folder layout

Slash commands live in `.claude/commands/`.
