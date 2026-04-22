# API Conventions

## FastAPI Route Structure

```
backend/
  routes/
    auth.py        # /api/auth/*
    generate.py    # /api/generate/*
    stream.py      # /api/stream/*
    payments.py    # /api/payments/*
    dashboard.py   # /api/dashboard/*
    admin.py       # /api/admin/*
  services/        # business logic — imported by routes
  middleware/      # auth guard, rate limiter, api_monitor
```

- Each route file handles one domain — never mix auth logic into generate routes
- Business logic lives in `services/` — routes only validate input and call services
- Every route is async — no blocking calls in route handlers
- Every route has a typed Pydantic request/response model

## Route Template

```python
# backend/routes/example.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from services.example_service import do_thing
from middleware.auth import require_auth

router = APIRouter(prefix="/api/example", tags=["example"])

class ExampleRequest(BaseModel):
    field: str

class ExampleResponse(BaseModel):
    result: str

@router.post("/action", response_model=ExampleResponse)
async def action(body: ExampleRequest, user=Depends(require_auth)):
    return await do_thing(body, user)
```

## Payments — Razorpay ONLY

- Never use Stripe, PayPal, or any other processor
- Order creation: `POST /api/payments/create-order` → returns Razorpay order_id
- Verification: `POST /api/payments/verify` → checks HMAC-SHA256 signature
- Always verify signature before updating Supabase credits
- Payment failure → insert into `payments` table with `status=failed` + SES admin alert

```python
import hmac, hashlib

def verify_razorpay_signature(order_id: str, payment_id: str, signature: str) -> bool:
    key = os.getenv("RAZORPAY_KEY_SECRET").encode()
    msg = f"{order_id}|{payment_id}".encode()
    expected = hmac.new(key, msg, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)
```

## 3-Layer Usage Tracking

Every video generation writes to all three layers atomically:

**Layer 1 — `usage_events`** (raw event log)
```sql
INSERT INTO usage_events (user_id, job_id, event_type, tokens_in, tokens_out, cost_usd, created_at)
```

**Layer 2 — `daily_stats`** (per-user daily aggregates — upsert)
```sql
INSERT INTO daily_stats (user_id, date, videos_generated, tokens_used, cost_usd)
ON CONFLICT (user_id, date) DO UPDATE SET ...
```

**Layer 3 — `job_costs`** (per-job breakdown for billing audit)
```sql
INSERT INTO job_costs (job_id, claude_cost, tts_cost, storage_cost, total_cost)
```

## JWT Rules

- Issue JWT as httpOnly cookie, sameSite=lax, secure=True in production
- Never return JWT in response body
- Cookie name: `mmfv_token`
- Expiry: 7 days
- Refresh: silent refresh if token expires within 24 hours of expiry

```python
response.set_cookie(
    key="mmfv_token",
    value=token,
    httponly=True,
    samesite="lax",
    secure=os.getenv("APP_ENV") == "production",
    max_age=60 * 60 * 24 * 7,
)
```
