// src/app/pricing/page.tsx
import type { Metadata } from 'next'
import PricingLoader from '@/components/pricing/PricingLoader'

export const metadata: Metadata = {
  title: 'Pricing — MakeMyFacelessVideo',
  description: 'Simple, transparent pricing for AI faceless video creation. Start free, upgrade when ready.',
}

export default function PricingPage() {
  return <PricingLoader />
}
