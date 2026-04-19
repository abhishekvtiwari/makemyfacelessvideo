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
- **GROWTH plan:** "MOST POPULAR" badge — highlighted with red/purple border glow
- **STARTER plan:** "BEST FOR STARTING OUT" badge
- Animations: `transition: all 0.2s ease`

---

## 🏗️ Project Structure

```
makemyfacelessvideo/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
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

## 💳 Pricing Plans — 5 Plans + Hidden Free

Currency: USD only. Payment provider: Stripe only.
Monthly/Annual toggle on pricing page (annual = 2 months free).

### FREE Plan (Hidden — Default fallback only)
- Never shown on pricing page
- Users land here automatically after signup
- 50 credits to try the product
- Watermark on all videos
- No downloads until upgrade
- Purpose: let users experience the product before paying

### 5 Paid Plans — COMPETITIVE PRICING

| Plan | Badge | Monthly | Annual | Credits/mo | Competitor Price |
|------|-------|---------|--------|------------|------------------|
| Starter | "Best for Starting Out" | $19.99 | $199/yr | 500 | vs $29 |
| Growth | "Most Popular" | $29.99 | $299/yr | 1,000 | vs $39 |
| Influencer | — | $59.99 | $599/yr | 2,000 | vs $69 |
| Ultra | — | $89.99 | $899/yr | 5,000 | vs $99 |
| Character Pro | "Advanced Character System" | $129.00 | $1,290/yr | 10,000 | NO COMPETITOR |

Annual pricing = ~2 months free (saves $40-$258/yr depending on plan)

### Credit System
- 1 credit = 1 video generation (regardless of length)
- Credits reset monthly on billing date
- Unused credits do NOT roll over
- Top-up credits available on all paid plans
- Free plan: 50 credits lifetime (not monthly)

### Complete Feature Matrix

| Feature | FREE | STARTER | GROWTH | INFLUENCER | ULTRA | CHARACTER PRO |
|---------|------|---------|--------|------------|-------|---------------|
| Credits | 50 lifetime | 500/mo | 1,000/mo | 2,000/mo | 5,000/mo | 10,000/mo |
| Unlimited Series | Yes | Yes | Yes | Yes | Yes | Yes |
| Auto-Post Videos | No | Yes | Yes | Yes | Yes | Yes |
| Platforms | — | YT TikTok IG X FB | All | All | All | All |
| Voiceovers | Yes | Yes | Yes | Yes | Yes | Yes |
| AI Generated Content | Yes | Yes | Yes | Yes | Yes | Yes |
| Script & Hook Generation | Yes | Yes | Yes | Yes | Yes | Yes |
| Background Music | Yes | Yes | Yes | Yes | Yes | Yes |
| AI Effects Zooms Transitions | Yes | Yes | Yes | Yes | Yes | Yes |
| Cinematic Captions | Yes | Yes | Yes | Yes | Yes | Yes |
| Watermark | Yes | No | No | No | No | No |
| Download Videos | No | Yes | Yes | Yes | Yes | Yes |
| Unlimited Exports | No | Yes | Yes | Yes | Yes | Yes |
| Unlimited Custom Templates | No | Yes | Yes | Yes | Yes | Yes |
| Team Members | 1 | 3 | 5 | 7 | 10 | 20 |
| Support | Community | Premium Live Chat | Premium Live Chat | Premium Live Chat | Premium Support + Call | Dedicated Account Manager |
| AI Agent | No | No | Yes | Yes | Yes | Yes |
| UGC Video | No | No | Yes | Yes | Yes | Yes |
| API Access | No | No | No | No | Yes | Yes |
| First Access to New Features | No | No | No | No | Yes | Yes |
| **CHARACTER SYSTEM** |
| Character Builder | Yes | Yes | Yes | Yes | Yes | Yes |
| Save Characters to Library | No | No | Limited (3) | Limited (5) | Limited (10) | **Unlimited** |
| Multi-character Dialogue | No | No | Yes | Yes | Yes | Yes |
| Voice Cloning per Character | No | No | No | No | Limited | **Unlimited** |
| Character Emotion Control | No | No | No | No | No | **Yes** |
| Character Animation Sync | No | No | No | No | No | **Yes** |
| Character Library Templates | No | No | No | No | No | **50+ Premium** |
| Export Character Presets | No | No | No | No | No | **Yes** |
| Batch Character Assignment | No | No | No | No | No | **Yes** |

### Pricing Page UI Rules
- Monthly/Annual toggle at top — Annual shows strikethrough original price
- STARTER card: green border + "Best for Starting Out" green badge
- GROWTH card: purple/red border glow + "Most Popular" purple badge
- CHARACTER PRO card: gold/orange gradient border + "Advanced Character System" badge
- Each card shows: plan name, tagline, original price crossed out (annual), current price, credits/mo, CTA button, feature list
- CTA buttons: "Select Plan" for all — red primary button on GROWTH/CHARACTER PRO, dark button on others
- Annual savings shown as "Save $X/year" tag under price
- Show competitor price comparison above cards: "Up to $258/year cheaper than competitors"

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
  voice_speed: number
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
- Hindi: eleven_multilingual_v2
- English: eleven_turbo_v2_5
- Silent MP3 fallback if ElevenLabs fails

### Platform Rules
| Platform | Aspect | Duration | Words | Key Rule |
|----------|--------|----------|-------|----------|
| YouTube | 16:9 | 3-15 min | 150-600 | Narrative arc: hook/body/CTA |
| TikTok | 9:16 | 30-90s | 60-150 | Hook in first 3 seconds |
| Instagram | 9:16 | 15-60s | 40-120 | Visually descriptive scenes |

### How It Works (3 steps for homepage)
1. Enter Idea — type your topic or paste a script
2. AI Builds Video — script, voice, visuals, music generated automatically
3. Download and Publish — ready to upload to YouTube, TikTok, Instagram

---

## 🔐 Authentication System

### Three Login Methods
1. Google OAuth — one-click via Google account
2. Email + Password — bcrypt hashed, JWT issued
3. Email OTP — 6-digit code via Resend.com, expires 10 min

### After Signup Flow
- New user → automatically placed on FREE plan
- FREE plan credits: 50 (lifetime, not monthly)
- Upgrade prompt shown after first video generation
- Upgrade prompt shown when credits drop below 10

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
- JWT in httpOnly cookie only — NEVER localStorage
- Passwords: bcrypt salt rounds 12
- OTP: 6 digits, 10 min expiry, single use, max 3 attempts
- Reset links expire in 1 hour
- Login lockout: 5 failures → 15 min cooldown

---

## 📧 Email Service — Resend.com

Four templates: OTP · Welcome · Password Reset · Admin Alert

```python
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
ADMIN_EMAIL    = os.getenv("ADMIN_EMAIL")
FROM_EMAIL     = os.getenv("FROM_EMAIL")
```

---

## 🚨 API Monitoring System

### Pre-Flight Checks (BEFORE every Claude API call)
```python
checks = {
    "api_key_present":  bool(os.getenv("ANTHROPIC_API_KEY")),
    "topic_valid":      len(topic.strip()) >= 10,
    "user_exists":      await verify_user(user_id),
    "user_has_credits": await check_user_credits(user_id),
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
| Claude API exception | Critical |
| Pre-flight failed | Warning |
| Invalid JSON from Claude | Critical |
| ElevenLabs TTS fails | Warning |
| Pexels rate limited | Warning |
| FFmpeg render fails | Critical |
| Signup fails | Warning |
| OTP failed 3x | Warning |
| Payment fails | Critical |
| R2 upload fails | Critical |
| Response over 30s | Warning |
| User credits hit zero | Warning |

---

## 🤖 Claude API Integration

One Claude API call returns everything. Never make multiple sequential calls.

### Model Routing
- Creative tasks → claude-sonnet-4-6
- Simple tasks → claude-haiku-4-5-20251001

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

Cost target: ~$0.013/video · ~$13/month at 1,000 videos

---

## 🗄️ Database — Supabase (PostgreSQL)

Service key for backend only. Anon key for frontend.
All 11 tables have Row Level Security (RLS) enabled.

### Tables
- users — profile, plan, credits_total, credits_used, credits_remaining
- videos — generation jobs, status, video_url (R2), thumbnail_url (R2)
- video_pipeline — step tracker: preflight, claude, tts, stock, render, upload
- activity_log — every user action with IP and timestamp
- video_analytics — views, downloads, shares, performance_score
- subscriptions — active plan records, expiry, Stripe subscription ID
- payments — every transaction, Stripe payment ID, status
- plan_changes — upgrade/downgrade history with proration
- credits_topups — extra credits purchased, expire in 90 days
- coupons — discount codes with usage limits
- admin_alerts — system failure log with resolved status

### Plan Values in DB
```
plan field values: free | starter | growth | influencer | ultra | character_pro
credits per plan:  50(lifetime) | 500 | 1000 | 2000 | 5000 | 10000
```

### Key Queries
```sql
-- Check credits before generation
SELECT credits_remaining FROM users WHERE id = $user_id;

-- Find exact breakpoint of failed video
SELECT breakpoint, claude_error, tts_error, render_error
FROM video_pipeline WHERE video_id = $id;

-- Subscriptions expiring in 3 days
SELECT u.email, s.plan, s.expires_at
FROM subscriptions s JOIN users u ON s.user_id = u.id
WHERE s.expires_at < now() + interval '3 days'
AND s.status = 'active';
```

---

## ☁️ Storage — Cloudflare R2

S3-compatible. No egress fees. Free: 10GB + 1M writes/month.
What gets stored: videos (.mp4), thumbnails (.jpg), audio (.mp3)
Always save URLs to Supabase videos table after upload.
Delete temp assets after successful render.
On R2 failure → log to video_pipeline + notify admin.

---

## ☁️ Deployment

| Service | Provider | Config |
|---------|----------|--------|
| Frontend | Vercel | Root: ./ · main → live · dev → test |
| Backend | Render | Root: backend/ · Starter $7/mo min |
| Storage | Cloudflare R2 | Bucket: yt-videos |

---

## 🔑 Environment Variables

backend/.env
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

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_KEY=sb_secret_...

ELEVENLABS_API_KEY=...
PEXELS_API_KEY=...
SERPAPI_KEY=...

STRIPE_SECRET_KEY=...

STORAGE_BACKEND=r2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=yt-videos
R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

src/.env.local
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
NEXT_PUBLIC_APP_ENV=production
```

---

## ✅ Coding Rules

1. Full file path as comment at top of every file
2. TypeScript only on frontend — no plain .js files
3. No inline styles — Tailwind or CSS variables only
4. One responsibility per component
5. Never hardcode API keys — environment variables only
6. Mobile first — 375px minimum width
7. Every async action needs a loading state
8. Every API call needs try/catch with user-facing error
9. Every failure must trigger notify_admin() via Resend
10. JWT in httpOnly cookie only — never localStorage
11. Always bcrypt passwords before storing
12. OTP expires server-side after 10 min
13. Credits-based usage — deduct 1 credit per video from Supabase after successful render
14. Show upgrade prompt when free user credits drop below 10
15. Commit format: feat: fix: style: chore: docs:

---

## 🚫 Never Do This

- Never use white or light backgrounds
- Never use Inter, Roboto, Arial, or system fonts
- Never make multiple Claude API calls for one video
- Never push .env files to GitHub
- Never store JWT in localStorage or sessionStorage
- Never log passwords in plain text
- Never skip admin notification on failures
- Never send OTP in API response — email only
- Never skip post-response validation of Claude output
- Never show INR pricing — USD only always
- Never use Razorpay — Stripe only
- Never show the FREE plan on the pricing page
- Never add "Powered by Claude AI" except the single hero badge
- Never mention Claude, Anthropic, or AI provider names in footers or cards

---

## 🎯 Build Priority Order

1. Done — Homepage built
2. Update pricing section — 5 plans with credit system (no free plan shown)
3. Auth system — Google + Email/Password + OTP + Resend emails
4. API monitoring — pre/post checks + admin alerts
5. Video creation form — topic input + all selectors
6. Blueprint preview — script, scenes, metadata display
7. Dashboard — credits counter, history, plan badge, upgrade prompt
8. Payment flow — Stripe only (USD) + monthly/annual toggle
9. Backend — FastAPI + Claude + Supabase + R2 + all services

---

Last updated: April 2026 · Payments via Stripe (USD only) · Emails via Resend.com