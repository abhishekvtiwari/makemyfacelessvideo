# /new-feature — Adding a New Feature

Follow this checklist in order. Do not skip steps.

## Checklist

1. **Read the relevant rule file first**
   - Backend route? Read `.claude/rules/api-conventions.md`
   - Database change? Read `.claude/rules/database.md`
   - Payment related? Read `.claude/rules/api-conventions.md` (Razorpay section)
   - Security sensitive? Read `.claude/rules/security.md`

2. **Define the data shape**
   - Add Pydantic model in backend
   - Add TypeScript interface in `src/lib/` or the relevant component file
   - If plan-gated: update `src/lib/plans.ts` first

3. **Backend — in order**
   - Add service function in `backend/services/`
   - Add route in `backend/routes/`
   - Register router in `backend/main.py` if new file
   - Add RLS policy to Supabase table if new table or new access pattern
   - Add admin alert via `notify_admin()` on any failure path

4. **Frontend — in order**
   - Add API call wrapper in `src/lib/api.ts`
   - Build component in `src/components/`
   - Wire into page in `src/app/`
   - Add loading state + error display

5. **Update plans.ts if needed**
   - If the feature is plan-gated, add the flag to `src/lib/plans.ts`
   - Verify the `plans` Supabase table mirrors the change

6. **Verify before marking done**
   - [ ] TypeScript: `npm run type-check` passes
   - [ ] No hardcoded secrets or plan limits
   - [ ] RLS policy exists for any new Supabase access
   - [ ] Admin alert fires on all failure paths
   - [ ] Mobile layout works at 375px
