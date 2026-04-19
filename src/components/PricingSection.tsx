// src/components/PricingSection.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Billing = "monthly" | "annual";

interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualTotal: number;
  annualMonthly: number;
  annualSaving: number;
  credits: string;
  badge?: string;
  badgeVariant?: "green" | "purple" | "gold";
  highlighted?: boolean;
  goldGlow?: boolean;
  primaryCta?: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "STARTER",
    tagline: "Launch your faceless channel",
    monthlyPrice: 19.99,
    annualTotal: 199,
    annualMonthly: 16.58,
    annualSaving: 41,
    credits: "500",
    badge: "BEST FOR STARTING OUT",
    badgeVariant: "green",
    features: [
      "500 Credits/month",
      "Unlimited Series",
      "Auto-Post Videos",
      "Voiceovers & AI Content",
      "Scripts & Hooks",
      "Music, Effects & Captions",
      "Download Videos",
      "Unlimited Exports & Templates",
      "3 Team Members",
      "Premium Live Chat",
    ],
  },
  {
    id: "growth",
    name: "GROWTH",
    tagline: "Scale with AI automation",
    monthlyPrice: 29.99,
    annualTotal: 299,
    annualMonthly: 24.92,
    annualSaving: 61,
    credits: "1,000",
    badge: "MOST POPULAR",
    badgeVariant: "purple",
    highlighted: true,
    primaryCta: true,
    features: [
      "1,000 Credits/month",
      "Everything in Starter",
      "AI Agent",
      "UGC Video",
      "5 Team Members",
    ],
  },
  {
    id: "influencer",
    name: "INFLUENCER",
    tagline: "For serious content creators",
    monthlyPrice: 59.99,
    annualTotal: 599,
    annualMonthly: 49.92,
    annualSaving: 121,
    credits: "2,000",
    features: [
      "2,000 Credits/month",
      "Everything in Growth",
      "7 Team Members",
    ],
  },
  {
    id: "ultra",
    name: "ULTRA",
    tagline: "Power user & agency grade",
    monthlyPrice: 89.99,
    annualTotal: 899,
    annualMonthly: 74.92,
    annualSaving: 181,
    credits: "5,000",
    features: [
      "5,000 Credits/month",
      "Everything in Influencer",
      "API Access",
      "First Access to New Features",
      "10 Team Members",
      "Premium Support + Call",
    ],
  },
  {
    id: "character_pro",
    name: "CHARACTER PRO",
    tagline: "Unlimited character system",
    monthlyPrice: 129,
    annualTotal: 1290,
    annualMonthly: 107.5,
    annualSaving: 258,
    credits: "10,000",
    badge: "ADVANCED CHARACTER SYSTEM",
    badgeVariant: "gold",
    goldGlow: true,
    primaryCta: true,
    features: [
      "10,000 Credits/month",
      "Everything in Ultra",
      "Unlimited Saved Characters",
      "Unlimited Voice Cloning",
      "Character Emotion Control",
      "Character Animation Sync",
      "50+ Premium Templates",
      "Export Presets & Batch Assignment",
      "20 Team Members",
      "Dedicated Account Manager",
    ],
  },
];

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ text, variant }: { text: string; variant: "green" | "purple" | "gold" }) {
  const styles = {
    green: "border-[rgba(48,209,88,0.4)] bg-[rgba(48,209,88,0.1)] text-[#30d158]",
    purple: "border-[rgba(191,90,242,0.4)] bg-[rgba(191,90,242,0.1)] text-[#bf5af2]",
    gold: "border-[rgba(255,159,10,0.4)] bg-[rgba(255,159,10,0.1)] text-[#ff9f0a]",
  };
  return (
    <span className={`inline-block rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${styles[variant]}`}>
      {text}
    </span>
  );
}

// ─── Pricing card ────────────────────────────────────────────────────────────

function PricingCard({
  plan,
  billing,
  onSelect,
}: {
  plan: Plan;
  billing: Billing;
  onSelect: (id: string) => void;
}) {
  const isAnnual = billing === "annual";
  const displayPrice = isAnnual ? plan.annualMonthly : plan.monthlyPrice;

  const cardBorder = plan.highlighted
    ? "border-[#bf5af2]"
    : plan.goldGlow
    ? "border-[rgba(255,159,10,0.5)]"
    : plan.badgeVariant === "green"
    ? "border-[rgba(48,209,88,0.3)]"
    : "border-[rgba(255,255,255,0.07)]";

  const cardShadow = plan.highlighted
    ? "shadow-[0_0_50px_rgba(191,90,242,0.2),0_0_20px_rgba(255,45,85,0.1)]"
    : plan.goldGlow
    ? "shadow-[0_0_50px_rgba(255,159,10,0.15)]"
    : "";

  const ctaClass = plan.primaryCta
    ? "btn-red-glow w-full rounded-xl py-3.5 font-body font-semibold"
    : "w-full rounded-xl border border-[rgba(255,255,255,0.12)] py-3.5 font-body font-semibold text-[#e8e8f0] transition-all duration-200 hover:border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.04)]";

  return (
    <div
      className={`relative flex min-w-[272px] flex-col rounded-xl border bg-[#111118] p-6 transition-all duration-200 snap-center sm:min-w-0 ${cardBorder} ${cardShadow}`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#bf5af2] px-4 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-white shadow-[0_0_16px_rgba(191,90,242,0.5)]">
          ⭐ Most Popular
        </div>
      )}

      {/* Badge */}
      <div className="mb-3 min-h-[28px]">
        {plan.badge && plan.badgeVariant && (
          <Badge text={plan.badge} variant={plan.badgeVariant} />
        )}
      </div>

      {/* Plan name + tagline */}
      <p className="font-mono text-xs uppercase tracking-[3px] text-[#6b6b80]">{plan.name}</p>
      <p className="mt-1 font-body text-sm text-[#6b6b80]">{plan.tagline}</p>

      {/* Price */}
      <div className="mt-4 flex items-end gap-1.5">
        {isAnnual && (
          <span className="mb-1.5 font-body text-sm text-[#6b6b80] line-through">
            ${plan.monthlyPrice.toFixed(2)}
          </span>
        )}
        <span
          className="font-display leading-none tracking-wide text-5xl text-[#e8e8f0]"
          style={{ fontVariantNumeric: "tabular-nums", minWidth: "5ch" }}
        >
          ${displayPrice.toFixed(2)}
        </span>
        <span className="mb-1.5 font-body text-sm text-[#6b6b80]">/mo</span>
      </div>

      {isAnnual ? (
        <div className="mt-2 flex items-center gap-2 min-h-[28px]">
          <span className="font-body text-xs text-[#6b6b80]">${plan.annualTotal}/yr billed annually</span>
          <span className="rounded-full bg-[rgba(48,209,88,0.12)] px-2 py-0.5 font-mono text-[10px] text-[#30d158]">
            Save ${plan.annualSaving}/yr
          </span>
        </div>
      ) : (
        <div className="min-h-[28px] mt-2" />
      )}

      {/* Credits highlight */}
      <div
        className={`mt-4 rounded-lg px-4 py-2.5 text-center ${
          plan.highlighted
            ? "border border-[rgba(191,90,242,0.2)] bg-[rgba(191,90,242,0.08)]"
            : plan.goldGlow
            ? "border border-[rgba(255,159,10,0.2)] bg-[rgba(255,159,10,0.06)]"
            : "bg-[rgba(255,255,255,0.04)]"
        }`}
      >
        <span
          className={`font-body text-sm font-semibold ${
            plan.highlighted ? "text-[#bf5af2]" : plan.goldGlow ? "text-[#ff9f0a]" : "text-[#e8e8f0]"
          }`}
        >
          {plan.credits} credits/month
        </span>
      </div>

      {/* Features */}
      <ul className="mt-5 flex flex-1 flex-col gap-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 font-body text-sm text-[#e8e8f0]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
              <path d="M3 8l3.5 3.5L13 5" stroke="#30d158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button onClick={() => onSelect(plan.id)} className={`mt-6 ${ctaClass}`}>
        Select Plan
      </button>
    </div>
  );
}

// ─── Billing toggle ───────────────────────────────────────────────────────────

function BillingToggle({ value, onChange }: { value: Billing; onChange: (v: Billing) => void }) {
  return (
    <div className="flex items-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1a1a24] p-1">
      {(["monthly", "annual"] as Billing[]).map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`relative flex items-center gap-2 rounded-lg px-5 py-2.5 font-body text-sm font-medium transition-all duration-200 ${
            value === opt
              ? "bg-[#111118] text-[#e8e8f0] shadow-sm"
              : "text-[#6b6b80] hover:text-[#e8e8f0]"
          }`}
        >
          {opt === "monthly" ? "Monthly" : "Annual"}
          {opt === "annual" && (
            <span className="rounded-full bg-[#30d158] px-1.5 py-0.5 font-mono text-[10px] font-bold text-black leading-none">
              −2 mo
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function PricingSection({ onCtaClick }: { onCtaClick?: () => void }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  const router = useRouter();

  function handleSelect(planId: string) {
    if (onCtaClick) {
      onCtaClick();
    } else {
      router.push(`/auth?plan=${planId}`);
    }
  }

  return (
    <section id="pricing" className="bg-[#111118] px-5 py-24">
      <div className="mx-auto max-w-[1400px]">

        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="font-display text-5xl tracking-wider text-[#e8e8f0] sm:text-6xl">
            SIMPLE <span className="gradient-text">PRICING</span>
          </h2>
          <p className="mt-3 font-body text-[#6b6b80]">Start creating. Pay as you grow.</p>
        </div>

        {/* Competitor comparison */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2.5 rounded-full border border-[rgba(48,209,88,0.3)] bg-[rgba(48,209,88,0.08)] px-5 py-2.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3.5 3.5L13 5" stroke="#30d158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-body text-sm text-[#30d158]">
              Up to <span className="font-semibold">$258/year cheaper</span> than competitors
            </span>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="mb-10 flex justify-center">
          <BillingToggle value={billing} onChange={setBilling} />
        </div>

        {/* Cards */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 xl:grid-cols-5">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billing={billing}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <p className="mt-10 text-center font-body text-sm text-[#6b6b80]">
          Payments via Stripe &nbsp;·&nbsp; Cancel anytime &nbsp;·&nbsp; 30-day money-back guarantee
        </p>
      </div>
    </section>
  );
}
