// src/app/layout.tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"
import SessionWrapper from "@/components/SessionWrapper"
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider"
import { ScrollProgress } from "@/components/ui/ScrollProgress"

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MakeMyFacelessVideo — AI Faceless Video Creator",
  description:
    "Create YouTube, TikTok & Instagram faceless videos with AI. Script, voice, visuals — fully automated.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body id="app" className="min-h-full">
        <SessionWrapper>
          <AuthProvider>
            <SmoothScrollProvider>
              <ScrollProgress />
              {children}
            </SmoothScrollProvider>
          </AuthProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}
