// src/lib/plans.ts
export type PlanId = 'starter' | 'growth' | 'pro' | 'business' | 'enterprise'

export interface Plan {
  id: PlanId
  name: string
  tagline: string
  priceUSD: number
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
  starter: boolean | string
  growth: boolean | string
  pro: boolean | string
  business: boolean | string
  enterprise: boolean | string
}

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'STARTER',
    tagline: 'Get started',
    priceUSD: 19,
    priceUSDYearly: 190,
    videosPerMonth: 20,
    features: ['20 videos / month', '1080p export', 'Standard voices', 'Pexels stock'],
    highlighted: false,
    ctaLabel: 'Get Starter',
    ctaHref: '/auth/signup?plan=starter',
    ctaVariant: 'ghost',
  },
  {
    id: 'growth',
    name: 'GROWTH',
    tagline: 'Growing channels',
    priceUSD: 29,
    priceUSDYearly: 290,
    videosPerMonth: 60,
    features: ['60 videos / month', '1080p export', 'All visual sources', 'Dialogue mode'],
    highlighted: false,
    ctaLabel: 'Get Growth',
    ctaHref: '/auth/signup?plan=growth',
    ctaVariant: 'ghost',
  },
  {
    id: 'pro',
    name: 'PRO',
    tagline: 'Most Popular',
    priceUSD: 49,
    priceUSDYearly: 490,
    videosPerMonth: 150,
    features: ['150 videos / month', '1080p export', 'AI-generated visuals', 'Priority render queue'],
    highlighted: true,
    ctaLabel: 'Get Pro',
    ctaHref: '/auth/signup?plan=pro',
    ctaVariant: 'filled',
  },
  {
    id: 'business',
    name: 'BUSINESS',
    tagline: 'Scale your brand',
    priceUSD: 99,
    priceUSDYearly: 990,
    videosPerMonth: 500,
    features: ['500 videos / month', '4K export', 'API access', 'Custom branding'],
    highlighted: false,
    ctaLabel: 'Get Business',
    ctaHref: '/auth/signup?plan=business',
    ctaVariant: 'ghost',
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE',
    tagline: 'Unlimited scale',
    priceUSD: 149,
    priceUSDYearly: 1490,
    videosPerMonth: 'unlimited',
    features: ['Unlimited videos', '4K export', 'Dedicated support', 'Unlimited team seats'],
    highlighted: false,
    ctaLabel: 'Get Enterprise',
    ctaHref: '/auth/signup?plan=enterprise',
    ctaVariant: 'teal',
  },
]

export const FEATURE_MATRIX: FeatureRow[] = [
  { label: 'Videos per month',      starter: '20',        growth: '60',         pro: '150',          business: '500',         enterprise: 'Unlimited'  },
  { label: 'Video quality',         starter: '1080p',     growth: '1080p',      pro: '1080p',         business: '4K',          enterprise: '4K'         },
  { label: 'Voice languages',       starter: 'English',   growth: 'EN + HI',    pro: 'EN + HI',       business: '5 languages', enterprise: 'All'        },
  { label: 'Visual sources',        starter: 'Pexels',    growth: 'All types',  pro: 'All + AI gen',  business: 'All + AI gen',enterprise: 'All + AI gen'},
  { label: 'Script generation',     starter: true,        growth: true,         pro: true,            business: true,          enterprise: true         },
  { label: 'Voice customisation',   starter: 'Standard',  growth: 'Standard',   pro: 'Advanced',      business: 'Advanced',    enterprise: 'Advanced'   },
  { label: 'Dialogue mode',         starter: false,       growth: true,         pro: true,            business: true,          enterprise: true         },
  { label: 'AI-generated visuals',  starter: false,       growth: true,         pro: true,            business: true,          enterprise: true         },
  { label: 'Priority render queue', starter: false,       growth: false,        pro: true,            business: true,          enterprise: true         },
  { label: 'API access',            starter: false,       growth: false,        pro: false,           business: true,          enterprise: true         },
  { label: 'Custom branding',       starter: false,       growth: false,        pro: false,           business: true,          enterprise: true         },
  { label: 'Dedicated support',     starter: false,       growth: false,        pro: false,           business: false,         enterprise: true         },
  { label: 'Team seats',            starter: '1',         growth: '1',          pro: '3',             business: '10',          enterprise: 'Unlimited'  },
]
