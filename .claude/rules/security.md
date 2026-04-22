# Security

## JWT Cookie Rules

- Cookie name: `mmfv_token`
- Always httpOnly — JavaScript must never read it
- sameSite: lax — allows cross-site navigation, blocks CSRF for mutations
- secure: True in production, False in local dev only
- Never return the token value in a JSON response body
- Never accept a token from an Authorization header — cookie only

```python
response.set_cookie(
    key="mmfv_token",
    value=token,
    httponly=True,
    samesite="lax",
    secure=os.getenv("APP_ENV") == "production",
    max_age=60 * 60 * 24 * 7,
    path="/",
)
```

On logout, immediately expire the cookie:
```python
response.delete_cookie(key="mmfv_token", httponly=True, samesite="lax")
```

## Input Validation

- All user inputs validated with Pydantic on the backend — frontend validation is UX only
- Topic minimum 10 characters, maximum 500
- No HTML or script tags allowed in user text fields — strip on ingest
- Email: validate format + lowercase before storing
- OTP: 6 digits only, server-side expiry 10 min, max 3 attempts before lockout

```python
from pydantic import BaseModel, validator
import bleach

class VideoInput(BaseModel):
    topic: str
    platform: str

    @validator('topic')
    def sanitize_topic(cls, v):
        return bleach.clean(v.strip(), tags=[], strip=True)
```

## R2 Signed URLs

Never serve R2 assets via a public URL — always use signed URLs with expiry.

```python
import boto3

def get_signed_url(key: str, expires_in: int = 3600) -> str:
    s3 = boto3.client(
        "s3",
        endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
    )
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": R2_BUCKET, "Key": key},
        ExpiresIn=expires_in,
    )
```

Default expiry: 1 hour for video playback, 10 minutes for thumbnail display.

## Never Expose Secrets to Frontend

- `SUPABASE_SERVICE_KEY` — backend only, never in `NEXT_PUBLIC_*`
- `RAZORPAY_KEY_SECRET` — backend only
- `ANTHROPIC_API_KEY` — backend only
- `ELEVENLABS_API_KEY` — backend only
- `AWS_SECRET_ACCESS_KEY` — backend only
- `R2_SECRET_ACCESS_KEY` — backend only

Allowed in `NEXT_PUBLIC_*`: Supabase anon key, Razorpay key_id (public), Google OAuth client_id.

## Password Storage

- bcrypt with 12 salt rounds — never MD5, SHA1, or plain
- Never log passwords, OTPs, or JWT values

## Login Lockout

5 failed login attempts → 15 minute cooldown tracked in Redis or Supabase `activity_log`.
