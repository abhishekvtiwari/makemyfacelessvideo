// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase env variables");
  }

  return createClient(url, key);
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) return false;

        const { data: existingUser } = await getSupabase()
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single();

        if (!existingUser) {
          const { error } = await getSupabase().from("users").insert({
            email: user.email,
            name: user.name ?? "",
            avatar_url: user.image ?? "",
            auth_provider: "google",
            plan: "free",
            credits_total: 50,
            credits_used: 0,
            credits_remaining: 50,
          });
          if (error) {
            console.error("[nextauth] create user failed:", error);
            return false;
          }
        } else {
          await getSupabase()
            .from("users")
            .update({ last_login_at: new Date().toISOString() })
            .eq("email", user.email);
        }

        return true;
      } catch (err) {
        console.error("[nextauth] signIn error:", err);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) token.email = user.email;
      return token;
    },

    async session({ session, token }) {
      if (session.user) session.user.email = token.email as string;
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: "/auth",
    error: "/auth",
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
