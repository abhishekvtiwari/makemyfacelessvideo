// src/lib/plans.ts
export type PlanId = 'free' | 'basic' | 'pro' | 'business'

export interface Plan {
  id: PlanId
  name: string
  tagline: string
  priceINR: number
  priceUSD: number
  priceINRYearly: number
  priceUSDYearly: number
  videosPerMonth: number | 'unlimited'
  features: string[]
  highlighted: boolean
  ctaLabel: string
  ctaVariant: 'ghost' | 'filled' | 'teal'
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'FREE',
    tagline: 'Kick the tyres',
    priceINR: 0,
    priceUSD: 0,
    priceINRYearly: 0,
    priceUSDYearly: 0,
    videosPerMonth: 3,
    features: [
      '3 videos / month',
      'Standard voices',
      '720p export',
      'Pexels stock only',
    ],
    highlighted: false,
    ctaLabel: 'Start Free',
    ctaVariant: 'ghost',
  },
  {
    id: 'basic',
    name: 'BASIC',
    tagline: 'Getting serious',
    priceINR: 299,
    priceUSD: 5,
    priceINRYearly: 2390,
    priceUSDYearly: 40,
    videosPerMonth: 30,
    features: [
      '30 videos / month',
      'All visual types',
      '1080p export',
      'Hindi + English',
    ],
    highlighted: false,
    ctaLabel: 'Choose Basic',
    ctaVariant: 'ghost',
  },
  {
    id: 'pro',
    name: 'PRO',
    tagline: 'Most Popular',
    priceINR: 999,
    priceUSD: 15,
    priceINRYearly: 7990,
    priceUSDYearly: 120,
    videosPerMonth: 150,
    features: [
      '150 videos / month',
      'AI-generated visuals',
      'Dialogue mode',
      'Priority render queue',
    ],
    highlighted: true,
    ctaLabel: 'Choose Pro',
    ctaVariant: 'filled',
  },
  {
    id: 'business',
    name: 'BUSINESS',
    tagline: 'Scale it',
    priceINR: 4999,
    priceUSD: 59,
    priceINRYearly: 39990,
    priceUSDYearly: 470,
    videosPerMonth: 'unlimited',
    features: [
      'Unlimited videos',
      'API access',
      'Custom branding',
      'Dedicated support',
    ],
    highlighted: false,
    ctaLabel: 'Contact Us',
    ctaVariant: 'teal',
  },
]
