# CLAUDE.md — MakeMyFacelessVideo.com

## ⚡ Project Overview

MakeMyFacelessVideo.com is an AI-powered faceless video creation platform for YouTube, TikTok and Instagram creators. Users input a topic and get a complete video: script, scenes, voiceover, music, metadata and thumbnail — all automated. No camera. No face. No editing skills required.

**Live repo:** https://github.com/abhishekvtiwari/makemyfacelessvideo
**Live site:** https://makemyfacelessvideo.com (main branch)
**Test site:** https://test.makemyfacelessvideo.com (dev branch)
**Launch date:** May 1, 2026
**Stack:** Next.js 14 (App Router) + TypeScript · FastAPI + Python · Claude API (Anthropic)

---

## 🎨 Design System — Follow This Exactly

### Theme
- **Always dark background** — never white or light backgrounds
- Base: `#0A0A0F` · Surface: `#111118` · Elevated: `#1A1A24`
- Grain/noise texture overlay on hero sections for depth
- UI feel: YouTube (structure) + TikTok (energy) + Instagram (aesthetics)

### Color Palette
```
--red:      #FF2D55   primary CTA, active states
--pink:     #FF375F   hover states
--orange:   #FF6B35   warnings, secondary accents
--purple:   #BF5AF2   AI Powered 
--bg:       #0A0A0F
--surface:  #111118
--surface2: #1A1A24
--border:   rgba(255,255,255,0.07)
--text:     #E8E8F0
--muted:    #6B6B80
--success:  #30D158
--error:    #FF453A
```

### Gradient System
```css
background: linear-gradient(135deg, #FF3B3B 0%, #C850C0 50%, #FFCC70 100%);
box-shadow: 0 0 40px rgba(255,45,85,0.4);
border: 1px solid rgba(255,255,255,0.07);
```

### Typography
- **Display/Headers:** `Bebas Neue` — bold, all-caps for hero text
- **Body/UI:** `DM Sans` — clean, modern, readable
- **Code/Mono:** `Space Mono` — for badges and technical labels
- Import all from Google Fonts in layout.tsx

### Logo
- Play button icon merging into waveform with AI spark
- Gradient: Red (#FF3B3B) → Purple (#C850C0) → Orange (#FFCC70)
- Text: "MakeMyFacelessVideo" in DM Sans medium

### Component Style Rules
- Cards: `#111118` bg + `rgba(255,255,255,0.07)` border + `12px` radius
- Buttons primary: Red bg + white text + red glow shadow
- Buttons secondary: Transparent + border + white text
- Inputs: Dark bg + subtle border + red focus ring
- Badges: Space Mono + uppercase + letter-spacing: 2px
- **GROWTH plan:** Highlighted with ⭐ badge — most popular
- Animations: `transition: all 0.2s ease`

---

## 🏗️ Project Structure

```
makemyfacelessvideo/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               ← Homepage
│   │   ├── globals.css
│   │   ├── dashboard/
│   │   ├── create/
│   │   ├── history/
│   │   └── auth/
│   │       ├── login/page.tsx
│   │       ├── signup/page.tsx
│   │       └── verify/page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── OTPInput.tsx
│   │   │   └── GoogleButton.tsx
│   │   ├── VideoGenerator/
│   │   ├── BlueprintPreview/
│   │   └── Navbar/
│   ├── hooks/
│   │   ├── useStreamGenerate.ts
│   │   └── useAuth.ts
│   └── lib/
│       ├── api.ts
│       └── auth.ts
│
├── backend/
│   ├── main.py
│   ├── claude_client.py
│   ├── prompts.py
│   ├── routes/
│   │   ├── generate.py
│   │   ├── stream.py
│   │   ├── batch.py
│   │   └── auth.py
│   ├── services/
│   │   ├── tts.py
│   │   ├── stock.py
│   │   ├── renderer.py
│   │   ├── email_service.py
│   │   └── notification_service.py
│   ├── middleware/
│   │   └── api_monitor.py
│   └── requirements.txt
│
├── CLAUDE.md
└── README.md
```

---

## 💳 Pricing Plans — 6 Plans (Creator Growth Journey)

Plans are structured around **monthly content minutes**.
**GROWTH ⭐ is the highlighted/recommended plan.**
Character Library unlocks from GROWTH plan onwards.
Character Builder tool is FREE on all plans — saving characters is plan-gated.

### India — INR

| Plan         | Monthly    | Annual (save 2 mo) | Annual Saving |
|--------------|------------|-------------------|---------------|
| FREE         | ₹0         | —                 | —             |
| LITE         | ₹1,999     | ₹19,990/yr        | ₹3,998        |
| STARTER      | ₹2,999     | ₹29,990/yr        | ₹5,998        |
| GROWTH ⭐    | ₹5,599     | ₹55,990/yr        | ₹11,198       |
| PRO          | ₹9,999     | ₹99,990/yr        | ₹19,998       |
| ULTIMATE     | ₹14,999    | ₹1,49,990/yr      | ₹29,998       |

### Global — USD

| Plan         | Monthly | Annual (save 2 mo) | Annual Saving |
|--------------|---------|--------------------|---------------|
| FREE         | $0      | —                  | —             |
| LITE         | $29     | $290/yr            | $58           |
| STARTER      | $49     | $490/yr            | $98           |
| GROWTH ⭐    | $89     | $890/yr            | $178          |
| PRO          | $149    | $1,490/yr          | $298          |
| ULTIMATE     | $249    | $2,490/yr          | $498          |

### Complete Feature Matrix

| Feature | FREE | LITE | STARTER | GROWTH ⭐ | PRO | ULTIMATE |
|---------|------|------|---------|-----------|-----|----------|
| **CORE USAGE** |
| Minutes/Month | 10 | 120 | 200 | 500 | 1,000 | 2,000 |
| Max Video Length | 2 min | 3 min | 5 min | 15 min | 30 min | 45 min |
| Min Video Length | 30 sec | 30 sec | 30 sec | 30 sec | 30 sec | 30 sec |
| **OUTPUT & QUALITY** |
| 720p | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 1080p | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| 9:16 Shorts/Reels | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 16:9 YouTube/Desktop | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Watermark | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **RESEARCH** |
| Web Research | ❌ | ❌ | Limited | ✅ | ✅ | ✅ |
| **CREATION** |
| Scene Breakdown | ❌ | Limited | ✅ | ✅ | ✅ | ✅ |
| Scene Editing | ❌ | ❌ | Basic | Advanced | Advanced | Full |
| Timeline Editing | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Multi-Output | ❌ | ❌ | Limited | ✅ | ✅ | ✅ |
| **VISUAL SYSTEM** |
| Basic Library | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Web Visual Fetch | ❌ | ❌ | Limited | ✅ | ✅ | ✅ |
| Premium Visuals (AI) | ❌ | ❌ | ❌ | Limited | ✅ | ✅ |
| **CHARACTER SYSTEM** |
| Character Builder (free tool) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Save Characters to Library | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Max Saved Characters | 0 | 0 | 0 | 3 | 5 | 10 |
| Multi-character Dialogue | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Voice Assignment per Character | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **ACCOUNT** |
| Video History | 7 days | 30 days | 60 days | 1 year | Forever | Forever |
| Top-Up Minutes | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Batch Generation | ❌ | ❌ | ❌ | ❌ | 50/batch | 500/batch |
| REST API | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Team Seats | 1 | 1 | 1 | 2 | 5 | 10 |
| Support | Community | Email | Email | Email 24h | Chat | Phone |

### Minutes to Content Reference

| Plan | Min/mo | ~1-min Shorts | ~3-min videos | ~5-min videos | ~10-min videos | ~15-min videos |
|------|--------|---------------|---------------|---------------|----------------|----------------|
| FREE | 10 | ~10 | ~3 | ~2 | ~1 | — |
| LITE | 120 | ~120 | ~40 | ~24 | ~12 | ~8 |
| STARTER | 200 | ~200 | ~67 | ~40 | ~20 | ~13 |
| GROWTH ⭐ | 500 | ~500 | ~167 | ~100 | ~50 | ~33 |
| PRO | 1,000 | ~1K | ~333 | ~200 | ~100 | ~67 |
| ULTIMATE | 2,000 | ~2K | ~667 | ~400 | ~200 | ~133 |

**Payment providers:**
- India: Razorpay (INR)
- International: Stripe (USD)
- Every payment failure → immediate admin alert via Resend

---

## 🎬 Core Features

### User Input Fields
```typescript
interface VideoInput {
  topic: string
  platform: 'youtube' | 'tiktok' | 'instagram'
  duration: 'short' | 'medium' | 'long'
  style: 'educational' | 'entertaining' | 'inspirational'
  language: 'en' | 'hi'
  voice_speed: number        // 0.8 - 1.2
  mode: 'narration' | 'dialogue'
  visual_type: 'stock' | 'upload' | 'gameplay' | 'web_images' | 'ai_gen'
}
```

### Visual Engine Priority
1. User Upload
2. Gameplay Library (Pexels + gaming keywords)
3. Stock Footage (Pexels API)
4. Web Images (Pexels + SerpAPI → FFmpeg Ken Burns)
5. AI Generated (Pollinations.ai — free, no key needed)

### Voice System — ElevenLabs
- Speed control (0.8x - 1.2x)
- Tone: neutral, excited, calm, serious, inspiring
- Hindi: `eleven_multilingual_v2`
- English: `eleven_turbo_v2_5`
- Silent MP3 fallback if ElevenLabs fails

### Platform Rules
| Platform | Aspect | Duration | Words | Key Rule |
|----------|--------|----------|-------|----------|
| YouTube | 16:9 | 3-15 min | 150-600 | Narrative arc: hook/body/CTA |
| TikTok | 9:16 | 30-90s | 60-150 | Hook in first 3 seconds |
| Instagram | 9:16 | 15-60s | 40-120 | Visually descriptive scenes |

### How It Works (3 steps for homepage)
1. **Enter Idea** — type your topic or paste a script
2. **AI Builds Video** — script, voice, visuals, music generated automatically
3. **Download & Publish** — ready to upload to YouTube, TikTok, Instagram

---

## 🔐 Authentication System

### Three Login Methods
1. **Google OAuth** — one-click via Google account
2. **Email + Password** — bcrypt hashed, JWT issued
3. **Email OTP** — 6-digit code via Resend.com, expires 10 min

### Auth Endpoints
```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/google
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/logout
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Security Rules
- JWT in **httpOnly cookie only** — NEVER localStorage
- Passwords: bcrypt salt rounds 12
- OTP: 6 digits, 10 min expiry, single use, max 3 attempts
- Reset links expire in 1 hour
- Login lockout: 5 failures → 15 min cooldown

---

## 📧 Email Service — Resend.com

```python
RESEND_API_KEY = os.getenv("RESEND_API_KEY")   # re_...
ADMIN_EMAIL    = os.getenv("ADMIN_EMAIL")
FROM_EMAIL     = os.getenv("FROM_EMAIL")        # noreply@makemyfacelessvideo.com
```

Four templates: OTP · Welcome · Password Reset · Admin Alert

---

## 🚨 API Monitoring System

### Pre-Flight Checks (BEFORE every Claude API call)
```python
checks = {
    "api_key_present":  bool(os.getenv("ANTHROPIC_API_KEY")),
    "topic_valid":      len(topic.strip()) >= 10,
    "user_exists":      await verify_user(user_id),
    "user_has_minutes": await check_user_minutes(user_id),
    "token_ok":         await estimate_tokens(topic) < 8000,
    "rate_limit_ok":    await check_rate_limit(user_id),
}
```

### Post-Response Checks (AFTER every Claude API call)
```python
checks = {
    "has_title":     bool(blueprint.get("title")),
    "has_script":    bool(blueprint.get("script")),
    "has_scenes":    len(blueprint.get("scenes", [])) >= 3,
    "has_voiceover": len(blueprint.get("voiceover_segments", [])) >= 1,
    "has_metadata":  bool(blueprint.get("metadata")),
    "fast_enough":   duration_ms < 30000,
}
```

### Admin Alert Triggers
| Event | Severity |
|-------|----------|
| Claude API exception | 🔴 Critical |
| Pre-flight failed | 🟡 Warning |
| Invalid JSON from Claude | 🔴 Critical |
| ElevenLabs TTS fails | 🟡 Warning |
| Pexels rate limited | 🟡 Warning |
| FFmpeg render fails | 🔴 Critical |
| Signup fails | 🟡 Warning |
| OTP failed 3x | 🟡 Warning |
| Payment fails | 🔴 Critical |
| R2 upload fails | 🔴 Critical |
| Response > 30s | 🟡 Warning |

---

## 🤖 Claude API Integration

One Claude API call returns everything. Never make multiple sequential calls.

### Model Routing
- Creative tasks → `claude-sonnet-4-6`
- Simple tasks → `claude-haiku-4-5-20251001`

### Always Use Prompt Caching
```python
system=[{"type": "text", "text": SYSTEM_PROMPT,
         "cache_control": {"type": "ephemeral"}}]
```

### JSON Blueprint Schema
```json
{
  "title": "string (max 60 chars)",
  "hook": "string (under 15 words)",
  "script": "string (full narration)",
  "scenes": [{"id": 1, "visual_description": "string",
               "stock_keywords": ["string"],
               "transition": "cut|fade|slide"}],
  "voiceover_segments": [{"id": 1, "text": "string",
                           "emotion": "neutral|excited|calm|serious|inspiring",
                           "pace": "slow|normal|fast"}],
  "background_music": {"mood": "string", "tempo": "slow|medium|fast",
                        "genre": "string"},
  "metadata": {"description": "string", "hashtags": ["string"],
               "tags": ["string"], "category": "string",
               "duration_seconds": 60},
  "thumbnail_prompt": "string"
}
```

**Cost target:** ~$0.013/video · ~$13/month at 1,000 videos

---

## ☁️ Deployment

| Service | Provider | Config |
|---------|----------|--------|
| Frontend | Vercel | Root: ./ · main → live · dev → test |
| Backend | Render | Root: backend/ · Starter $7/mo min |
| Storage | Cloudflare R2 | Bucket: yt-videos |

---

## 🔑 Environment Variables

**backend/.env**
```
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=32-char-minimum-random-string
APP_ENV=production
FRONTEND_URL=https://makemyfacelessvideo.com

RESEND_API_KEY=re_...
ADMIN_EMAIL=your@email.com
FROM_EMAIL=noreply@makemyfacelessvideo.com

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

ELEVENLABS_API_KEY=...
PEXELS_API_KEY=...
SERPAPI_KEY=...

RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
STRIPE_SECRET_KEY=...

STORAGE_BACKEND=r2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=yt-videos
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

**src/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_APP_ENV=production
```

---

## ✅ Coding Rules

1. Full file path as comment at top of every file
2. TypeScript only on frontend
3. No inline styles — Tailwind or CSS variables only
4. One responsibility per component
5. Never hardcode API keys
6. Mobile first — 375px minimum width
7. Every async action needs a loading state
8. Every API call needs try/catch with user-facing error
9. Every failure must trigger `notify_admin()` via Resend
10. JWT in httpOnly cookie only — never localStorage
11. Always bcrypt passwords before storing
12. OTP expires server-side after 10 min
13. Minutes-based usage tracking — deduct on video completion
14. Commit format: `feat:` `fix:` `style:` `chore:` `docs:`

---

## 🚫 Never Do This

- Never use white or light backgrounds
- Never use Inter, Roboto, Arial, or system fonts
- Never make multiple Claude API calls for one video
- Never push .env files to GitHub
- Never store JWT in localStorage
- Never log passwords in plain text
- Never skip admin notification on failures
- Never send OTP in API response — email only
- Never skip post-response validation
- Never show old 4-plan pricing — always use the 6-plan structure
- Never add "Powered by Claude AI" anywhere except 
  the single badge in the hero section
- Never mention Claude, Anthropic, or AI provider 
  names in footers, cards, or feature descriptions

---

## 🎯 Build Priority Order

1. ✅ Homepage — hero, features, how it works, pricing (6 plans), footer
2. Auth system — Google + Email/Password + OTP + Resend emails
3. API monitoring — pre/post checks + admin alerts
4. Video creation form — topic input + all selectors
5. Blueprint preview — script, scenes, metadata display
6. Dashboard — minutes counter, history, plan badge
7. Payment flow — Razorpay (INR) + Stripe (USD) + annual/monthly toggle
8. Backend — FastAPI + Claude integration + all services

---

*Last updated: April 2026 · Claude API (Anthropic) · Emails via Resend.com*