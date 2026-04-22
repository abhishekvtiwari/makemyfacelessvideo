// src/app/layout.tsx
import type { Metadata } from 'next'
import { Fraunces, Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import SessionWrapper from '@/components/SessionWrapper'

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz', 'SOFT', 'WONK'],
})

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MakeMyFacelessVideo — AI Faceless Video Creator',
  description:
    'Create YouTube, TikTok & Instagram faceless videos with AI. Script, voice, visuals — fully automated.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body id="app" className="min-h-full">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  )
}
