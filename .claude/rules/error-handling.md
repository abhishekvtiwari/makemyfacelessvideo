# Error Handling

## Typed Errors

All errors must be typed — never throw raw strings.

```python
# backend/errors.py
class AppError(Exception):
    def __init__(self, code: str, message: str, status: int = 400):
        self.code = code
        self.message = message
        self.status = status

class InsufficientCreditsError(AppError):
    def __init__(self):
        super().__init__("INSUFFICIENT_CREDITS", "Not enough credits", 402)

class ClaudeAPIError(AppError):
    def __init__(self, detail: str):
        super().__init__("CLAUDE_API_ERROR", f"AI generation failed: {detail}", 502)
```

```typescript
// src/lib/errors.ts
export type AppErrorCode =
  | 'INSUFFICIENT_CREDITS'
  | 'CLAUDE_API_ERROR'
  | 'PAYMENT_FAILED'
  | 'INVALID_BLUEPRINT'
  | 'JOB_STUCK'

export interface ApiError {
  code: AppErrorCode
  message: string
}
```

## Claude API Error Handling with Retry

```python
import anthropic
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
async def call_claude(prompt: str, user_id: str) -> dict:
    try:
        response = await client.messages.create(...)
        blueprint = parse_and_validate_blueprint(response.content[0].text)
        return blueprint
    except anthropic.RateLimitError:
        raise  # tenacity will retry
    except anthropic.APIError as e:
        await notify_admin("Claude API error", str(e), severity="critical")
        raise ClaudeAPIError(str(e))
    except json.JSONDecodeError as e:
        await notify_admin("Invalid JSON from Claude", str(e), severity="critical")
        raise ClaudeAPIError("Invalid JSON blueprint")
```

Always validate blueprint after parsing — check title, script, scenes ≥3, voiceover ≥1, metadata present.

## Razorpay Signature Verification

Never grant credits without verifying the signature first.

```python
async def verify_payment(order_id: str, payment_id: str, signature: str, user_id: str):
    if not verify_razorpay_signature(order_id, payment_id, signature):
        await notify_admin("Razorpay signature mismatch", f"user={user_id}", severity="critical")
        raise AppError("PAYMENT_VERIFICATION_FAILED", "Payment verification failed", 400)

    # Only after verification succeeds
    await grant_credits(user_id, plan)
    await insert_payment_record(user_id, payment_id, status="success")
```

## Never Leave Jobs Stuck in Processing

Every video job must have a timeout guard. If a job stays in `processing` for >5 minutes, mark it `failed`.

```python
# Run as a background task or cron
async def unstick_jobs():
    stuck = await supabase.table("videos") \
        .select("id") \
        .eq("status", "processing") \
        .lt("created_at", datetime.utcnow() - timedelta(minutes=5)) \
        .execute()

    for job in stuck.data:
        await supabase.table("videos").update({"status": "failed"}).eq("id", job["id"]).execute()
        await notify_admin("Job stuck in processing", f"job_id={job['id']}", severity="warning")
```

## Frontend Error Display

Every API call must display a user-facing error — never silently fail.

```tsx
try {
  const result = await generateVideo(input)
  setJob(result)
} catch (err) {
  const error = err as ApiError
  setError(error.message ?? 'Something went wrong. Please try again.')
}
```
