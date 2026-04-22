'use client'
// src/components/home/HomeLoader.tsx
import dynamic from 'next/dynamic'

const HomeClient = dynamic(() => import('./HomeClient'), { ssr: false })

export default function HomeLoader() {
  return <HomeClient />
}
