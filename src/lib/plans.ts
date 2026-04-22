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
  ctaHref: string
  ctaVariant: 'ghost' | 'filled' | 'teal'
}

export interface FeatureRow {
  label: string
  free: boolean | string
  basic: boolean | string
  pro: boolean | string
  business: boolean | string
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
    features: ['3 videos / month', 'Standard voices', '720p export', 'Pexels stock only'],
    highlighted: false,
    ctaLabel: 'Start Free',
    ctaHref: '/auth/signup',
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
    features: ['30 videos / month', 'All visual types', '1080p export', 'Hindi + English'],
    highlighted: false,
    ctaLabel: 'Choose Basic',
    ctaHref: '/auth/signup',
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
    features: ['150 videos / month', 'AI-generated visuals', 'Dialogue mode', 'Priority render queue'],
    highlighted: true,
    ctaLabel: 'Choose Pro',
    ctaHref: '/auth/signup',
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
    features: ['Unlimited videos', 'API access', 'Custom branding', 'Dedicated support'],
    highlighted: false,
    ctaLabel: 'Contact Us',
    ctaHref: 'mailto:hello@makemyfacelessvideo.com',
    ctaVariant: 'teal',
  },
]

export const FEATURE_MATRIX: FeatureRow[] = [
  { label: 'Videos per month',       free: '3',          basic: '30',         pro: '150',         business: 'Unlimited' },
  { label: 'Video quality',          free: '720p',       basic: '1080p',      pro: '1080p',       business: '4K'        },
  { label: 'Voice languages',        free: 'English',    basic: 'EN + HI',    pro: 'EN + HI',     business: 'EN + HI'   },
  { label: 'Visual sources',         free: 'Pexels',     basic: 'All types',  pro: 'All + AI gen', business: 'All + AI gen' },
  { label: 'Script generation',      free: true,         basic: true,         pro: true,          business: true        },
  { label: 'Voice customisation',    free: 'Standard',   basic: 'Standard',   pro: 'Advanced',    business: 'Advanced'  },
  { label: 'Dialogue mode',          free: false,        basic: false,        pro: true,          business: true        },
  { label: 'AI-generated visuals',   free: false,        basic: false,        pro: true,          business: true        },
  { label: 'Priority render queue',  free: false,        basic: false,        pro: true,          business: true        },
  { label: 'API access',             free: false,        basic: false,        pro: false,         business: true        },
  { label: 'Custom branding',        free: false,        basic: false,        pro: false,         business: true        },
  { label: 'Dedicated support',      free: false,        basic: false,        pro: false,         business: true        },
  { label: 'Team seats',             free: '1',          basic: '1',          pro: '3',           business: 'Unlimited' },
]
