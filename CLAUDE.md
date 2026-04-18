# CLAUDE.md — MakeMyFacelessVideo.com

## ⚡ Project Overview

MakeMyFacelessVideo.com is an AI-powered faceless video creation platform for YouTube, TikTok and Instagram creators. Users input a topic and get a complete video: script, scenes, voiceover, music, metadata and thumbnail — all automated.

**Live repo:** https://github.com/abhishekvtiwari/makemyfacelessvideo  
**Launch date:** May 1, 2026  
**Stack:** Next.js 14 (App Router) + TypeScript frontend · FastAPI + Python backend · Claude API (Anthropic)

---

## 🎨 Design System — Follow This Exactly

### Theme
- **Always dark background:** `#0A0A0F` base, `#111118` surface, `#1A1A24` elevated surface
- **Never use white backgrounds**
- **Grain/noise texture overlay** on hero sections for depth

### Color Palette
```
--red:      #FF2D55   (primary CTA, active states)
--pink:     #FF375F   (hover states)
--orange:   #FF6B35   (warnings, secondary accents)
--purple:   #BF5AF2   (AI features, Claude-powered badges)
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
background: linear-gradient(135deg, #FF2D55 0%, #BF5AF2 50%, #FF6B35 100%);
box-shadow: 0 0 40px rgba(255,45,85,0.4);
border: 1px solid rgba(255,255,255,0.07);
```

### Typography
- **Display/Headers:** `Bebas Neue` — bold, impactful, all-caps for hero text
- **Body/UI:** `DM Sans` — clean, modern, readable
- **Code/Mono:** `Space Mono` — for technical labels and badges
- Import from Google Fonts in layout.tsx

### Component Style Rules
- Cards: `background: #111118` + `border: 1px solid rgba(255,255,255,0.07)` + `border-radius: 12px`
- Buttons (primary): Red background + white text + red glow shadow
- Buttons (secondary): Transparent + border + white text
- Inputs: Dark background + subtle border + red focus ring
- Error states: `#FF453A` border + subtle red background tint
- Success states: `#30D158` border + subtle green background tint
- Animations: Smooth, purposeful — use `transition: all 0.2s ease`

---

## 🏗️ Project Structure

```
makemyfacelessvideo/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── dashboard/
│   │   │   ├── create/
│   │   │   ├── history/
│   │   │   └── auth/
│   │   │       ├── login/page.tsx
│   │   │       ├── signup/page.tsx
│   │   │       └── verify/page.tsx    ← OTP verification
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   ├── OTPInput.tsx
│   │   │   │   └── GoogleButton.tsx
│   │   │   ├── VideoGenerator/
│   │   │   ├── BlueprintPreview/
│   │   │   └── Navbar/
│   │   ├── hooks/
│   │   │   ├── useStreamGenerate.ts
│   │   │   └── useAuth.ts
│   │   └── lib/
│   │       ├── api.ts
│   │       └── auth.ts
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── claude_client.py
│   ├── routes/
│   │   ├── generate.py
│   │   ├── stream.py
│   │   ├── batch.py
│   │   └── auth.py
│   ├── services/
│   │   ├── tts.py
│   │   ├── stock.py
│   │   ├── renderer.py
│   │   ├── email_service.py           ← Resend.com integration
│   │   └── notification_service.py    ← Admin alert system
│   ├── middleware/
│   │   └── api_monitor.py             ← Pre/post API call checks
│   ├── prompts.py
│   ├── requirements.txt
│   └── .env.example
```

---

## 🔐 Authentication System

### Three Login Methods
1. **Google OAuth** — one-click login via Google account
2. **Email + Password** — traditional signup with bcrypt hashed password
3. **Email OTP** — passwordless login via 6-digit OTP sent via Resend.com

### Auth Flow — Email + Password
```
User enters email + password
→ Backend validates + bcrypt verifies
→ Returns JWT (7 day expiry)
→ Stored in httpOnly cookie only
→ All protected routes verify cookie
```

### Auth Flow — OTP Login
```
User enters email
→ Backend generates 6-digit OTP (expires 10 minutes)
→ Resend.com sends OTP email immediately
→ User enters OTP on /auth/verify page
→ Backend verifies → issues JWT
→ OTP deleted from DB after use (one-time only)
→ Max 3 failed attempts → 15 minute lockout
```

### Auth Flow — Google OAuth
```
User clicks "Continue with Google"
→ Google OAuth consent screen
→ Google returns profile + email
→ Backend creates/finds user account
→ Returns JWT → redirect to dashboard
```

### Auth Endpoints
```python
POST /api/auth/signup           # email + password registration
POST /api/auth/login            # email + password → JWT
POST /api/auth/google           # Google OAuth token → JWT
POST /api/auth/send-otp         # sends 6-digit OTP via Resend
POST /api/auth/verify-otp       # verifies OTP → JWT
POST /api/auth/logout           # invalidates token
GET  /api/auth/me               # current user profile
POST /api/auth/forgot-password  # sends reset link via Resend
POST /api/auth/reset-password   # resets password with token
```

### Security Rules
- JWT stored in **httpOnly cookie only** — NEVER localStorage
- Passwords hashed with **bcrypt, salt rounds: 12**
- OTP: 6 digits, expires 10 min, single use, max 3 attempts
- Password reset links expire in 1 hour
- Login lockout: 5 failed attempts → 15 minute cooldown
- New OTP request cancels and replaces previous OTP

---

## 📧 Email Service — Resend.com

### Setup (backend/services/email_service.py)
```python
import resend
import os

resend.api_key = os.getenv("RESEND_API_KEY")

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
FROM_EMAIL  = os.getenv("FROM_EMAIL")  # noreply@makemyfacelessvideo.com
```

### Four Email Templates Required

**1. OTP Verification**
- Subject: `Your MakeMyFacelessVideo login code: {otp}`
- Content: Large OTP display, expires in 10 minutes, brand styling

**2. Welcome Email**
- Sent after successful signup
- Content: what they can do, plan details, getting started CTA

**3. Password Reset**
- Subject: `Reset your MakeMyFacelessVideo password`
- Content: Reset link (expires 1 hour), security warning if not requested

**4. Admin Failure Alert**
- Subject: `[MMFV Alert] {severity} {error_type} — {timestamp}`
- Content: Full error details, user ID, timestamp, raw error

---

## 🚨 API Monitoring + Admin Notification System

### Pre-Flight Checks (Run BEFORE every Claude API call)
```python
# backend/middleware/api_monitor.py

async def pre_flight_check(topic, platform, user_id):
    checks = {
        "api_key_present":    bool(os.getenv("ANTHROPIC_API_KEY")),
        "topic_valid":        len(topic.strip()) >= 10,
        "user_exists":        await verify_user(user_id),
        "user_has_credits":   await check_user_credits(user_id),
        "token_estimate_ok":  await estimate_tokens(topic) < 8000,
        "rate_limit_ok":      await check_rate_limit(user_id),
    }
    failed = [k for k, v in checks.items() if not v]
    if failed:
        await notify_admin(error_type="PRE_FLIGHT_FAILED",
                           failed_checks=failed, user_id=user_id)
        raise HTTPException(400, detail=f"Pre-flight failed: {failed}")
```

### Post-Response Checks (Run AFTER every Claude API call)
```python
async def post_response_check(blueprint, user_id, duration_ms):
    checks = {
        "has_title":       bool(blueprint.get("title")),
        "has_script":      bool(blueprint.get("script")),
        "has_scenes":      len(blueprint.get("scenes", [])) >= 3,
        "has_voiceover":   len(blueprint.get("voiceover_segments", [])) >= 1,
        "has_metadata":    bool(blueprint.get("metadata")),
        "fast_enough":     duration_ms < 30000,
    }
    failed = [k for k, v in checks.items() if not v]
    if failed:
        await notify_admin(error_type="POST_RESPONSE_INVALID",
                           failed_checks=failed, user_id=user_id,
                           duration_ms=duration_ms)
```

### Admin Alert Triggers — Every Single One

| Event | Severity |
|-------|----------|
| Claude API call exception | 🔴 Critical |
| Pre-flight check failed | 🟡 Warning |
| Invalid JSON from Claude | 🔴 Critical |
| ElevenLabs TTS fails | 🟡 Warning |
| Pexels API rate limited | 🟡 Warning |
| Video render fails (FFmpeg) | 🔴 Critical |
| User signup fails | 🟡 Warning |
| OTP failed 3 times | 🟡 Warning |
| Payment fails | 🔴 Critical |
| R2 upload fails | 🔴 Critical |
| Response time > 30 seconds | 🟡 Warning |
| JWT secret missing on startup | 🔴 Critical |

### Admin Alert Email Format
```python
async def notify_admin(error_type, user_id=None, **details):
    severity = "🔴 CRITICAL" if is_critical(error_type) else "🟡 WARNING"
    timestamp = datetime.utcnow().isoformat()

    resend.Emails.send({
        "from": FROM_EMAIL,
        "to": ADMIN_EMAIL,
        "subject": f"[MMFV] {severity} {error_type} — {timestamp[:10]}",
        "html": f"""
            <h2>{severity}: {error_type}</h2>
            <p><b>Time:</b> {timestamp} UTC</p>
            <p><b>User:</b> {user_id or 'anonymous'}</p>
            <hr>
            <pre>{json.dumps(details, indent=2)}</pre>
        """
    })
```

### Rate Limiting Rules
- Per user: max 10 video generations per hour
- Per IP: max 20 requests per 15 minutes
- OTP requests: max 3 per email per hour
- Login failures: max 5 before 15-minute lockout

---

## 🤖 Claude API Integration

### Core Principle: One Call, Total Blueprint
**NEVER make multiple sequential Claude API calls.** One call returns everything.

### Model Routing
- **Creative tasks** → `claude-sonnet-4-6`
- **Simple tasks** (hashtags, titles) → `claude-haiku-4-5-20251001`

### Prompt Caching (Always)
```python
system=[{"type": "text", "text": SYSTEM_PROMPT,
         "cache_control": {"type": "ephemeral"}}]
```

### Full Generation Function
```python
async def generate_video_blueprint(topic, platform, user_id):
    start = time.time()
    await pre_flight_check(topic, platform, user_id)   # check first
    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            system=[{"type":"text","text":SYSTEM_PROMPT,
                     "cache_control":{"type":"ephemeral"}}],
            messages=[{"role":"user","content":build_prompt(topic,platform)}]
        )
        duration_ms = int((time.time() - start) * 1000)
        blueprint = json.loads(response.content[0].text)
        await post_response_check(blueprint, user_id, duration_ms)  # verify
        return blueprint
    except Exception as e:
        await notify_admin("CLAUDE_API_EXCEPTION", user_id=user_id,
                           error=str(e), topic=topic)
        raise
```

---

## 💳 Payment Plans

| Plan     | INR/mo  | USD/mo | Videos/mo |
|----------|---------|--------|-----------|
| Free     | ₹0      | $0     | 3         |
| Basic    | ₹299    | $5     | 30        |
| Pro      | ₹999    | $15    | 150       |
| Business | ₹4,999  | $59    | Unlimited |

- India: Razorpay · International: Stripe
- Every payment failure → immediate admin alert via Resend

---

## ☁️ Deployment

| Service  | Provider      | Config |
|----------|--------------|--------|
| Frontend | Vercel        | Root: frontend/ |
| Backend  | Render        | Root: backend/ · Build: `apt-get install -y ffmpeg && pip install -r requirements.txt` |
| Storage  | Cloudflare R2 | Bucket: yt-videos |

---

## 🔑 Environment Variables

**backend/.env:**
```
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=minimum-32-char-random-string
APP_ENV=production
FRONTEND_URL=https://makemyfacelessvideo.com

RESEND_API_KEY=re_...
ADMIN_EMAIL=your@email.com
FROM_EMAIL=noreply@makemyfacelessvideo.com

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

ELEVENLABS_API_KEY=...
PEXELS_API_KEY=...
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

**frontend/.env.local:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
```

---

## ✅ Coding Rules — Always Follow

1. Show full file path as a comment at top of every file
2. TypeScript only on frontend — no plain .js files
3. No inline styles — Tailwind classes or CSS variables only
4. One responsibility per component — keep them small
5. Never hardcode API keys — environment variables only
6. Mobile first — all layouts work at 375px width
7. Every async action needs a loading state
8. Every API call needs try/catch with user-facing error message
9. Every API failure must trigger `notify_admin()` via Resend
10. JWT in httpOnly cookie only — never localStorage
11. Always hash passwords with bcrypt before storing
12. OTP expires server-side after 10 minutes — always enforce
13. Commit format: `feat:` `fix:` `style:` `chore:` `docs:`

---

## 🚫 Never Do This

- Never use white or light backgrounds
- Never use Inter, Roboto, or Arial fonts
- Never make multiple Claude API calls for one video
- Never push .env files to GitHub
- Never store JWT in localStorage or sessionStorage
- Never log or store passwords in plain text
- Never skip admin notification on API failures
- Never send OTP in API response body — email only
- Never skip post-response validation of Claude output

---

## 🎯 Build Priority Order

1. **Auth system** — Google + Email/Password + OTP with Resend emails
2. **API monitoring** — pre/post checks + admin alert emails
3. **Homepage** — animated hero + email capture
4. **Video creation form** — topic input + selectors
5. **Blueprint preview** — script, scenes, metadata display
6. **Dashboard** — history, usage counter, plan badge
7. **Payment flow** — Razorpay + Stripe

---

*Last updated: April 2026 · Claude API (Anthropic) · Emails via Resend.com*
