# Database — Supabase (PostgreSQL)

## Non-Negotiable Rules

- RLS (Row Level Security) enabled on **every** table — no exceptions
- Service key used only in backend — never exposed to frontend
- Anon key used only in frontend — never in backend service calls
- Every table has `created_at` and `updated_at` timestamps

## RLS Policy Pattern

```sql
-- Users can only read their own rows
CREATE POLICY "users_own_rows" ON table_name
  FOR ALL USING (auth.uid() = user_id);

-- Backend service key bypasses RLS — use only server-side
```

When adding a new table, RLS policy must be written before any data queries are added.

## 3-Layer Usage Tracking Schema

**Layer 1 — Raw events**
```sql
CREATE TABLE usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  job_id uuid REFERENCES videos(id),
  event_type text, -- 'claude_call' | 'tts' | 'render' | 'upload'
  tokens_in int,
  tokens_out int,
  cost_usd numeric(10,6),
  created_at timestamptz DEFAULT now()
);
```

**Layer 2 — Daily aggregates**
```sql
CREATE TABLE daily_stats (
  user_id uuid REFERENCES users(id),
  date date,
  videos_generated int DEFAULT 0,
  tokens_used int DEFAULT 0,
  cost_usd numeric(10,4) DEFAULT 0,
  PRIMARY KEY (user_id, date)
);
```

**Layer 3 — Per-job cost breakdown**
```sql
CREATE TABLE job_costs (
  job_id uuid PRIMARY KEY REFERENCES videos(id),
  claude_cost numeric(10,6) DEFAULT 0,
  tts_cost numeric(10,6) DEFAULT 0,
  storage_cost numeric(10,6) DEFAULT 0,
  total_cost numeric(10,6) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

## Plans Table

Must mirror `src/lib/plans.ts` exactly — keep in sync manually when plans change.

```sql
CREATE TABLE plans (
  id text PRIMARY KEY, -- 'free' | 'starter' | 'growth' | 'influencer' | 'ultra' | 'character_pro'
  display_name text,
  credits_monthly int,
  price_monthly_inr int,   -- paise for Razorpay
  price_annual_inr int,
  features jsonb,
  is_visible bool DEFAULT true -- false for 'free'
);
```

## Core Tables

- `users` — profile, plan, credits_total, credits_used, credits_remaining
- `videos` — generation jobs, status, video_url, thumbnail_url
- `video_pipeline` — step tracker: preflight, claude, tts, stock, render, upload
- `activity_log` — every user action with IP and timestamp
- `subscriptions` — active plan, Razorpay subscription ID, expiry
- `payments` — every transaction, Razorpay payment ID, status
- `plan_changes` — upgrade/downgrade history
- `credits_topups` — extra credits purchased, expire in 90 days
- `admin_alerts` — system failure log with resolved status
- `usage_events` — layer 1 tracking
- `daily_stats` — layer 2 tracking
- `job_costs` — layer 3 tracking

## Key Queries

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
