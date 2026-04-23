# MMFV — Claude Code Build Checklist
**Version 2.0 | April 2026**
**Reference this file at the start of every build session. Check off items as completed.**

---

## HOW TO USE THIS FILE

At the start of each Claude Code session, read this file first.
Mark completed items with [x]. Add notes with → Note: ...
Never skip a section — each depends on the previous.
Update version number + date when making significant changes.

---

## PHASE 0: FOUNDATION (Pre-build)
*Complete before writing any application code*

- [ ] Repo initialized: `git init`, `.gitignore` configured
- [ ] Monorepo structure: `/backend`, `/frontend`, `/scripts`
- [ ] Environment files: `backend/.env.example`, `frontend/.env.local.example`
- [ ] All API keys obtained and added to `.env` (never commit real keys):
  - [ ] `ANTHROPIC_API_KEY` — console.anthropic.com
  - [ ] `ELEVENLABS_API_KEY` — elevenlabs.io → Profile → API Keys
  - [ ] `PEXELS_API_KEY` — pexels.com/api
  - [ ] `RAZORPAY_KEY_ID=rzp_live_...`
  - [ ] `STRIPE_SECRET_KEY` — dashboard.stripe.com
  - [ ] `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — console.cloud.google.com
  - [ ] `YOUTUBE_CLIENT_ID` + `YOUTUBE_CLIENT_SECRET` — same Google project (enable YouTube Data API v3)
  - [ ] `# NO TIKTOK API — TikTok banned in India, compliance risk`
  - [ ] R2 bucket created + `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL`
  - [ ] `DATABASE_URL` (Supabase connection string)
  - [ ] `REDIS_URL` (Upstash Redis)
  - [ ] `JWT_SECRET` (32+ char random string — use: `openssl rand -hex 32`)
- [ ] FFmpeg installed: `ffmpeg -version` returns 6+
- [ ] Python 3.11+ installed + venv created
- [ ] Node.js 18+ installed

---

## PHASE 1: BACKEND CORE

### 1.1 FastAPI Setup
- [ ] `requirements.txt` includes: fastapi, uvicorn, anthropic, python-jose, passlib, httpx, asyncpg, redis, boto3, ffmpeg-python, python-multipart, pydantic
- [ ] `main.py`: FastAPI app with CORS configured (`FRONTEND_URL` from env), health endpoint `/health`
- [ ] `config.py`: Pydantic Settings loading all env vars — fail fast if missing required keys
- [ ] `database.py`: asyncpg connection pool + Supabase client setup
- [ ] `redis_client.py`: Upstash Redis connection (used for job queue + session cache)

### 1.2 Database Migrations
- [ ] `migrations/001_users.sql` — users table (see System Requirements §3)
- [ ] `migrations/002_jobs.sql` — jobs table
- [ ] `migrations/003_series.sql` — series_configs table
- [ ] `migrations/004_social.sql` — social_connections table
- [ ] `migrations/005_brand_kits.sql` — brand_kits table
- [ ] All migrations run successfully: `psql $DATABASE_URL -f migrations/*.sql`

### 1.3 Auth Routes (`/api/auth/`)
- [ ] `POST /api/auth/google` — verify Google ID token → create/find user → return JWT
- [ ] `POST /api/auth/refresh` — validate refresh token → issue new JWT
- [ ] `POST /api/auth/logout` — invalidate refresh token
- [ ] JWT middleware: `get_current_user()` dependency used on all protected routes
- [ ] Demo mode: `id_token: "demo_user"` returns test user (dev only, disable in prod)

### 1.4 Claude AI Client (`claude_client.py`)
- [ ] `generate_video_blueprint()` function with:
  - [ ] System prompt with full JSON schema embedded (see mmfv-api-integration-guide.md)
  - [ ] `cache_control: {"type": "ephemeral"}` on system prompt block
  - [ ] Model: `claude-sonnet-4-6`
  - [ ] Max tokens: 2048
  - [ ] JSON response parsing with markdown fence stripping
  - [ ] Token usage logging: `input_tokens`, `cache_read_input_tokens`, `cache_creation_input_tokens`, `output_tokens`
- [ ] `edit_blueprint()` function with:
  - [ ] Sliding window conversation history (last 6 turns)
  - [ ] Session storage (Redis key: `session:{job_id}:history`)
  - [ ] Same cached system prompt
- [ ] `estimate_request_cost()` — uses `client.messages.count_tokens()` for pre-flight
- [ ] `generate_title_alternatives()` — uses `claude-haiku-4-5-20251001` (cheaper for simple tasks)

### 1.5 Input Processors
- [ ] `processors/prompt.py` — sanitize + validate free-text topic (min 10 chars)
- [ ] `processors/reddit.py`:
  - [ ] Accept URL format: `reddit.com/r/{sub}/comments/{id}/...`
  - [ ] Fetch: `GET https://www.reddit.com/{path}.json` (no API key needed, set User-Agent header)
  - [ ] Extract: post title + top 5 comments (sorted by score) + subreddit context
  - [ ] Truncate to 800 words max before passing to Claude
- [ ] `processors/blog.py`:
  - [ ] Fetch URL with `httpx` (5 sec timeout, follow redirects)
  - [ ] Parse with `BeautifulSoup4`: extract `<article>` or `<main>` or `<body>`, strip nav/footer/ads
  - [ ] Truncate to 1,500 words max
  - [ ] Handle errors: 404, timeout, paywalled content gracefully

### 1.6 Generation Pipeline (`pipeline/`)
- [ ] `pipeline/tts.py` — ElevenLabs segments:
  - [ ] Parallel generation of all voiceover segments
  - [ ] Emotion mapping: excited/calm/serious/inspiring → ElevenLabs voice settings
  - [ ] Fallback: generate silent MP3 if ElevenLabs quota exceeded (never crash the pipeline)
  - [ ] Output: list of audio file paths
- [ ] `pipeline/visuals.py` — 4-tier cascade:
  - [ ] Tier 1: User uploaded clips (skip if none)
  - [ ] Tier 2: Pexels video search (scored: keyword 40% + duration 25% + resolution 20% + aspect 15%)
  - [ ] Tier 3: Web images via SerpAPI (optional, only if SERPAPI_KEY set)
  - [ ] Tier 4: Pollinations AI image generation (free, no key)
  - [ ] All tiers run in parallel, best result selected
- [ ] `pipeline/renderer.py` — FFmpeg:
  - [ ] Clip download + trim to scene duration
  - [ ] Audio mux (voiceover + background music with ducking)
  - [ ] Subtitle/caption burn (SRT → ASS → FFmpeg filter)
  - [ ] Vignette + color grade filter
  - [ ] Watermark overlay (for free tier)
  - [ ] Final output: MP4 H.264, AAC audio
  - [ ] Upload to R2 on completion
- [ ] `pipeline/coordinator.py`:
  - [ ] `Promise.all`-equivalent: `asyncio.gather(tts_task, visuals_task)`
  - [ ] Feeds results to renderer
  - [ ] Updates job progress: 20% (blueprint) → 40% (voice) → 60% (visuals) → 80% (render) → 100% (done)

### 1.7 Job Queue
- [ ] Redis-backed async job queue
- [ ] `POST /api/generate` → creates job record → pushes to queue → returns `{job_id}`
- [ ] Worker picks up job → runs pipeline → updates job status in DB
- [ ] `GET /api/video-status/{job_id}` → returns `{status, progress, step, video_url}`
- [ ] Failed jobs: save `error_msg` to DB, set status=failed, don't retry automatically

### 1.8 Payment Routes
- [ ] `GET /api/payments/plans` — return plan matrix with geo-detected currency
- [ ] Razorpay:
  - [ ] `POST /api/payments/create-order` (India): creates Razorpay order
  - [ ] `POST /api/payments/verify` (India): HMAC signature verify → upgrade user plan
- [ ] Stripe:
  - [ ] `POST /api/payments/create-order` (global): creates PaymentIntent or Subscription
  - [ ] `POST /api/payments/webhook` (global): verify `stripe-signature` header → handle `payment_intent.succeeded`, `customer.subscription.deleted`
  - [ ] `GET /api/payments/portal` — return Stripe Customer Portal session URL

### 1.9 Publishing Routes
- [ ] YouTube OAuth:
  - [ ] `GET /api/publish/youtube/auth` — OAuth URL with `youtube.upload` scope
  - [ ] `GET /api/publish/youtube/callback` — exchange code → store tokens in `social_connections`
  - [ ] `POST /api/publish/youtube/upload` — upload video + metadata from blueprint
  - [ ] Token auto-refresh using stored `refresh_token`
- [ ] TikTok:
  - [ ] `GET /api/publish/tiktok/auth` — TikTok OAuth URL
  - [ ] `GET /api/publish/tiktok/callback` — exchange + store
  - [ ] `POST /api/publish/tiktok/upload` — Content Posting API

### 1.10 Series + Cron
- [ ] CRUD routes: GET/POST/PUT/DELETE `/api/series`
- [ ] `POST /api/series/{id}/pause` — toggle active/paused
- [ ] Cron job (runs daily 3AM UTC):
  - [ ] Query `series_configs WHERE status='active' AND next_run_at <= NOW()`
  - [ ] Generate topic variation using Claude Haiku (cheap)
  - [ ] Fire `generate_batch()` via Anthropic Batch API
  - [ ] On completion: auto-publish if social account connected
  - [ ] Update `next_run_at` + `total_generated`
  - [ ] Send email notification (use SendGrid free tier or Resend)

---

## PHASE 2: FRONTEND

### 2.1 Next.js Setup
- [ ] `create-next-app` with TypeScript + Tailwind CSS
- [ ] `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...`
- [ ] Global layout: dark theme (bg `#0F0F0F`), Bebas Neue for headings, Inter for body

### 2.2 Auth Flow
- [ ] Google OAuth button on homepage
- [ ] JWT stored in httpOnly cookie (set by backend, not localStorage)
- [ ] `useAuth()` hook: check cookie → fetch `/api/account` → user context
- [ ] Protected routes: redirect to `/` if not authenticated

### 2.3 Dashboard Layout
- [ ] Left sidebar: navigation (Dashboard, My Videos, Series, Settings, Upgrade)
- [ ] Plan badge in sidebar (shows current plan + videos remaining)
- [ ] Main area: 3-column on desktop, stacked on mobile
- [ ] Column 1: Input panel
- [ ] Column 2: Processing / Output panel
- [ ] Column 3: History preview

### 2.4 Input Panel
- [ ] Tab switcher: [Prompt] | [Reddit URL] | [Blog URL]
- [ ] Prompt tab: textarea (min 10 chars validation)
- [ ] Reddit tab: URL input + "Fetch Preview" button showing post title
- [ ] Blog tab: URL input + "Fetch Preview" showing article title + word count
- [ ] Options row 1: Platform buttons [YouTube] [TikTok] [Instagram]
- [ ] Options row 2: Duration [Short 60s] [Medium 3–5m] [Long 8–15m]
- [ ] Options row 3: Style [Educational] [Entertaining] [Motivational] [News] [Story]
- [ ] Options row 4: Language [English] [Hindi] (locked to plan)
- [ ] "Estimate Cost" link: shows pre-flight token count + "$0.013 estimated"
- [ ] "Generate Video" button: disabled if no input or no videos remaining
- [ ] Show: "X videos remaining this month" below button

### 2.5 Processing View
- [ ] Full-width progress bar with animated gradient
- [ ] Step label: "Generating script..." → "Creating voiceover..." → "Fetching visuals..." → "Rendering video..."
- [ ] Percentage number
- [ ] Cancel button (calls DELETE /api/jobs/{id})
- [ ] If user navigates away: mini strip in header showing "▶ Generating... 60%"

### 2.6 Output Panel
- [ ] Video player (HTML5 video, autoplay muted, loop)
- [ ] Resolution badge (720p / 1080p / 4K)
- [ ] Action bar:
  - [ ] [↓ Download] — signed R2 URL, expires 24hr
  - [ ] [→ Publish to YouTube] (active if connected)
  - [ ] [→ Publish to TikTok] (active if connected)
  - [ ] [✏ Edit with AI] — opens chat editor
  - [ ] [⟳ Regenerate] — new blueprint, same settings
  - [ ] [🗑 Delete]
- [ ] SEO Metadata section (expandable):
  - [ ] Title (copy button)
  - [ ] Description (copy button)
  - [ ] Hashtags (copy button)
  - [ ] Tags (copy button)
- [ ] Thumbnail: shows AI-generated thumbnail with [Regenerate Thumbnail] button
- [ ] Script text (expandable, read-only)

### 2.7 AI Chat Editor
- [ ] Chat input below video player (only visible after generation)
- [ ] User messages + Claude responses in chat bubble UI
- [ ] Input: "Make the hook more dramatic", "Cut to 60 seconds", "Change tone to funny"
- [ ] On submit: POST /api/edit → updated blueprint → show "Re-rendering..." → update video player
- [ ] History: show last 3 edit instructions in chat
- [ ] Character limit: 200 chars per edit instruction

### 2.8 Connected Accounts (Settings)
- [ ] `/settings/connected` page
- [ ] YouTube: [Connect YouTube] button → OAuth flow → shows channel name + avatar when connected
- [ ] TikTok: same pattern
- [ ] Disconnect button for each

### 2.9 Series Manager
- [ ] `/series` page: grid of active series cards
- [ ] Each card: niche name, platform icon, next scheduled time, total generated count, pause/resume toggle
- [ ] "Create New Series" modal: all series config fields
- [ ] Series detail view: calendar showing past posts + next 7 days scheduled

### 2.10 Pricing Page
- [ ] Geo-detected: shows INR plans for India IP, USD for global
- [ ] Toggle: Monthly / Annual (annual = 20% off, prices animate)
- [ ] 4 plan cards, middle plan highlighted
- [ ] Competitor comparison table below plans: MMFV vs faceless.so head-to-head
- [ ] FAQ accordion (8 questions)
- [ ] CTA: "No credit card for free tier"

### 2.11 History & Library
- [ ] `/history` page: masonry grid of past videos
- [ ] Each card: thumbnail, title, platform icon, date, duration
- [ ] Click → opens output panel view
- [ ] Filter tabs: All | YouTube | TikTok | In Progress
- [ ] Bulk select + download/delete

---

## PHASE 3: COMPETITIVE FEATURES SPRINT (12 Days)

### Sprint 1 — Content Ingestion (Days 1–4)
- [ ] Reddit URL tab in frontend input panel
- [ ] `processors/reddit.py` — Reddit JSON API fetch (no key)
- [ ] Reddit preview: show post title + comment count before generating
- [ ] Blog URL tab in frontend
- [ ] `processors/blog.py` — Cheerio/BeautifulSoup scraper
- [ ] Blog preview: show article title + estimated video length
- [ ] Test: paste 10 different Reddit URLs and 5 blog URLs, all process successfully

### Sprint 2 — AI Chat Editor + Auto-Publish (Days 5–9)
- [ ] Chat editor UI in output panel
- [ ] `POST /api/edit` route calling `edit_blueprint()`
- [ ] Session history stored in Redis with 24hr TTL
- [ ] YouTube OAuth flow end-to-end
- [ ] YouTube upload working: video + title + description + tags + thumbnail
- [ ] TikTok-format video export (9:16, 60s, captions) — manual upload by user
- [ ] TikTok upload working
- [ ] "Connected Accounts" settings page
- [ ] Test: full flow from generate → edit → publish to real YouTube channel

### Sprint 3 — Series Mode + Brand Kit (Days 10–12)
- [ ] `series_configs` table + CRUD API routes
- [ ] Series setup UI (modal form)
- [ ] Cron job: daily at 3AM UTC, query + batch fire
- [ ] Series cards on dashboard
- [ ] Brand kit DB table + API route
- [ ] Brand kit UI in settings: color picker, font, theme, watermark upload
- [ ] Pass brand kit params to FFmpeg render layer
- [ ] 5 preset theme packs: Dark Cinematic, Bright Educational, Minimal, News, Gaming
- [ ] Test: create a series → wait for cron → verify video generated + published

---

## PHASE 4: TESTING

### Unit Tests (backend)
- [ ] `test_scene_pipeline.py` — 25 tests: scene validation, keywords, SRT generation
- [ ] `test_scoring.py` — 23 tests: 4-dimension scorer
- [ ] `test_voice_service.py` — 21 tests: script cleaning, duration, fallback
- [ ] `test_render_pipeline.py` — 24 tests: FFmpeg commands, clip trim, concat, mux
- [ ] `test_processors.py` — 15 tests: Reddit + blog parsing edge cases
- [ ] All 108 tests passing: `python -m pytest tests/ -v`

### Integration Tests (manual)
- [ ] Generate short video (prompt): < 2 min, renders correctly
- [ ] Generate medium video (Reddit URL): parses correctly, outputs 60-sec TikTok
- [ ] Generate long video (blog URL): 5-min YouTube, metadata correct
- [ ] AI chat edit: 3 consecutive edits, each changes output correctly
- [ ] YouTube publish: video appears on connected channel with correct metadata
- [ ] TikTok publish: video appears with correct caption and hashtags
- [ ] Payment flow India (Razorpay test card): plan upgrades correctly
- [ ] Payment flow Global (Stripe test card): plan upgrades correctly
- [ ] Series mode: creates series → cron fires → video generated → published
- [ ] Rate limiting: 11 req/min from free user → 429 response
- [ ] Quota enforcement: free user 4th video → upgrade modal shown
- [ ] FFmpeg: Hindi video with Devanagari captions renders correctly
- [ ] Fallback: ElevenLabs quota exceeded → silent MP3 fallback, no crash

### Performance Tests
- [ ] 3-min video generates in < 2 min (P50)
- [ ] 10 concurrent users generating simultaneously, no queue overflow
- [ ] API endpoints respond < 200ms (P50) under load

---

## PHASE 5: DEPLOYMENT

### Pre-deploy Checklist
- [ ] All 108 unit tests passing
- [ ] `APP_ENV=production` set
- [ ] `JWT_SECRET` is 32+ chars random (not a default/example value)
- [ ] `STORAGE_BACKEND=r2` (never use local on Render)
- [ ] `FRONTEND_URL` matches actual Vercel domain
- [ ] All payment keys switched from TEST to LIVE
- [ ] Google OAuth redirect URIs updated for production domain
- [ ] TikTok app redirect URI updated for production domain
- [ ] R2 bucket public access confirmed
- [ ] FFmpeg install verified in Render build logs
- [ ] CORS whitelist includes production Vercel URL
- [ ] Sentry DSN configured

### Deploy Steps
- [ ] Push backend to GitHub
- [ ] Render: New Web Service → Root: backend → Build: `apt-get install -y ffmpeg && pip install -r requirements.txt` → Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Add all env vars in Render dashboard
- [ ] Verify: `curl https://your-api.onrender.com/health` returns 200
- [ ] Push frontend to GitHub
- [ ] Vercel: New Project → Root: frontend → Add `NEXT_PUBLIC_API_URL=https://your-api.onrender.com`
- [ ] Deploy frontend → verify `https://makemyfacelessvideo.com` loads
- [ ] Update `FRONTEND_URL` in Render env to Vercel domain
- [ ] CORS test: fetch from Vercel domain to Render API succeeds

### Post-deploy Verification
- [ ] Full end-to-end test on production (generate a real video)
- [ ] Payment test with real card ($1 test charge, then refund)
- [ ] YouTube OAuth on production domain works
- [ ] UptimeRobot: add monitor for `https://makemyfacelessvideo.com` and API health endpoint
- [ ] Sentry receiving events (trigger a test error)

---

## PHASE 6: LAUNCH (May 1, 2026)

### Launch Day Checklist
- [ ] Landing page countdown timer updated/removed
- [ ] "Coming Soon" → full app launched
- [ ] Email list notified (collected from coming soon page)
- [ ] Reddit posts: r/passive_income, r/ContentCreators, r/indiehackers — include demo video made with MMFV + Reddit URL
- [ ] ProductHunt launch scheduled
- [ ] Twitter/X post with video demo
- [ ] Monitor: Sentry errors, Render logs, R2 bandwidth, ElevenLabs quota

---

## ONGOING MAINTENANCE CHECKLIST
*Review weekly*

- [ ] ElevenLabs quota < 70%? → pre-emptively upgrade tier
- [ ] R2 bandwidth > $30/mo? → add CDN cache layer
- [ ] Render CPU > 70% sustained? → upgrade to Standard tier
- [ ] Cache efficiency < 85%? → check if system prompt changed unintentionally
  - Formula: `cache_read_tokens / (cache_read_tokens + cache_creation_tokens)`
- [ ] Failed jobs > 2% of total? → investigate pipeline errors in Sentry
- [ ] Pexels 429 errors? → reduce concurrent stock fetches or upgrade Pexels plan
- [ ] TikTok token expired? → force re-OAuth for affected users (notify by email)
- [ ] Monitor churn: users downgrading to free? → survey at downgrade point
- [ ] Review Claude API usage report monthly: Admin API `GET /v1/organizations/cost_report`

---

## REFERENCE: QUICK COST CHECKS

```python
# Check cost of any generation after the fact
usage = response.usage
input_cost  = (usage.input_tokens / 1_000_000) * 3.00
cache_read  = (usage.cache_read_input_tokens / 1_000_000) * 0.30
cache_write = (usage.cache_creation_input_tokens / 1_000_000) * 3.75
output_cost = (usage.output_tokens / 1_000_000) * 15.00
total = input_cost + cache_read + cache_write + output_cost
# Target: total < $0.015 per video blueprint

# Cache health check
cache_efficiency = usage.cache_read_input_tokens / (
    usage.cache_read_input_tokens + usage.cache_creation_input_tokens
)
# Target: > 0.85 — if below, system prompt may have changed
```

---

## DOCUMENT VERSIONS
| Document | Version | Last Updated |
|----------|---------|--------------|
| PRD (01-mmfv-prd.md) | 2.0 | April 2026 |
| Pricing & Costing (02-mmfv-pricing-costing.md) | 2.0 | April 2026 |
| System Requirements (03-mmfv-system-requirements.md) | 2.0 | April 2026 |
| User Flows (04-mmfv-user-flows.md) | 2.0 | April 2026 |
| This Checklist (05-mmfv-claude-code-checklist.md) | 2.0 | April 2026 |
| API Integration Guide (mmfv-api-integration-guide.md) | 1.0 | April 2026 |
| System Design (AI_Faceless_Video_System_Design.docx) | 1.0 | April 2026 |
