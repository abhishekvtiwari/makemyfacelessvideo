# Code Style

## TypeScript

- Strict mode always — `"strict": true` in tsconfig.json
- No `any` — ever. Use `unknown` and narrow, or define a proper type
- No type assertions (`as X`) unless unavoidable — add a comment explaining why
- All async functions return typed Promises
- Prefer `interface` for object shapes, `type` for unions/intersections

```typescript
// Good
interface VideoJob {
  id: string
  status: 'queued' | 'processing' | 'done' | 'failed'
  userId: string
}

// Bad
const job: any = { ... }
```

## CSS & Theming

- All colors via CSS custom properties — never hardcoded hex in components
- Theme applied via `data-theme="dark"` on `#app` — no per-component dark overrides
- Use Tailwind for layout/spacing, CSS variables for brand colors

```css
/* globals.css — only place tokens are defined */
[data-theme="dark"] {
  --bg: #060C1C;
  --surface: #0D1426;
  --elevated: #131D30;
  --violet: #5B47F5;
  --teal: #0D9488;
  --text: #E2E8F0;
  --muted: #64748B;
  --border: rgba(255,255,255,0.06);
}
```

```tsx
// Component — uses token, not hardcoded color
<div style={{ background: 'var(--surface)' }}>
```

## Chart.js Colors

Always read CSS variables via `requestAnimationFrame` to avoid flash:

```tsx
useEffect(() => {
  requestAnimationFrame(() => {
    const style = getComputedStyle(document.documentElement)
    const violet = style.getPropertyValue('--violet').trim()
    const teal = style.getPropertyValue('--teal').trim()
    setChartColors({ violet, teal })
  })
}, [])
```

Never hardcode `#5B47F5` or `#0D9488` in chart config — always read from CSS.

## Python Style

- Type hints on all function signatures — parameters and return types
- Async everywhere — no blocking I/O in route handlers or services
- f-strings for string formatting — never `%` or `.format()`
- Pydantic models for all request/response/config shapes
- No bare `except:` — always catch specific exception types

```python
# Good
async def get_user_credits(user_id: str) -> int:
    result = await supabase.table("users").select("credits_remaining").eq("id", user_id).single().execute()
    return result.data["credits_remaining"]

# Bad
def get_credits(uid):
    try:
        ...
    except:
        pass
```

## Comments

- Write comments only when the WHY is non-obvious
- Never describe what the code does — name it well instead
- One line max — no multi-paragraph docstrings
