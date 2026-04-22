# /review — Code Review Checklist

Run this review against any file before merging.

## Security

- [ ] No secrets or API keys hardcoded — all via `os.getenv()` or `process.env`
- [ ] JWT read from httpOnly cookie only — no Authorization header, no localStorage
- [ ] User input sanitized with bleach (backend) before use or storage
- [ ] Razorpay signature verified before any credit grant or status update
- [ ] R2 assets served via signed URLs — no public bucket URLs
- [ ] Passwords hashed with bcrypt (12 rounds) — never stored plain

## RLS & Database

- [ ] Every new Supabase table has RLS enabled
- [ ] Every new query has a corresponding RLS policy
- [ ] Service key used only in backend — never in frontend code
- [ ] Plan limits read from `plans` table or `src/lib/plans.ts` — never hardcoded

## Modularity

- [ ] File has one responsibility — no mixed concerns
- [ ] Route file only validates + calls service — no business logic inline
- [ ] No copy-pasted logic that should be a shared utility
- [ ] Component does not fetch data directly — uses a hook or passes props

## Code Style

- [ ] TypeScript: no `any`, no unchecked type assertions
- [ ] CSS: no hardcoded hex colors — all via CSS custom properties
- [ ] Python: all functions have type hints
- [ ] No inline styles in TSX except `var(--token)` references
- [ ] Chart.js colors read via `requestAnimationFrame` — not hardcoded

## Error Handling

- [ ] Every async operation has try/catch
- [ ] Typed error classes used — no raw string throws
- [ ] `notify_admin()` called on all failure paths that affect users
- [ ] No jobs can get stuck in `processing` — timeout guard exists
- [ ] Frontend shows a user-facing error message on every API failure

## Claude API (if applicable)

- [ ] System prompt has `cache_control: ephemeral`
- [ ] Single API call for the full blueprint — no sequential calls
- [ ] Post-response validation runs before using the blueprint
- [ ] Model is `claude-sonnet-4-6` for creative, `claude-haiku-4-5-20251001` for simple
