'use client'
// src/components/pricing/PricingLoader.tsx
import dynamic from 'next/dynamic'

const PricingClient = dynamic(() => import('./PricingClient'), { ssr: false })

export default function PricingLoader() {
  return <PricingClient />
}
