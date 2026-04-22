# Project Structure

```
makemyfacelessvideo/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, fonts, #app with data-theme="dark"
│   │   ├── page.tsx                # Homepage
│   │   ├── globals.css             # CSS tokens only — no component styles here
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── create/
│   │   │   └── page.tsx
│   │   ├── history/
│   │   │   └── page.tsx
│   │   └── auth/
│   │       ├── login/page.tsx
│   │       ├── signup/page.tsx
│   │       └── verify/page.tsx
│   ├── components/
│   │   ├── ui/                     # Primitives: Button, Input, Badge, Card, Modal
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── OTPInput.tsx
│   │   │   └── GoogleButton.tsx
│   │   ├── VideoGenerator/
│   │   │   ├── VideoGeneratorForm.tsx
│   │   │   └── GenerationProgress.tsx
│   │   ├── BlueprintPreview/
│   │   │   ├── BlueprintPreview.tsx
│   │   │   └── SceneCard.tsx
│   │   ├── Dashboard/
│   │   │   ├── CreditsWidget.tsx
│   │   │   ├── VideoHistory.tsx
│   │   │   └── UsageChart.tsx      # Chart.js — reads colors via requestAnimationFrame
│   │   └── Navbar/
│   │       └── Navbar.tsx
│   ├── hooks/
│   │   ├── useStreamGenerate.ts
│   │   ├── useAuth.ts
│   │   └── useCredits.ts
│   └── lib/
│       ├── plans.ts                # SINGLE SOURCE OF TRUTH for all plan data
│       ├── api.ts                  # Typed fetch wrappers for backend
│       └── auth.ts                 # Auth helpers, token refresh
│
├── backend/
│   ├── main.py                     # FastAPI app init, router registration, CORS
│   ├── errors.py                   # Typed AppError classes
│   ├── claude_client.py            # Claude API wrapper with prompt caching
│   ├── prompts.py                  # SYSTEM_PROMPT and blueprint prompt templates
│   ├── routes/
│   │   ├── auth.py                 # /api/auth/*
│   │   ├── generate.py             # /api/generate/*
│   │   ├── stream.py               # /api/stream/*
│   │   ├── payments.py             # /api/payments/* — Razorpay only
│   │   └── dashboard.py            # /api/dashboard/*
│   ├── services/
│   │   ├── tts.py                  # ElevenLabs TTS
│   │   ├── stock.py                # Pexels + Pollinations
│   │   ├── renderer.py             # FFmpeg render pipeline
│   │   ├── storage.py              # R2 upload, signed URLs
│   │   ├── email_service.py        # AWS SES transactional emails
│   │   ├── usage_tracker.py        # 3-layer usage tracking writes
│   │   └── notification_service.py # Admin alerts via SES
│   ├── middleware/
│   │   ├── auth.py                 # require_auth dependency
│   │   ├── rate_limiter.py
│   │   └── api_monitor.py          # Pre/post-flight checks
│   └── requirements.txt
│
├── .claude/
│   ├── rules/
│   │   ├── api-conventions.md
│   │   ├── code-style.md
│   │   ├── database.md
│   │   ├── error-handling.md
│   │   ├── security.md
│   │   └── project-structure.md    # this file
│   └── commands/
│       ├── new-feature.md
│       ├── fix-issue.md
│       └── review.md
│
├── CLAUDE.md                       # Main project instructions
├── CLAUDE.local.md                 # Local dev URLs (gitignored)
└── README.md
```

## Naming Conventions

- React components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities/lib: `camelCase.ts`
- Backend routes/services: `snake_case.py`
- CSS classes: Tailwind utilities only — no custom class names except in globals.css
- Supabase table names: `snake_case` (plural)
- Environment variables: `SCREAMING_SNAKE_CASE`
