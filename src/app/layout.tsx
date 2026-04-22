// src/app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"
import SessionWrapper from "@/components/SessionWrapper"

export const metadata: Metadata = {
  title: "MakeMyFacelessVideo — AI Faceless Video Creator",
  description:
    "Create YouTube, TikTok & Instagram faceless videos with AI. Script, voice, visuals — fully automated.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body id="app" style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <SessionWrapper>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}
