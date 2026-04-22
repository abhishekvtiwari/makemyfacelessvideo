# /fix-issue — Debugging & Fixing

## Before Touching Any Code

1. **Identify the domain** — auth, payments, generation, database, frontend
2. **Read the relevant rule file**
   - Auth issue → `.claude/rules/security.md`
   - Payment issue → `.claude/rules/api-conventions.md`
   - Database issue → `.claude/rules/database.md`
   - API/route issue → `.claude/rules/api-conventions.md`
   - Type or style issue → `.claude/rules/code-style.md`

3. **Find the exact failure point**
   - Check `video_pipeline` table for generation failures — `breakpoint` column shows exact step
   - Check `admin_alerts` table for logged errors
   - Check `activity_log` for user action trail

## Fix in Isolation

- Touch only the file(s) directly responsible for the bug
- Do not refactor surrounding code while fixing
- Do not add new features while fixing
- If the fix requires a schema change, write the RLS policy at the same time

## Verify the Fix

- [ ] The specific failure case no longer occurs
- [ ] No adjacent functionality broken
- [ ] `npm run type-check` passes if frontend was touched
- [ ] Admin alert still fires correctly on the failure path (don't accidentally swallow errors)

## Razorpay-Specific Debugging

If a payment is stuck:
1. Check `payments` table — `razorpay_payment_id` and `status`
2. Verify signature was checked — look for the HMAC verification log
3. Check `credits_topups` or `subscriptions` — did credits get granted?
4. Never manually update credits without also inserting a `payments` record

## Claude API Debugging

If generation fails:
1. Check `video_pipeline` — which step has an error column set?
2. Check `admin_alerts` for the Claude error message
3. Blueprint validation failures → check JSON schema against `.claude/rules/api-conventions.md`
4. Never bypass post-response validation to make a job succeed
