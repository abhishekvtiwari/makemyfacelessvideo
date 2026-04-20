// src/lib/auth-options.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import { getOTP, deleteOTP, incrementAttempts } from "@/lib/otp-store";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function upsertUser(email: string, name: string, avatarUrl?: string, authProvider = "email") {
  const supabase = getSupabase();
  if (!supabase) return null;

  // Check if user exists
  const { data: existing } = await supabase
    .from("users")
    .select("id, name, email, plan, credits_remaining, credits_total")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("email", email);
    return existing;
  }

  // Create new user
  const { data: created, error } = await supabase
    .from("users")
    .insert({
      email,
      name: name || email.split("@")[0],
      avatar_url: avatarUrl ?? "",
      auth_provider: authProvider,
      plan: "free",
      credits_total: 50,
      credits_used: 0,
      credits_remaining: 50,
    })
    .select("id, name, email, plan, credits_remaining, credits_total")
    .single();

  if (error) {
    console.error("[auth] upsertUser failed:", error.message);
    return null;
  }
  return created;
}

export const authOptions: NextAuthOptions = {
  providers: [
    // ── Google OAuth ──────────────────────────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { prompt: "consent", access_type: "offline", response_type: "code" },
      },
    }),

    // ── Email OTP ─────────────────────────────────────────────────────────────
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code:  { label: "Code",  type: "text"  },
      },
      async authorize(credentials) {
        const email = (credentials?.email ?? "").trim().toLowerCase();
        const code  = (credentials?.code  ?? "").trim();

        if (!email || !code) return null;

        const record = await getOTP(email);
        if (!record) return null;

        // Expired
        if (Date.now() > record.expiresAt) {
          await deleteOTP(email);
          return null;
        }

        // Too many attempts
        if (record.attempts >= 3) {
          await deleteOTP(email);
          return null;
        }

        await incrementAttempts(email);

        if (record.code !== code) return null;

        await deleteOTP(email);

        // Upsert user — don't block sign-in on DB failure
        const dbUser = await upsertUser(email, email.split("@")[0]).catch(() => null);

        return {
          id:    dbUser?.id    ?? email,
          email,
          name:  dbUser?.name  ?? email.split("@")[0],
          image: null,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    // ── signIn: NEVER block on DB errors — user is authenticated, DB is secondary ──
    async signIn({ user, account }) {
      if (!user.email) return false;
      // For Google OAuth, upsert the user — but don't block login on failure
      if (account?.provider === "google") {
        try {
          await upsertUser(user.email, user.name ?? "", user.image ?? "", "google");
        } catch (err) {
          console.error("[auth] Google upsert failed (non-blocking):", err);
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id      = user.id;
        token.email   = user.email;
        token.name    = user.name;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email  as string;
        session.user.name  = token.name   as string;
        session.user.image = token.picture as string | null | undefined;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/"))     return `${baseUrl}${url}`;
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: "/auth",
    error:  "/auth",
  },

  debug: process.env.NODE_ENV === "development",
};
