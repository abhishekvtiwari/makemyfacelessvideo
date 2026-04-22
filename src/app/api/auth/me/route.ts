// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server"
import jwt, { JwtPayload } from "jsonwebtoken"
import { createServerClient } from "@/lib/supabase"

interface TokenPayload extends JwtPayload {
  userId: string
  email: string
  plan: string
}

function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("mmfv_token")?.value
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 })
  }

  try {
    const supabase = createServerClient()
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, plan, videos_used_this_month")
      .eq("id", payload.userId)
      .maybeSingle()

    if (error || !user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        plan: user.plan,
        videosUsed: user.videos_used_this_month ?? 0,
      },
    })
  } catch (err) {
    console.error("[me]", err)
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}
